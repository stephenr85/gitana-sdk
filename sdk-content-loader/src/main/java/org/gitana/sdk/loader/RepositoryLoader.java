package org.gitana.sdk.loader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import org.gitana.repo.association.Direction;
import org.gitana.repo.client.Branch;
import org.gitana.repo.client.Repository;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

import org.gitana.repo.client.SecurityPrincipal;
import org.gitana.repo.client.SecurityUser;
import org.gitana.repo.client.nodes.Association;
import org.gitana.repo.client.nodes.Node;
import org.gitana.repo.client.services.Branches;
import org.gitana.repo.client.services.Definitions;
import org.gitana.repo.client.services.Nodes;
import org.gitana.repo.client.types.TypeDefinition;
import org.gitana.repo.namespace.QName;
import org.gitana.repo.query.QueryBuilder;
import org.gitana.util.ClasspathUtil;
import org.gitana.util.JsonUtil;

/**
 * Loader for setting up users.
 * <p/>
 * Created by IntelliJ IDEA.
 * User: drq
 * Date: 4/20/11
 * Time: 9:37 AM
 * To change this template use File | Settings | File Templates.
 */
public class RepositoryLoader extends AbstractLoader {

    private Map<String, Repository> gitanaRepositories;
    private String repositoryLoadMode;
    private ObjectNode repositoryObj;
    private Map<String, SecurityUser> gitanaUsers;
    private Repository repository;

    private static Log logger = LogFactory.getLog(RepositoryLoader.class);

    /**
     * @throws Exception
     */
    public RepositoryLoader() throws Exception {
        super();
        this.gitanaRepositories = gitana.repositories().map();
        this.gitanaUsers = gitana.users().map();
        this.repositoryLoadMode = this.loaderConfig.getString("repository.load.mode") == null ? "update" : this.loaderConfig.getString("repository.load.mode");
        this.repositoryObj = this.loadJsonFromClasspath("org/gitana/sdk/loader/repository/repository.json");
    }

    /**
     * @param title
     * @param description
     * @return
     */
    public Repository getRepository(String title, String description, JsonNode tags) {

        QueryBuilder builder = QueryBuilder.start("title").is(title).and("description").is(description);

        if (tags != null && tags.isArray()) {
            for (Iterator<JsonNode> tag = tags.getElements(); tag.hasNext();) {
                builder.and("tags").is(tag.next().getTextValue());
            }
        }
        ObjectNode query = builder.get();
        Map<String, Repository> results = gitana.repositories().query(query);

        if (results.size() > 0) {
            Repository repo = results.values().iterator().next();
            logger.info("Existing repo ::" + repo.getId());
            logger.info("Existing repo title ::" + repo.getTitle());
            logger.info("Existing repo description ::" + repo.getDescription());
            logger.info("Existing repo tags  :: " + repo.get("tags").toString());
            return repo;
        }
        return null;
    }

    /**
     *
     */
    public Repository loadRepository() throws Exception {

        String repositoryTitle = repositoryObj.get("title").getTextValue();
        String repositoryDescription = repositoryObj.get("description").getTextValue();

        this.repository = getRepository(repositoryTitle, repositoryDescription, repositoryObj.get("tags"));

        ObjectNode repoConfigs = JsonUtil.createObject("{'title': '" + repositoryTitle + "', 'description':'" + repositoryDescription + "'}");
        repoConfigs.put("tags", repositoryObj.get("tags"));

        if (this.repository != null) {
            if (this.repositoryLoadMode.equals("overwrite")) {
                logger.info("Repository exists. Delete it and then create a new one.");
                this.repository.delete();
                this.repository = gitana.repositories().create(repoConfigs);
            } else {
                logger.info("Repository exists. ID :: " + repository.getId());
            }
        } else {
            logger.info("Repository doesn't exist. Create a new one.");
            this.repository = gitana.repositories().create(repoConfigs);
        }

        logger.info("Repository title  :: " + repositoryTitle);
        this.repository.setTitle(repositoryTitle);
        logger.info("Repository description  :: " + repositoryDescription);
        this.repository.setDescription(repositoryDescription);

        this.repository.update();

        // Validate the repository
        this.repository = gitana.repositories().read(this.repository.getId());
        logger.info("Updated repository id  :: " + this.repository.getId());
        logger.info("Updated repository title  :: " + this.repository.getTitle());
        logger.info("Updated repository description  :: " + this.repository.getDescription());
        logger.info("Updated repository tags  :: " + this.repository.get("tags").toString());

        // Manage authorities
        if (repositoryObj.get("authorities") != null) {
            JsonNode authoritiesNode = repositoryObj.get("authorities");
            if (authoritiesNode != null) {
                Iterator<String> it = authoritiesNode.getFieldNames();
                while (it.hasNext()) {
                    String authority = it.next();
                    logger.info("Add users with authority " + authority);
                    for (JsonNode userNode : authoritiesNode.get(authority)) {
                        String userId = userNode.getTextValue();
                        if (userId != null) {
                            this.repository.grant(userId, authority);
                            logger.info("Grant user " + userId + " with authority " + authority);
                        }
                    }
                }
            }
        }

        // Load master branch
        if (repositoryObj.get("master") != null) {
            this.loadBranch(repositoryObj.get("master"), repository.branches().read("master"));
        }
        // Manage files
        if (repositoryObj.get("files") != null) {
            for (JsonNode fileObj : repositoryObj.get("files")) {
                if (fileObj.get("name") != null && fileObj.get("path") != null && fileObj.get("mimeType") != null) {
                    try {
                        byte[] bytes = ClasspathUtil.bytesFromClasspath(fileObj.get("path").getTextValue());
                        this.repository.uploadFile(fileObj.get("name").getTextValue(), bytes, fileObj.get("mimeType").getTextValue());
                        logger.info("Upload file  :: " + fileObj.get("name").getTextValue());
                    } catch (Exception e) {
                        logger.error("Failed to upload file.", e);
                    }
                }
            }
        }

        return this.repository;
    }

    /**
     * @param title
     * @param description
     * @return
     */
    public Branch getBranch(String title, String description) {

        QueryBuilder builder = QueryBuilder.start("title").is(title).and("description").is(description);

        ObjectNode query = builder.get();
        Map<String, Branch> results = repository.branches().query(query);

        if (results.size() > 0) {
            Branch branch = results.values().iterator().next();
            logger.info("Existing branch ::" + branch.getId());
            logger.info("Existing repo title ::" + branch.getTitle());
            logger.info("Existing repo description ::" + branch.getDescription());
            return branch;
        }
        return null;
    }

    /**
     * @param folderObj
     * @param branch
     * @param parentNode
     * @param nodes
     * @return
     */
    public Node loadFolder(JsonNode folderObj, Branch branch, Node parentNode, Nodes nodes) {
        ObjectNode newFolderObj = JsonUtil.createObject();
        if (folderObj.get("qname") != null) {
            newFolderObj.put("_qname", folderObj.get("qname").getTextValue());
        }
        if (folderObj.get("title") != null) {
            newFolderObj.put("title", folderObj.get("title").getTextValue());
        }
        if (folderObj.get("description") != null) {
            newFolderObj.put("description", folderObj.get("description").getTextValue());
        }
        ObjectNode featuresObj = null;
        try {
            featuresObj = JsonUtil.createObject("{\"f:container\": {\"active\": true}}");
        } catch (Exception e) {
            logger.error("Failed to parse Json for features.", e);
        }
        newFolderObj.put("_features", featuresObj);
        Node folder = nodes.create(newFolderObj);
        logger.info("Folder QName  :: " + folder.getQName());
        logger.info("Folder title  :: " + folder.getTitle());
        logger.info("Folder description  :: " + folder.getDescription());
        if (parentNode != null) {
            logger.info("Set Parent-Child  :: " + parentNode.getQName() + "-" + folder.getQName());
            parentNode.associate(folder, QName.create("a:child"));
        }

        // Manage content
        if (folderObj.get("content") != null) {
            for (JsonNode contentObj : folderObj.get("content")) {
                if (contentObj.get("qname") != null) {
                    try {
                        ObjectNode newContentObj;
                        if (contentObj.get("path") != null) {
                            newContentObj = this.loadJsonFromClasspath(contentObj.get("path").getTextValue());
                        } else {
                            newContentObj = JsonUtil.createObject();
                        }
                        newContentObj.put("_qname", contentObj.get("qname").getTextValue());
                        if (contentObj.get("type") != null) {
                            newContentObj.put("_type", contentObj.get("type").getTextValue());
                        }
                        if (contentObj.get("title") != null) {
                            newContentObj.put("title", contentObj.get("title").getTextValue());
                        }
                        if (contentObj.get("description") != null) {
                            newContentObj.put("description", contentObj.get("description").getTextValue());
                        }
                        Node content = nodes.create(newContentObj);
                        folder.associate(content, QName.create("a:child"));
                        logger.info("Create content  :: " + content.getId());
                        logger.info("Create content  :: " + content.getQName());
                        // Manage attachments
                        if (contentObj.get("attachments") != null) {
                            for (JsonNode attachmentObj : contentObj.get("attachments")) {
                                if (attachmentObj.get("name") != null && attachmentObj.get("path") != null && attachmentObj.get("mimeType") != null) {
                                    try {
                                        byte[] bytes = ClasspathUtil.bytesFromClasspath(attachmentObj.get("path").getTextValue());
                                        content.uploadAttachment(attachmentObj.get("name").getTextValue(), bytes, attachmentObj.get("mimeType").getTextValue());
                                        logger.info("Add attachment  :: " + attachmentObj.get("name").getTextValue());
                                    } catch (Exception e1) {
                                        logger.error("Failed to add attachment.", e1);
                                    }
                                }
                            }
                        }
                    } catch (Exception e) {
                        logger.error("Failed to upload file.", e);
                    }
                }
            }
        }

        if (folderObj.get("folders") != null) {
            for (JsonNode subFolderObj : folderObj.get("folders")) {
                loadFolder(subFolderObj, branch, folder, nodes);
            }
        }
        return folder;
    }

    /**
     * @param branchObj
     * @param branch
     * @return
     */
    public Branch loadBranch(JsonNode branchObj, Branch branch) {

        // Update branch attributes
        if (branchObj.get("title") != null) {
            String title = branchObj.get("title").getTextValue();
            logger.info("Branch title  :: " + title);
            branch.setTitle(title);
        }

        if (branchObj.get("description") != null) {
            String description = branchObj.get("description").getTextValue();
            logger.info("Branch description  :: " + description);
            branch.setDescription(description);
        }

        branch.update();

        Definitions definitions = branch.definitions();

        // Manage definitions
        if (branchObj.get("definitions") != null) {
            for (JsonNode definitionObj : branchObj.get("definitions")) {
                String qname = definitionObj.get("qname").getTextValue();
                String path = definitionObj.get("path").getTextValue();
                if (qname != null && path != null) {
                    try {
                        QName definitionQName = QName.create(qname);
                        ObjectNode definitionNode = this.loadJsonFromClasspath(path);
                        Node definition = definitions.read(definitionQName);
                        if (definition != null) {
                            logger.info("Definition exists. Delete it first.");
                            definition.delete();
                        }
                        logger.info("Create definition " + qname + ".");
                        definition = definitions.defineType(definitionQName, definitionNode);
                        // Validate the definition
                        //TODO: Bug with read?
                        // definition = definitions.read(definition.getQName());
                        if (definition != null) {
                            logger.info("Definition QName  :: " + definition.getQName());
                            logger.info("Definition title  :: " + definition.getTitle());
                            logger.info("Definition description  :: " + definition.getDescription());
                        }
                    } catch (IOException e) {
                        logger.error("Failed to load definition from " + path, e);
                    }
                }
            }

        }
        // Manage authorities
        if (branchObj.get("authorities") != null) {
            JsonNode authoritiesNode = branchObj.get("authorities");
            if (authoritiesNode != null) {
                Iterator<String> it = authoritiesNode.getFieldNames();
                while (it.hasNext()) {
                    String authority = it.next();
                    logger.info("Add users with authority " + authority);
                    for (JsonNode userNode : authoritiesNode.get(authority)) {
                        String userId = userNode.getTextValue();
                        if (userId != null) {
                            branch.grant(userId, authority);
                            logger.info("Grant user " + userId + " with authority " + authority + " to branch " + branch.getId());
                            // Now check
                            for (String myAuthority : branch.getAuthorities(userId)) {
                                logger.info("User " + userId + " has authority " + myAuthority);
                            }
                        }
                    }
                }
            }
        }

        // Manage forms
        if (branchObj.get("forms") != null) {
            JsonNode formsObj = branchObj.get("forms");
            if (formsObj != null) {
                Iterator<String> it = formsObj.getFieldNames();
                while (it.hasNext()) {
                    String definitionQName = it.next();
                    TypeDefinition definition = (TypeDefinition) definitions.read(QName.create(definitionQName));
                    if (definition != null) {
                        logger.info("Add forms for definition " + definitionQName);
                        for (JsonNode formObj : formsObj.get(definitionQName)) {
                            String formKey = formObj.get("formKey").getTextValue();
                            String path = formObj.get("path").getTextValue();
                            if (formKey != null && path != null) {
                                try {
                                    ObjectNode formNode = this.loadJsonFromClasspath(path);
                                    definition.forms().create(formKey, formNode);
                                    logger.info("Add form :: " + formKey);
                                } catch (IOException e) {
                                    logger.error("Failed to load form from " + path, e);
                                }
                            }
                        }
                    }
                }
            }
        }

        // Manage association types
        if (branchObj.get("associationTypes") != null) {
            for (JsonNode associationTypeObj : branchObj.get("associationTypes")) {
                String qnameStr = associationTypeObj.getTextValue();
                QName qname = QName.create(qnameStr);
                definitions.defineAssociationType(qname);
                logger.info("Create association type  :: " + qnameStr);
            }

        }
        // Manage folders
        if (branchObj.get("folders") != null) {
            Nodes nodes = branch.nodes();
            for (JsonNode folderObj : branchObj.get("folders")) {
                loadFolder(folderObj, branch, null, nodes);
            }
        }
        // Manage associations
        if (branchObj.get("associations") != null) {
            for (JsonNode associationObj : branchObj.get("associations")) {
                String typeQnameStr = associationObj.get("associationType").getTextValue();
                QName typeQname = QName.create(typeQnameStr);
                String sourceQnameStr = associationObj.get("source").getTextValue();
                String targetQnameStr = associationObj.get("target").getTextValue();
                Direction direction = Direction.BOTH;
                if (associationObj.get("direction") != null) {
                    direction = Direction.valueOf(associationObj.get("direction").getTextValue());
                }
                Node sourceNode = branch.nodes().read(sourceQnameStr);
                Node targetNode = branch.nodes().read(targetQnameStr);
                if (sourceNode != null && targetNode != null) {
                    Association association = sourceNode.associate(targetNode, typeQname, direction);
                    logger.info("Create " + typeQnameStr + " Association :: " + sourceQnameStr + "<=>" + targetQnameStr + " (" + direction + ")");
                    JsonNode associationDetailsObj = associationObj.get("associationDetails");
                    if (associationDetailsObj != null) {
                        Iterator<String> it = associationDetailsObj.getFieldNames();
                        while (it.hasNext()) {
                            String fieldName = it.next();
                            association.set(fieldName, associationDetailsObj.get(fieldName));
                        }
                        association.update();
                        logger.info("Updated Association ::" + association.toJSONString(true));
                    }
                }
            }
        }

        // Validate the branch
        branch = repository.branches().read(branch.getId());
        logger.info("Updated branch id  :: " + branch.getId());
        logger.info("Updated branch title  :: " + branch.getTitle());
        logger.info("Updated branch description  :: " + branch.getDescription());

        // Load sub branches
        if (branchObj.get("branches") != null) {
            for (JsonNode subBranchObj : branchObj.get("branches")) {
                String subBranchTitle = subBranchObj.get("title").getTextValue();
                String subBranchDescription = subBranchObj.get("description").getTextValue();
                Branch subBranch = this.getBranch(subBranchTitle, subBranchDescription);
                if (subBranch != null) {
                    /*
                    if (this.repositoryLoadMode.equals("overwrite")) {
                        logger.info("Branch exists. Delete it and then create a new one.");
                    } else {
                        logger.info("Branch exists. ID :: " + subBranch.getId());
                    }
                    */
                    logger.info("Branch exists. ID :: " + subBranch.getId());
                } else {
                    logger.info("branch doesn't exist. Create a new one.");
                    subBranch = this.repository.branches().create(branch.getTipChangesetId());
                }
                this.loadBranch(subBranchObj, subBranch);
            }
        }

        return branch;
    }

}

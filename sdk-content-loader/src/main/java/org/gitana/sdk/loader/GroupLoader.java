package org.gitana.sdk.loader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import org.gitana.repo.client.SecurityGroup;

import java.io.IOException;
import java.util.Map;

import org.gitana.repo.client.SecurityPrincipal;
import org.gitana.repo.client.SecurityUser;
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
public class GroupLoader extends AbstractLoader {

    private Map<String, SecurityGroup> gitanaGroups;
    private String groupLoadMode;
    private ObjectNode groupListObj;
    private Map<String, SecurityUser> gitanaUsers;

    private static Log logger = LogFactory.getLog(GroupLoader.class);

    /**
     * @throws Exception
     */
    public GroupLoader() throws Exception {
        super();
        this.gitanaGroups = this.server.fetchGroups();
        this.gitanaUsers = this.server.fetchUsers();
        this.groupLoadMode = this.loaderConfig.getString("group.load.mode") == null ? "update" : this.loaderConfig.getString("group.load.mode");
        this.groupListObj = this.loadJsonFromClasspath("org/gitana/sdk/loader/security/groups.json");
    }

    /**
     *
     */
    public void loadGroups() {
        JsonNode groupsObj = groupListObj.get("groups");
        if (groupsObj != null) {
            for (JsonNode groupObj : groupsObj) {
                this.loadGroup(groupObj);
            }
        }
    }

    /**
     *
     */
    public SecurityGroup loadGroup(JsonNode groupObj) {
        String groupId = groupObj.get("id").getTextValue();
        logger.info("Loading group " + groupId);
        if (groupId != null) {
            // Setup group.
            SecurityGroup group = this.gitanaGroups.get(groupId);
            if (group != null) {
                if (this.groupLoadMode.equals("overwrite")) {
                    logger.info("Group exists. Delete it and then create a new one.");
                    group.delete();
                    group = this.server.createGroup(groupId);
                } else {
                    logger.info("Group exists. Update it.");
                }
            } else {
                logger.info("Group doesn't exist. Create a new one.");
                group = this.server.createGroup(groupId);
            }
            // Update group attributes
            if (groupObj.get("name") != null) {
                String name = groupObj.get("name").getTextValue();
                logger.info("Group name  :: " + name);
                group.setTitle(name);
            }
            if (groupObj.get("description") != null) {
                String description = groupObj.get("description").getTextValue();
                logger.info("Group description  :: " + description);
                group.setDescription(description);
            }

            group.update();

            try {

                if (groupObj.get("avatar") != null && groupObj.get("avatar").get("path") != null) {
                    String avatarPath = groupObj.get("avatar").get("path").getTextValue();
                    // upload avatar.
                    logger.info("User avatar image  :: " + avatarPath);
                    byte[] avatarBytes = ClasspathUtil.bytesFromClasspath(groupObj.get("avatar").get("path").getTextValue());
                    group.uploadAttachment("avatar", avatarBytes, groupObj.get("avatar").get("mimeType").getTextValue());
                }
            } catch (IOException e) {
                logger.error("Failed to upload avatar for group " + groupId, e);
            }

            // Adds members
            if (groupObj.get("members") != null) {
                for (JsonNode userIdObj : groupObj.get("members")) {
                    String userId = userIdObj.getTextValue();
                    if (this.gitanaUsers.containsKey(userId)) {
                        if (!group.fetchPrincipals().containsKey(userId)) {
                            logger.info("Add user  :: " + userId);
                            group.addPrincipal(userId);
                        }
                    }
                }
            }

            // Adds sub-groups
            if (groupObj.get("groups") != null) {
                for (JsonNode subGroupObj : groupObj.get("groups")) {
                    SecurityGroup loadedGroup = loadGroup(subGroupObj);
                    if (loadedGroup != null) {
                        if (!group.fetchPrincipals().containsKey(loadedGroup.getId())) {
                            logger.info("Add sub group  :: " + loadedGroup.getId());
                            group.addPrincipal(loadedGroup);
                        }
                    }
                }
            }

            // Makes sure we actually update/create it
            logger.info("Finished loading group " + groupId);
            //group = gitanaGroups.get(groupId);
            group = this.server.readGroup(groupId);
            logger.info("Updated group name  :: " + group.getTitle());
            logger.info("Updated group description  :: " + group.getDescription());
            for (SecurityPrincipal child : group.listPrincipals()) {
                logger.info("Updated group child  :: " + child.getId() + " (" + child.getPrincipalType() + ")");
            }

            return group;

        } else {
            return null;
        }
    }

}

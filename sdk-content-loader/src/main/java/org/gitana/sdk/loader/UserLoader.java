package org.gitana.sdk.loader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import org.gitana.repo.client.SecurityUser;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import org.gitana.repo.client.nodes.Node;
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
public class UserLoader extends AbstractLoader {

    private Map<String, SecurityUser> gitanaUsers;
    private String userLoadMode;
    private ObjectNode userListObj;

    private static Log logger = LogFactory.getLog(UserLoader.class);

    /**
     * @throws Exception
     */
    public UserLoader() throws Exception {
        super();
        this.gitanaUsers = server.fetchUsers();
        this.userLoadMode = this.loaderConfig.getString("user.load.mode") == null ? "update" : this.loaderConfig.getString("user.load.mode");
        this.userListObj = this.loadJsonFromClasspath("org/gitana/sdk/loader/security/users.json");
    }

    /**
     *
     */
    public void loadUsers() {
        JsonNode usersObj = userListObj.get("users");
        if (usersObj != null) {
            for (JsonNode userObj : usersObj) {
                this.loadUser(userObj);
            }
        }
    }

    /**
     *
     */
    public void loadUser(JsonNode userObj) {
        String userId = userObj.get("id").getTextValue();
        logger.info("Loading user " + userId);
        if (userId != null) {
            // Setup user.
            SecurityUser user = this.gitanaUsers.get(userId);
            if (user != null) {
                if (this.userLoadMode.equals("overwrite")) {
                    logger.info("User exists. Delete it and then create a new one.");
                    user.delete();
                    user = this.server.createUser(userId, "password");
                    this.server.grant(userId, "collaborator");
                } else {
                    logger.info("User exists. Update it.");
                    this.server.grant(userId, "collaborator");
                }
            } else {
                logger.info("User doesn't exist. Create a new one.");
                user = this.server.createUser(userId, "password");
                this.server.grant(userId, "collaborator");
            }
            // Update user attributes
            if (userObj.get("firstName") != null) {
                String firstName = userObj.get("firstName").getTextValue();
                logger.info("User first name  :: " + firstName);
                user.setFirstName(firstName);
            }
            if (userObj.get("lastName") != null) {
                String lastName = userObj.get("lastName").getTextValue();
                logger.info("User last name  :: " + lastName);
                user.setLastName(lastName);
            }
            if (userObj.get("email") != null) {
                String email = userObj.get("email").getTextValue();
                logger.info("User email  :: " + email);
                user.setEmail(email);
            }
            if (userObj.get("companyName") != null) {
                String companyName = userObj.get("companyName").getTextValue();
                logger.info("User compnay name :: " + companyName);
                user.setCompanyName(companyName);
            }

            user.update();

            try {

                if (userObj.get("avatar") != null && userObj.get("avatar").get("path") != null) {
                    String avatarPath = userObj.get("avatar").get("path").getTextValue();
                    // upload avatar.
                    logger.info("User avatar image  :: " + avatarPath);
                    byte[] avatarBytes = ClasspathUtil.bytesFromClasspath(userObj.get("avatar").get("path").getTextValue());
                    user.uploadAttachment("avatar", avatarBytes,userObj.get("avatar").get("mimeType").getTextValue());
                }
            } catch (IOException e) {
                logger.error("Failed to upload avatar for user " + userId, e);
            }

            // Makes sure we actually update/create it
            logger.info("Finished loading user " + userId);
            user = this.server.readUser(userId);
            logger.info("Updated user first name  :: " + user.getFirstName());
            logger.info("Updated user last name  :: " + user.getLastName());
            logger.info("Updated user email  :: " + user.getEmail());
            logger.info("Updated user company name  :: " + user.getCompanyName());

            for (String authority : this.server.getAuthorities(userId)) {
                logger.info("User authority  :: " + authority);
            }
        }
    }

}

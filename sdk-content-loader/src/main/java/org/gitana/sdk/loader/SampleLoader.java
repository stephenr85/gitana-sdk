package org.gitana.sdk.loader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.gitana.repo.client.Repository;

/**
 * Created by IntelliJ IDEA.
 * User: drq
 * Date: 4/20/11
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */
public class SampleLoader {
    /**
     * Log
     */
    private static Log logger = LogFactory.getLog(SampleLoader.class);

    /**
     * @param args
     */
    public static void main(String[] args) {

        if (args.length > 0) {
            logger.error("Usage: java org.gitana.sdk.loader.SampleLoader");
            return;
        }

        try {
            // Loads users
            UserLoader userLoader = new UserLoader();
            userLoader.loadUsers();
            // Loads groups
            GroupLoader groupLoader = new GroupLoader();
            groupLoader.loadGroups();
            // Loads repository
            RepositoryLoader repositoryLoader = new RepositoryLoader();
            Repository repository = repositoryLoader.loadRepository();
            SocialGraphLoader socialGraphLoader = new SocialGraphLoader(repository);
            socialGraphLoader.loadSocialGraph();
        } catch (Exception e) {
            logger.error("Failed to load gitana samples.", e);
        }
    }
}

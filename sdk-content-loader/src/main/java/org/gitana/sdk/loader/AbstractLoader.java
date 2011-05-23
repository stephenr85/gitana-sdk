package org.gitana.sdk.loader;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import org.gitana.repo.client.Gitana;
import org.gitana.repo.client.Server;
import org.gitana.util.JsonUtil;
import org.springframework.util.ClassUtils;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ResourceBundle;

/**
 * Base class for all loaders.
 * <p/>
 * User: drq
 * Date: 4/20/11
 * Time: 9:32 AM
 * To change this template use File | Settings | File Templates.
 */
public class AbstractLoader {

    private ResourceBundle serverConfig = null;
    protected ResourceBundle loaderConfig = null;
    protected Gitana gitana;
    protected Server server;

    /**
     * @throws Exception
     */
    public AbstractLoader() throws Exception {
        // load properties from classpath
        this.serverConfig = ResourceBundle.getBundle("gitana");
        this.loaderConfig = ResourceBundle.getBundle("loader");
        this.gitana = new Gitana();
        // authenticate
        this.server = gitana.authenticate("admin", "admin");
    }

    /**
     * @return
     */
    protected String getHost() {
        return this.serverConfig.getString("gitana.server.host");
    }

    /**
     * @return
     */
    protected int getPort() {
        return Integer.valueOf(this.serverConfig.getString("gitana.server.port"));
    }


    /**
     * @param path
     * @return
     * @throws IOException
     */
    protected ObjectNode loadJsonFromClasspath(String path)
            throws IOException {
        String value = null;

        InputStream in = getInputStreamFromClasspath(path);
        if (in != null) {
            value = FileCopyUtils.copyToString(new InputStreamReader(in));
            return JsonUtil.createObject(value);
        } else {
            return null;
        }
    }

    /**
     * Retrieves an input stream to a resource in the classpath
     *
     * @param path
     * @return
     * @throws IOException
     */
    protected InputStream getInputStreamFromClasspath(String path)
            throws IOException {
        InputStream in = null;

        URL resourceUrl = ClassUtils.getDefaultClassLoader().getResource(path);
        if (resourceUrl != null) {
            in = resourceUrl.openStream();
        }

        return in;
    }
}

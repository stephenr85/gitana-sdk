(function(window) {
    var gitanaConnector = new Gitana.Connector('gitana', {
        "userName": "admin",
        "password": "admin",
        "repositoryId" : {
            "title" : "Dunder Mifflin sample repository",
            "tags":["Demo","The office"]
        }
    });
    window.gitanaConnector = gitanaConnector;
})(window);
(function(window) {

    var Gitana = window.Gitana;

    Gitana.SDK.defaults = {
        userName : "admin",
        password : "admin",

        theOfficeRepositoryQuery: {
            "sdk_version": "0.1",
            "sdk_bundle": "theoffice"
        },
        creaturesRepositoryQuery: {
            "sdk_version": "0.1",
            "sdk_bundle": "creatures"
        },
        fortuneCookieRepositoryQuery: {
            "sdk_version": "0.1",
            "sdk_bundle": "fortunecookie"
        },
        errorHandler : function(error) {
            $('.error').html("Error message: " + error.message);
        },
        gitanaConnector : new Alpaca.Connectors.GitanaConnector('gitana', {
            "userName": "admin",
            "password": "admin",
            "repositoryId": {
                "title" : "Dunder Mifflin sample repository",
                "tags":["Demo",
                    "The office"]
            }
        }),
        sourceViewer : function(object) {
            var sourceViewDialog = $('<div id="node-json" title="View Source"></div>');
            var _this = this;
            sourceViewDialog.alpaca({
                "data": [
                    {
                        "title": "JSON Source",
                        "text": JSON.stringify(object, null, '&nbsp;')
                    }
                ],
                "view": {
                    "globalTemplate": '<div id="source-view-alpaca-field">{{each data}}<div><h3 style="text-decoration:underline;">${title}</h3><div><pre><code>${text}</pre></code></div></div>{{/each}}</div>'
                },
                "postRender": function(renderedNewFieldControl) {
                    sourceViewDialog.dialog({
                        resizable: true,
                        height: 550,
                        width: 800,
                        modal: false
                    });
                }
            });
        }
    };

})(window);
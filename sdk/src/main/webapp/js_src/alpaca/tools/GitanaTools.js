(function($) {
    $(document).ready(function() {
        var gitanaConnector = window.gitanaConnector;
        var connector = new Alpaca.Connectors.GitanaConnector('gitana', {
            "userName": "admin",
            "password": "admin",
            "repositoryId": {
                "title" : "Dunder Mifflin sample repository",
                "tags":["Demo",
                    "The office"]
            }
        });
        // render tools
        $('#tools').alpaca({
            "schema" : {
                "type":"object",
                "properties" : {
                    "queryType" : {
                        "title" : "Query Type",
                        "description": "Select type of your query",
                        "type" : "string",
                        "required" : true,
                        "default" : "query",
                        "enum" :[
                            "search",
                            "query",
                            "traversal"
                        ]
                    },
                    "query" : {
                        "title" : "Query Expression",
                        "description": "Enter Search, Query or Traversal query expression.",
                        "type" : "string"
                    }
                }
            },
            "options" : {
                "renderForm":true,
                "form":{
                    "buttons":{
                        "save":false,
                        "submit":false,
                        "reset":true
                    }
                },
                "fields" : {
                    "queryType" : {
                        "type" : "radio",
                        "optionLabels":[
                            "Full-text Search",
                            "Query",
                            "Traversal"
                        ]
                    },
                    "query" : {
                        "type" : "textarea",
                        "rows" : 10,
                        "cols" : 150
                    }
                }
            },
            "postRender" : function (renderedField) {
                var form = renderedField.form;
                form.addButton({
                    "data" : "Run",
                    "postRender" : function(buttonControl) {
                        buttonControl.field.button({
                            text: true,
                            icons: {
                                primary: "ui-icon-play"
                            }
                        }).click(function() {
                            buttonControl.field.removeClass("ui-state-focus ui-state-hover");
                            var val = renderedField.getValue();
                            var queryType = val.queryType;
                            var queryExpression = JSON.parse(val.query);

                            connector.connect(function (success) {
                                $('#results').empty().alpaca({
                                    "data": queryExpression,
                                    "render" : function(field, postRenderCallback) {
                                        $('#results').append('<div><pre><code>' + JSON.stringify(field.data, null, '&nbsp;') + '</pre></code></div>');
                                    },
                                    "connector": connector
                                });
                            });
                        });
                    }
                });
            }
        });

    });
})(jQuery);
(function($) {
    $(document).ready(function() {
        var gitanaConnector = window.gitanaConnector;
        var el = $('#latest_promotion');
        var connector = new Alpaca.Connectors.GitanaConnector('gitana', {
            "userName": "admin",
            "password": "admin",
            "repositoryId": {
                "title" : "Dunder Mifflin sample repository",
                "tags":["Demo",
                    "The office"]
            }
        });
        connector.connect(function (success) {
            el.alpaca({
                "view" : {
                    "globalTemplate": '../../templates/LatestPromotion.html'
                },
                "data": "theoffice:binderpromotion",
                "connector" : connector,
                "postRender": function (renderedField) {
                    var editButton = $("<button>Edit</button>").button(({
                        icons: {
                            primary: "ui-icon-pencil"
                        }
                    }));
                    editButton.click(function() {
                        editButton.removeClass("ui-state-focus ui-state-hover");
                        var editDialog = $('<div id="alpaca-edit-form" title="Edit latest promotion"></div>');
                        var _this = this;
                        connector.connect(function (success2) {
                            editDialog.alpaca({
                                "data": "theoffice:binderpromotion",
                                "options": "full",
                                "schema": "theoffice:promotion",
                                "view":"VIEW::WEB_EDIT_LIST",
                                "connector": connector,
                                "postRender": function(renderedNewFieldControl) {
                                    var saveButton = renderedNewFieldControl.form.saveButton;
                                    saveButton.hide();
                                    editDialog.dialog({
                                        resizable: true,
                                        height: 550,
                                        width: 650,
                                        modal: true,
                                        buttons: {
                                            "Save": function() {
                                                saveButton.field.click();
                                            }
                                        }
                                    });
                                    $('.ui-dialog').css("overflow", "hidden");
                                    $('.ui-dialog-buttonpane').css("overflow", "hidden");
                                    // add call backs to save button
                                    if (saveButton) {
                                        saveButton.success = function (updatedData) {
                                            el.empty();
                                            el.alpaca({
                                                "view" : {
                                                    "globalTemplate": '../../templates/LatestPromotion.html'
                                                },
                                                "data": updatedData
                                            });
                                            alert("Promotion updated!");
                                        };
                                    }
                                }
                            });
                        });
                    });
                    el.after(editButton);
                }
            });
        }, function(loadedError) {
        });
    });
})(jQuery);
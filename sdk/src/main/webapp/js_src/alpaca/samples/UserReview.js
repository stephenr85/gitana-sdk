(function($) {
    $(document).ready(function() {
        var gitanaConnector = window.gitanaConnector;
        var latestPromotionNode;
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

        // Render reviews
        var renderReviews = function (nodeId) {
            $('#front_page_products').empty();
            $('#front_page_products').alpaca({
                "view" : {
                    "globalTemplate": '../../templates/UserReviews.html'
                },
                "data": {
                    "traversal" : {
                        "sourceId":nodeId,
                        "associations": {
                            "theoffice:hasReview": "OUTGOING"
                        },
                        "depth": 1
                    }
                },
                "connector" : connector,
                "postRender": function (renderedReviews) {
                    $.each(renderedReviews.data.associationList, function(index, associationNode) {
                        var reviewIndicator = $('<div id="' + associationNode.target + '-indicator"></div>');
                        reviewIndicator.prependTo($('#' + associationNode.target));
                        reviewIndicator.alpaca({
                            "view" : {
                                "globalTemplate": '../../templates/UserReviewIndicators.html'
                            },
                            "data": associationNode,
                            "postRender" : function(renderedReviewIndicatorsField) {
                                var renderedReviewIndicators = renderedReviewIndicatorsField.data;
                                var helpfulButton = $('.helpfulbutton', renderedReviewIndicatorsField.container);
                                helpfulButton.click(function() {
                                    if (Alpaca.isEmpty(associationNode.helpfulCounter)) {
                                        associationNode.helpfulCounter = 1;
                                        associationNode.totalCounter = 1;
                                    } else {
                                        associationNode.helpfulCounter++;
                                        associationNode.totalCounter++;
                                    }
                                    associationNode.update(function(stats) {
                                        $('.helpfulindicator', renderedReviewIndicatorsField.container).html(associationNode.helpfulCounter + ' out of ' + (associationNode.totalCounter) + ' found this review helpful.');
                                    });
                                });
                                var unhelpfulButton = $('.unhelpfulbutton', renderedReviewIndicatorsField.container);
                                unhelpfulButton.click(function() {
                                    if (Alpaca.isEmpty(associationNode.helpfulCounter)) {
                                        associationNode.helpfulCounter = 1;
                                        associationNode.totalCounter = 1;
                                    } else {
                                        associationNode.totalCounter++;
                                    }
                                    associationNode.update(function(stats) {
                                        $('.helpfulindicator', renderedReviewIndicatorsField.container).html(associationNode.helpfulCounter + ' out of ' + (associationNode.totalCounter) + ' found this review helpful.');
                                    });
                                });
                                var spamIndicatorButton = $('.spambutton', renderedReviewIndicatorsField.container);
                                spamIndicatorButton.click(function() {
                                    if (Alpaca.isEmpty(associationNode.spamCounter)) {
                                        associationNode.spamCounter = 1;
                                    } else {
                                        associationNode.spamCounter++;
                                    }
                                    associationNode.update(function(stats) {
                                        $('.spamindicator', renderedReviewIndicatorsField.container).html(associationNode.spamCounter + ' people marked this review as spam or offensive.');
                                    });
                                });
                            }
                        });
                    });
                }
            });
        };

        connector.connect(function (success) {
            el.alpaca({
                "view" : {
                    "globalTemplate": '../../templates/LatestPromotion.html'
                },
                "data": "theoffice:binderpromotion",
                "connector" : connector,
                "postRender": function (renderedField) {
                    latestPromotionNode = renderedField.data;
                    var gitanaDriver = connector.gitanaDriver;

                    $('#review_metrics').alpaca({
                        "view" : {
                            "globalTemplate": '../../templates/UserReviewMetrics.html'
                        },
                        "data": {
                            "traversal" : {
                                "sourceId":latestPromotionNode.getId(),
                                "associations": {
                                    "theoffice:hasReviewMetrics": "BOTH"
                                },
                                "depth": 1
                            }
                        },
                        "connector" : connector
                    });

                    renderReviews(latestPromotionNode.getId());

                    var editButton = $("<button>Write a review</button>").button(({
                        icons: {
                            primary: "ui-icon-pencil"
                        }
                    }));
                    editButton.click(function() {
                        editButton.removeClass("ui-state-focus ui-state-hover");
                        var editDialog = $('<div id="alpaca-edit-form" title="Write a review"></div>');
                        var _this = this;
                        connector.connect(function (success2) {
                            editDialog.alpaca({
                                "options": "five_star",
                                "schema": "theoffice:review",
                                "view":{
                                    "parent" : "VIEW::WEB_EDIT_LIST",
                                    "type": "create"
                                },
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
                                            "Create": function() {
                                                // Do the actual work
                                                var reviewVal = renderedNewFieldControl.getValue();
                                                reviewVal._type = "theoffice:review";
                                                latestPromotionNode.getBranch().nodes().create(reviewVal, function(reviewNode) {
                                                    latestPromotionNode.associate(reviewNode.getId(), {
                                                        "_type" : "theoffice:hasReview",
                                                        "direction" : "OUTGOING"
                                                    }, function(status) {
                                                        // refresh the indicators
                                                        $('#review_metrics').alpaca({
                                                            "view" : {
                                                                "globalTemplate": '../../templates/UserReviewMetrics.html'
                                                            },
                                                            "data": {
                                                                "traversal" : {
                                                                    "sourceId":latestPromotionNode.getId(),
                                                                    "associations": {
                                                                        "theoffice:hasReviewMetrics": "BOTH"
                                                                    },
                                                                    "depth": 1
                                                                }
                                                            },
                                                            "connector" : connector,
                                                            "postRender": function (renderedReviewIndicators) {
                                                                var loadedAssociations = renderedReviewIndicators.data;
                                                                if (loadedAssociations.node_count == 0) {
                                                                    latestPromotionNode.getBranch().nodes().create({
                                                                        "_type" : "theoffice:reviewmetrics",
                                                                        "totalReviews" : 1,
                                                                        "averageRating" : reviewVal.rating
                                                                    }, function(reviewMetricsNode) {
                                                                        latestPromotionNode.associate(reviewMetricsNode.getId(), {
                                                                            "_type" : "theoffice:hasReviewMetrics",
                                                                            "direction" : "BOTH"
                                                                        }, function(status) {
                                                                            editDialog.dialog("close");
                                                                        });
                                                                    });
                                                                } else {
                                                                    var metricsNode = loadedAssociations.nodeList[0];
                                                                    var totalReviews = metricsNode.totalReviews;
                                                                    var averageRating = metricsNode.averageRating;
                                                                    metricsNode.averageRating = (averageRating * totalReviews + reviewVal.rating) / (totalReviews + 1);
                                                                    metricsNode.totalReviews ++;
                                                                    metricsNode.update(function(status) {
                                                                        $('#review_metrics').empty();
                                                                        $('#review_metrics').alpaca({
                                                                            "view" : {
                                                                                "globalTemplate": '../../templates/UserReviewMetrics.html'
                                                                            },
                                                                            "data": {
                                                                                "nodeList":[metricsNode]
                                                                            },
                                                                            "postRender": function(renderedReviewMatricsField) {
                                                                                editDialog.dialog("close");
                                                                            }
                                                                        });
                                                                    });

                                                                }
                                                            }
                                                        });
                                                        // refresh the reviews
                                                        renderReviews(latestPromotionNode.getId());
                                                    });
                                                });

                                            }
                                        }
                                    });
                                    $('.ui-dialog').css("overflow", "hidden");
                                    $('.ui-dialog-buttonpane').css("overflow", "hidden");
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
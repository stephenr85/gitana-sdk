$(function() {
    // Enable source view buttons
    $.each($("div[id^='field'],table[id^='field']"), function() {
        var currentId = $(this).attr('id');

        $(this).after('<div class="clear" style="min-height:10px;"></div><span><small><button id="' + currentId + '-code-button">Source Code</button></small></span><pre id="' + currentId + '-pre" style="margin: -15px 0px 0px 5px;"><code id="' + currentId + '-code" style="margin: 15px 0px 0px 5px;"></code></pre>').after('<div class="gitana-clear"></div>');
        $('#' + currentId + '-pre').hide();
        $('#' + currentId + '-code-button').button({
            icons: {
                primary: "ui-icon-circle-arrow-e"
            }
        }).click(function() {
            var code = $.trim($('#' + currentId + '-script').html());
            $('#' + currentId + '-code').html(code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
            $('#' + currentId + '-pre').toggle();
            $('.ui-icon', this).toggleClass("ui-icon-circle-arrow-e").toggleClass("ui-icon-circle-arrow-s");
        });
    });

    // Example JSON
    var examples = [
        {
            "title":"Gitana",
            "examples" : [
                {
                    "title": "Security",
                    "examples": [
                        {
                            "id":"security-login",
                            "title":"Login",
                            "link":"../../html/general/Login.html"
                        },
                        {
                            "id":"security-userinfo",
                            "title":"User Info",
                            "link":"../../html/general/UserInfo.html"
                        },
                        {
                            "id":"security-groupinfo",
                            "title":"Group Info",
                            "link":"../../html/general/GroupInfo.html"
                        }
                    ]
                },
                {
                    "title": "Repository",
                    "examples": [
                        {
                            "id":"repository-by-id",
                            "title":"Find Repository by ID",
                            "link":"../../html/general/RepositoryById.html"
                        },
                        {
                            "id":"repository-by-query",
                            "title":"Query Repositories",
                            "link":"../../html/general/RepositoryByQuery.html"
                        }
                    ]
                },
                {
                    "title": "Branch",
                    "examples": [
                        {
                            "id":"branch-by-id",
                            "title":"Find Branch by ID",
                            "link":"../../html/general/BranchById.html"
                        },
                        {
                            "id":"branch-by-query",
                            "title":"Query Branches",
                            "link":"../../html/general/BranchByQuery.html"
                        },
                        {
                            "id":"branch-crud",
                            "title":"Query Operations",
                            "link":"../../html/general/BranchCrud.html"
                        }
                    ]
                },
                {
                    "title": "Node",
                    "examples": [
                        {
                            "id":"node-crud",
                            "title":"Node Operations",
                            "link":"../../html/general/NodeCrud.html"
                        },
                        {
                            "id":"person-node",
                            "title":"Person Node",
                            "link":"../../html/general/PersonNode.html"
                        },
                        {
                            "id":"node-attachments",
                            "title":"Node Attachments",
                            "link":"../../html/general/NodeAttachments.html"
                        },
                        {
                            "id":"folder-node",
                            "title":"Folder Node",
                            "link":"../../html/general/FolderNode.html"
                        },
                        {
                            "id":"node-audit-records",
                            "title":"Node Audit Records",
                            "link":"../../html/general/NodeAuditRecords.html"
                        }
                    ]
                },
                {
                    "title": "Association",
                    "examples": [
                        {
                            "id":"association-crud",
                            "title":"Association Operations",
                            "link":"../../html/general/AssociationCrud.html"
                        }
                    ]
                },
                {
                    "title": "Search",
                    "examples": [
                        {
                            "id":"search-fulltext",
                            "title":"Full-Text Search",
                            "link":"../../html/general/SearchFullText.html"
                        },{
                            "id":"search-spatial",
                            "title":"Spatial Search",
                            "link":"../../html/general/SearchSpatial.html"
                        }
                    ]
                },
                {
                    "title": "Query",
                    "examples": [
                        {
                            "id":"query-examples",
                            "title":"Query Examples",
                            "link":"../../html/general/QueryExamples.html"
                        }
                    ]
                },
                {
                    "title": "Traverse",
                    "examples": [
                        {
                            "id":"traverse-examples",
                            "title":"Traverse Examples",
                            "link":"../../html/general/TraverseExamples.html"
                        }
                    ]
                }
            ]
        },
        {
            "title":"Gitana + jQuery Templating",
            "examples" : [
                {
                    "title": "Content Display",
                    "examples": [
                        {
                            "id":"promotion-display-single",
                            "title":"Promotion Item",
                            "link":"../../html/templating/PromotionDisplaySingle.html"
                        }
                    ]
                },
                {
                    "title": "Query",
                    "examples": [
                        {
                            "id":"frontpage-products",
                            "title":"Front Page Products",
                            "link":"../../html/templating/FrontPageProducts.html"
                        }
                    ]
                },
                {
                    "title": "Traverse",
                    "examples": [
                        {
                            "id":"related-products",
                            "title":"Related Products",
                            "link":"../../html/templating/RelatedProducts.html"
                        }
                    ]
                },
                {
                    "title": "Full-Text Search",
                    "examples": [
                        {
                            "id":"search-results",
                            "title":"Search by Keyword",
                            "link":"../../html/templating/SearchResults.html"
                        }
                    ]
                },
                {
                    "title": "Users and Groups",
                    "examples": [
                        {
                            "id":"user-details",
                            "title":"User Details",
                            "link":"../../html/general/UserDetails.html"
                        }
                    ]
                }
            ]
        },
        {
            "title":"Gitana + Alpaca",
            "examples" : [
                {
                    "title": "In-Context Editing",
                    "examples": [
                        {
                            "id":"promotion-incontext-editing-full",
                            "title":"Promotion with Full Form",
                            "link":"../../html/alpaca/PromotionInContextEditingFullForm.html"
                        },
                        {
                            "id":"promotion-incontext-editing-simple",
                            "title":"Promotion with Simple Form",
                            "link":"../../html/alpaca/PromotionInContextEditingSimpleForm.html"
                        }
                    ]
                },
                {
                    "title": "Advanced Content Modeling",
                    "examples": [
                        {
                            "id":"user-reviews",
                            "title":"Promotion With User Reviews",
                            "link":"../../html/alpaca/UserReviews.html"
                        }
                    ]
                }
            ]
        },
        {
            "title":"Sample Applications",
            "examples" : [
                {
                    "title": "Social Graph",
                    "examples": [
                        {
                            "id":"social-graph-app",
                            "title":"Social Graph Application",
                            "link":"../../html/alpaca/SocialGraph.html"
                        }
                    ]
                },
                {
                    "title": "Ratchet Driven Site",
                    "examples": [
                        {
                            "id":"the-office-site",
                            "title":"The Office Site",
                            "link":"../../html/ratchet/index.html"
                        }
                    ]
                }
            ]
        }
    ];

    var currentExampleId = $('.gitana-example-header').attr('id');

    function _renderSideBar(container, items) {
        var bar = $('<ul>' + items.title + '</span></ul>');
        $.each(items.examples, function(i, item) {
            var itemBar = $('<li></li>');
            if (item.examples) {
                _renderSideBar(itemBar, item);
            } else {
                var listItem = $('<span><span class="ui-icon ui-icon-document" style="float:left"></span><a href="' + item.link + '">' + item.title + '</a></span>');
                itemBar.append(listItem);
                if (item.id == currentExampleId) {
                    itemBar.addClass('ui-state-highlight');
                    $('title').html('Gitana SDK - '+item.title);
                }
                itemBar.hover(function() {
                    $(this).addClass('ui-state-hover');
                }, function() {
                    $(this).removeClass('ui-state-hover');
                });
            }
            itemBar.appendTo(bar);
        });
        bar.appendTo(container);
    }

    function renderSideBar(container) {
        $.each(examples, function(i, items) {
            container.append('<h3><a href="#">' + items.title + '</a></h3>');
            var bar = $('<ul></ul>');
            $.each(items.examples, function(i, item) {
                var itemBar = $('<li></li>');
                _renderSideBar(itemBar, item);
                itemBar.appendTo(bar);
            });
            bar.wrap('<div></div>');
            bar.appendTo(container);
        });
    }

    if (!Alpaca.isValEmpty(currentExampleId)) {
        var sideBar = $('<div id="sidebar"></div>');
        renderSideBar(sideBar);
        $('.gitana-example-body').prepend(sideBar).prepend('<div style="clear:both"></div>');
        $('#sidebar').wrap('<div class="gitana-example-sidebar"></div>');
        $('#sidebar').accordion({
            autoHeight: false,
            navigation: true
        });
        $('.gitana-example-header h2').prepend('<a href="../../index.html">SDK</a><span> :: </span>');
    }
});

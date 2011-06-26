$(function() {
    // Enable source view buttons
    $.each($("div[id^='field'],table[id^='field']"), function() {
        var currentId = $(this).attr('id');

        $(this).after('<div class="clear" style="min-height:10px;"></div><span><small><button id="' + currentId + '-code-button">Source Code</button></small></span><div class="code-block" id="' + currentId + '-block"><pre id="' + currentId + '-pre" class="brush: js; toolbar: false;"></pre></div>').after('<div class="gitana-clear"></div>');
        $('#' + currentId + '-block').hide();
        var code = $.trim($('#' + currentId + '-script').html());
        $('#' + currentId + '-pre').html(code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        $('#' + currentId + '-code-button').button({
            icons: {
                primary: "ui-icon-circle-arrow-e"
            }
        }).click(function() {
            $('#' + currentId + '-block').toggle();
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
                            "title":"Authentication",
                            "description":"To use any Gitana CloudCMS service, you will first need to authenticate with Gitana CloudCMS using Gitana user credential. This example shows how to use Alpaca to render a simple login form, catch invalid username/password error, authenticate with Gitana and logout Gitana after login. For each authenticated session, a valid ticket will be generated and stored as session cookie.",
                            "link":"../../html/general/Login.html"
                        },
                        {
                            "id":"security-userinfo",
                            "title":"User",
                            "description":"User is a global scope object within Gitana CloudCMS. It contains basic information about the user such as first name, last name, email, company name and avatar image. This example shows you how to retrieve user information as well as list of groups the user belongs to.",
                            "link":"../../html/general/UserInfo.html"
                        },
                        {
                            "id":"security-groupinfo",
                            "title":"Group",
                            "description":"Group is a global scope object within Gitana CloudCMS. It contains basic information about the group such as title, description and avatar image. This example shows you how to retrieve group information, list of group members and list of sub-groups.",
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
                            "description":"A Gitana CloudCMS repository is a workspace where you can place your content. Each repository is isolated from any of the other repositories in the Gitana CloundCMS so you can feel free to create a repository and then do anything you'd like with it is. Once you are authenticated to Gitana CloudCMS, most likely the next step will be to find the repository. This example shows you how to locate a repository through its ID.",
                            "link":"../../html/general/RepositoryById.html"
                        },
                        {
                            "id":"repository-by-query",
                            "title":"Query Repositories",
                            "description":"Gitana CloudCMS supports querying repositories by their property or combination of multiple properties. This examples shows you how to create such query and how to process query results.",
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
                            "description":"Branches describe units of work or changes within a repository. When a new repository is created, it comes with a single master branch which starts at the root of the repository. When user starts to make changes to the repository, he can work on the master branch or create his own branch either from master branch or any other existing branch. Each branch have a root changeset (their starting point) and a head changeset (where the tip currently resides). This example shows you how to get a list of existing branch and how to locate a branch by its ID.",
                            "link":"../../html/general/BranchById.html"
                        },
                        {
                            "id":"branch-by-query",
                            "title":"Query Branches",
                            "description":"Gitana CloudCMS supports querying branches by their property or combination of multiple properties. This examples shows you how to create such query and how to process query results.",
                            "link":"../../html/general/BranchByQuery.html"
                        }
                        /*
                        ,
                        {
                            "id":"branch-crud",
                            "title":"Query Operations",
                            "link":"../../html/general/BranchCrud.html"
                        }
                        */
                    ]
                },
                {
                    "title": "Node",
                    "examples": [
                        {
                            "id":"node-crud",
                            "title":"Node Operations",
                            "description":"A node is a branch scope object that holds the data that you want to store in Gitana CloudCMS. Each node contains a JSON document for properties and can have one or multiple attachments for binary data. In this fortune cookie example, we will first retrieve the node from master branch of the \"Fortune Cookie\" repository which contains list of candidate messages and a background image. The candidate messages will then be used to render a fortune cookie node with a random message and a few random luck numbers. Once the node is created, you can click on update button to update the node with new message and numbers or delete button to delete the node.",
                            "link":"../../html/general/NodeCrud.html"
                        },
                        {
                            "id":"person-node",
                            "title":"Person Node",
                            "description":"A person node is a special node that is mapped to a user. A user can have multiple person node. But for each branch, a user has one and only one person node. Just like any other node, a person node can have any properties stored in its JSON document or have one or multiple attachments. This example shows you how to find the person node for a given user and how to retrieve properties of the person node.",
                            "link":"../../html/general/PersonNode.html"
                        },
                        {
                            "id":"node-attachments",
                            "title":"Node Attachments",
                            "description":"A node can have one or multiple attachments. This example shows you how to get list of attachments of the given node and how to get attachment properties such as file name, mime type, file size and download link.",
                            "link":"../../html/general/NodeAttachments.html"
                        },
                        {
                            "id":"folder-node",
                            "title":"Folder Node",
                            "description": "Unlike traditional content repositories, Gitana CloudCMS support graph-based repository and doesn't require a tree-like hierarchy. However for the convenience of content navigation and organization, Gitana CloudCMS supports folder, a container-type node which can be associated with other nodes using parent/child association. With the support for folder nodes, we can easily navigate the repository though the hierarchy. This example shows you how to locate the root node and navigate to its descendants.",
                            "link":"../../html/general/FolderNode.html"
                        },
                        {
                            "id":"node-audit-records",
                            "title":"Node Audit Records",
                            "description":"Gitana cloudCMS keeps auditing records for all nodes. This examples shows you how to retrieve those records and render a nice data table using jQuery Datatable plugin.",
                            "link":"../../html/general/NodeAuditRecords.html"
                        },
                        {
                            "id":"node-audit-records-2",
                            "title":"Node Audit Records with Pagination and Sorting",
                            "description":"For list retrieval, Gitana CloudCMS supports pagination and sorting. This example shows how to use pagination support and sorting support with jQuery Datatable plugin to generate a paged and sortable list for auditing records.",
                            "link":"../../html/general/NodeAuditRecords2.html"
                        }
                    ]
                },
                {
                    "title": "Association",
                    "examples": [
                        {
                            "id":"association-crud",
                            "title":"Association Operations",
                            "description":"Within Gitana CloundCMS, nodes can be connected with each other through associations. We can create as many associations as we want between two nodes. Each association involves a source node and a target node. Association can have its own properties since association is node as well. There are two basic types of associations, directed and undirected.<br/> For this example, we use a list of creature nodes to model a food web. Only one association type, eats, is needed to describe the food chain relation among those creatures. The \"eats\" association can be either directed or undirected. Once you pick a creature from the list, the example will show list of creatures that it eats as well as list of creatures that eats it.",
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
                            "description":"Gitana CloudCMS supports full-text search. Once nodes are created or updated, their data will be indexed and available to search. The examples shows you how to search by keyword and process returned results.",
                            "link":"../../html/general/SearchFullText.html"
                        },
                        {
                            "id":"search-spatial",
                            "title":"Traversal Search",
                            "description":"Instead of searching among all nodes of a given branch, traversal search allows us to pick a source node and only search nodes that are n-step away from the node. For example, if node A is associated with node B, node A is 1-step away from node B. If node C is association with node B but not node A. Node A is 2-step away from Node C.",
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
                            "description":"Gitana CloudCMS supports <a href='http://www.mongodb.org/display/DOCS/Advanced+Queries'>MongoDB-style query language</a> for advance queries. This example provides list of sample queries that query the creature nodes. Click on any sample query and you will see the query expression and query results.",
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
                            "description":"Gitana CloudCMS lets you traverse from a given node within the node graph through a traversal expression which contains association type, association direction or depth. Click on any sample traverse and you will see the traverse expression and traverse results.",
                            "link":"../../html/general/TraverseExamples.html"
                        }
                    ]
                }
            ]
        },
        {
            "title":"Gitana + jQuery Template",
            "examples" : [
                {
                    "title": "Content Display",
                    "examples": [
                        {
                            "id":"promotion-display-single",
                            "title":"Single Promotion Item",
                            "description":"In this example, we will retrieve properties and attachments of a single product promotion node based on its QName and then use <a href='../../templates/LatestPromotion.html' target='_single_item'>a jQuery template</a> to render the data.",
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
                            "description":"In this example, we will query the master branch of \"The Office\" repository to get a list of product nodes that comes with front page product tag. We will then use <a href='../../templates/FrontPageProducts.html' target='_front_doors'>a jQuery template</a> to render the list of front page products.",
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
                            "description":"In this example, we will retrieve a single product node and all nodes that it has been directly connected with through \"isRelatedTo\" type of association. We will then use <a href='../../templates/ProductDetails.html' target='_single_item'>a jQuery template</a> to render the product node and <a href='../../templates/RelatedProducts.html' target='_single_item'>another jQuery template</a> to render the related products.",
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
                            "description":"This example shows you how to run a keyword based search of query the master branch of \"The Office\" repository and then use <a href='../../templates/SearchResults.html' target='_single_item'>a jQuery template</a> to display search results.",
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
                            "description":"In this example, we will start with retrieving a user's basic information and his person node in the master branch of \"The Office\" repository. We will then query the repository to find all other personal nodes that have been associated with this user.",
                            "link":"../../html/templating/UserDetails.html"
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
                            "description":"This example shows you how to use Alpaca Form to provide in-context editing for a single product promotion node. Once you click Edit button, a full editing form will let us change the properties of the promotion product.",
                            "link":"../../html/alpaca/PromotionInContextEditingFullForm.html"
                        },
                        {
                            "id":"promotion-incontext-editing-simple",
                            "title":"Promotion with Simple Form",
                            "description":"This example users same product promotion node but with a simplified form which shows less number of fields. Once you click Edit button, a simplified editing form will let us change part of properties of the promotion product.",
                            "link":"../../html/alpaca/PromotionInContextEditingSimpleForm.html"
                        }
                    ]
                },
                {
                    "title": "Advanced Content Modeling",
                    "examples": [
                        {
                            "id":"user-reviews",
                            "title":"Promotion with User Reviews",
                            "description":"This example shows you how to build an interactive application that allows consumers to review the product, rate the product, vote on other people's reviews etc. The list of reviews will also be paged and sorted by timestamp.",
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
                            "link":"../../html/socialgraph/SocialGraph.html"
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
        var sectionTitle = items.title;
        var bar = $('<ul>' + sectionTitle + '</span></ul>');
        $.each(items.examples, function(i, item) {
            var itemBar = $('<li></li>');
            if (item.examples) {
                _renderSideBar(itemBar, item);
            } else {
                var listItem = $('<span><span class="ui-icon ui-icon-document" style="float:left"></span><a href="' + item.link + '">' + item.title + '</a></span>');
                itemBar.append(listItem);
                if (item.id == currentExampleId) {
                    itemBar.addClass('ui-state-highlight');
                    $('title').html('Gitana SDK - ' + item.title);
                    $('.gitana-example-case').prepend('<h2>'+item.title+'</h2>'+'<h4>'+item.description+'</h4>');
                    $('.gitana-example-header').html('<h2><a href="../../index.html">SDK</a><span> > </span><span> '+sectionTitle+' </span></h2>');
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
    }

    $.fn.stars = function() {
        return $(this).each(function() {
            var n = $(this).html();
            if (!isNaN(parseFloat(n)) && isFinite(n)) {
                $(this).html($('<span />').width(Math.max(0, (Math.min(5, parseFloat($(this).html())))) * 16));
            }
        });
    }
});

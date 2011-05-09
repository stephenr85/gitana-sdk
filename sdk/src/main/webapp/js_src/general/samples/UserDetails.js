(function($) {
    $(document).ready(function() {
        var gitanaConnector = window.gitanaConnector;
        var templateId = "../../templates/SocialGraphUserDetails";
        var el = $('#social-details');
        var userId = 'jhalpert_theoffice';

        var getUserDetails = function () {
            var data = {};
            gitanaConnector.gitanaDriver.users().read(userId, function(user) {
                data.avatar = '/proxy/security/users/' + userId + '/attachment/avatar?ticket=' + gitanaConnector.ticket;
                data.name = user.firstName + ' ' + user.lastName;
                data.email = user.email;
                var branch = gitanaConnector.branch;
                branch.nodes().readPerson(userId, function(personNode) {
                    var personNodeId = personNode._doc;
                    data.currentPosition = personNode.currentPosition;
                    data.gender = personNode.gender;
                    data.biography = personNode.biography;
                    personNode.traverse({
                        "associations": {
                            "theoffice:isManager": "BOTH"
                        },
                        "depth": 1
                    }, function(response) {
                        var nodes = response.nodes;
                        var associations = response.associations;
                        var supervisors = [];
                        var subordinates = [];
                        for (var key in response.associations) {
                            var type = response.associations[key]["_type"];
                            var direction = response.associations[key]["direction"];
                            var sourceId = response.associations[key]["source"];
                            var targetId = response.associations[key]["target"];
                            var targetNode = nodes[response.associations[key]["target"]];
                            var sourceNode = nodes[response.associations[key]["source"]];
                            if (type == 'theoffice:isManager') {
                                if (personNodeId == sourceId) {
                                    subordinates.push({
                                        "userId": targetNode["userId"]
                                    });
                                }
                                if (personNodeId == targetId) {
                                    supervisors.push({
                                        "userId": sourceNode["userId"]
                                    });
                                }
                            }
                        }
                        data.supervisors = supervisors;
                        data.subordinates = subordinates;
                        personNode.traverse({
                            "associations": {
                                "theoffice:hasRelation": "BOTH"
                            },
                            "depth": 1
                        }, function(response) {
                            var nodes = response.nodes;
                            var associations = response.associations;
                            var relationships = []
                            for (var key in response.associations) {
                                var type = response.associations[key]["_type"];
                                var direction = response.associations[key]["direction"];
                                var sourceId = response.associations[key]["source"];
                                var targetId = response.associations[key]["target"];
                                var targetNode = nodes[response.associations[key]["target"]];
                                var sourceNode = nodes[response.associations[key]["source"]];

                                var relationship = {};
                                if (personNodeId == sourceId) {
                                    relationship.userId = targetNode["userId"];
                                }
                                if (personNodeId == targetId) {
                                    relationship.userId = sourceNode["userId"];
                                }
                                relationship.type = response.associations[key].details.type;
                                relationships.push(relationship);

                            }
                            data.relationships = relationships;

                            new Gitana.jQueryTemplateEngine('UserDetails').render(el, templateId, {
                                "data": data
                            }, function() {
                                $('.supervisor', el).each(function(index) {
                                    var userId = $(this).attr('id');
                                    var _this = this;
                                    gitanaConnector.gitanaDriver.users().read(userId, function(user) {
                                        $(_this).html(user.firstName + ' ' + user.lastName);
                                    });

                                });
                                $('.subordinate', el).each(function(index) {
                                    var userId = $(this).attr('id');
                                    var _this = this;
                                    gitanaConnector.gitanaDriver.users().read(userId, function(user) {
                                        $(_this).html(user.firstName + ' ' + user.lastName);
                                    });

                                });
                                $('.relationship', el).each(function(index) {
                                    var userId = $(this).attr('id');
                                    var _this = this;
                                    gitanaConnector.gitanaDriver.users().read(userId, function(user) {
                                        $(_this).html(user.firstName + ' ' + user.lastName + ' ' + $(_this).html());
                                    });
                                });
                            });
                        });
                    });
                });
            });
        };


        gitanaConnector.connect(getUserDetails, function(error) {
            gitanaConnector.connectorErrorCallback(error, function() {
                getUserDetails();
            });
        });
    });
})(jQuery);
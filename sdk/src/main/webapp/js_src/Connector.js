(function(window) {
    var Gitana = window.Gitana;

    Gitana.Connector = Gitana.SDK.extend(
    /** @lends Gitana.Connector.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.SDK
         *
         * @class Connector that access a remote Gitana repository though Gitana JavaScript
         * driver APIs.
         * @param {String} id Connector ID.
         * @param {Object} configs Connector Configurations.
         */
        constructor: function(id, configs) {

            this.base();

            this.id = id;
            this.configs = configs;
            this.isRetry = false;
            this.connectorErrorCallback = function (loadError, onSuccess, onError) {
                var successCallback = function () {
                    if (onSuccess && _this.isFunction(onSuccess)) {
                        onSuccess();
                    }
                };
                var errorCallback = function (error) {
                    if (onError && _this.isFunction(onError)) {
                        onError(error);
                    }
                };
                // Handle ticket expiration.
                if (loadError.status && loadError.status == 403) {
                    if (!_this.isRetry) {
                        _this.isRetry = true;
                        // Re-run the call
                        _this.gitanaDriver.security().authenticate(_this.userName, _this.password, function(success) {
                            // store the ticket
                            _this.ticket = success.ticket;
                            _this.isRetry = false;
                            successCallback();
                        }, function(error) {
                            _this.isRetry = false;
                            errorCallback(error);
                        });
                    } else {
                        var delayedCall = function () {
                            successCallback();
                        }
                        //Wait till we get a new ticket
                        setTimeout(delayedCall, 1000);
                    }
                } else {
                    // Other errors
                    errorCallback(loadError);
                }
            };
        },

        /**
         * Makes initial connections to Gitana repository.
         *
         * @param {Function} onSuccess onSuccess callback.
         * @param {Function} onError onError callback.
         */
        connect: function (onSuccess, onError) {
            var _this = this;
            this.userName = this.configs.userName;
            this.password = this.configs.password;

            if (this.isEmpty(this.repositoryId)) {
                this.repositoryId = this.configs.repositoryId;
            }
            if (this.isEmpty(this.branchId)) {
                this.branchId = this.configs.branchId ? this.configs.branchId : "master";
            }
            if (this.isEmpty(this.gitanaDriver)) {
                this.gitanaDriver = new Gitana.Driver();
            }

            var successCallback = function () {
                if (onSuccess && _this.isFunction(onSuccess)) {
                    onSuccess();
                }
            };

            var errorCallback = function (error) {
                if (onError && _this.isFunction(onError)) {
                    onError(error);
                }
            };

            if (this.isEmpty(this.ticket) || this.isRetry) {
                this.gitanaDriver.security().authenticate(this.userName, this.password, function(success) {
                    // store the ticket
                    _this.ticket = success.ticket;
                    _this.isRetry = false;

                    if (_this.isEmpty(_this.repository) || _this.isEmpty(this.branch)) {
                        if (_this.isValidGitanaId(_this.repositoryId)) {
                            _this.gitanaDriver.repositories().read(_this.repositoryId, function(repository) {
                                _this.repository = repository;
                                repository.branches().read(_this.branchId, function(branch) {
                                    _this.branch = branch;
                                    _this.branchId = branch.getId();
                                    successCallback();
                                }, function(error) {
                                    _this.connectorErrorCallback(error, onSuccess, onError);
                                })
                            }, function(error) {
                                _this.connectorErrorCallback(error, onSuccess, onError);
                            });
                        } else if (_this.isObject(_this.repositoryId)) {
                            _this.gitanaDriver.repositories().query(_this.repositoryId, function(repositoryList) {
                                if (repositoryList.rows.length > 0) {
                                    _this.gitanaDriver.repositories().read(repositoryList.rows[0].repository, function(repository) {
                                        _this.repository = repository;
                                        _this.repositoryId = repository.getId();
                                        repository.branches().read(_this.branchId, function(branch) {
                                            _this.branch = branch;
                                            successCallback();
                                        }, function(error) {
                                            _this.connectorErrorCallback(error, onSuccess, onError);
                                        })
                                    }, function(error) {
                                        _this.connectorErrorCallback(error, onSuccess, onError);
                                    });
                                }
                            }, function(error) {
                                _this.connectorErrorCallback(error, onSuccess, onError);
                            });
                        } else {
                            errorCallback("Invalid Repository ID or Query");
                        }
                    } else {
                        successCallback();
                    }
                }, function(error) {
                    _this.isRetry = false;
                    errorCallback(error);
                });
            } else {
                successCallback();
            }
        }
        ,

        readNode : function (nodeId, onSuccess, onError) {
            var _this = this;
            this.connect(function() {
                _this.branch.nodes().read(nodeId, function(node) {
                    if (onSuccess && _this.isFunction(onSuccess)) {
                        node._ticket = _this.ticket;
                        node._url = "/repositories/" + node.getRepositoryId() + "/branches/" + node.getBranchId() + "/nodes/" + node.getId();
                        onSuccess(node);
                    }
                }, function(error) {
                    _this.connectorErrorCallback(error, function() {
                        _this.readNode(nodeId, onSuccess, onError);
                    }, onError);
                });
            });
        }
        ,

        search : function (search, onSuccess, onError) {
            var _this = this;
            this.connect(function() {
                _this.branch.nodes().search(search, function(result) {
                    if (onSuccess && _this.isFunction(onSuccess)) {
                        result._ticket = _this.ticket;
                        //inject ticket
                        result.repositoryId = _this.repositoryId;
                        result.branchId = _this.branchId;
                        onSuccess(result);
                    }
                }, function(error) {
                    _this.connectorErrorCallback(error, function() {
                        _this.search(search, onSuccess, onError);
                    }, onError);
                });
            });
        }
        ,

        query : function (query, onSuccess, onError) {
            var _this = this;
            this.connect(function() {
                _this.branch.nodes().query(query, function(result) {
                    if (onSuccess && _this.isFunction(onSuccess)) {
                        result._ticket = _this.ticket;
                        //inject ticket
                        result.repositoryId = _this.repositoryId;
                        result.branchId = _this.branchId;
                        onSuccess(result);
                    }
                }, function(error) {
                    _this.connectorErrorCallback(error, function() {
                        _this.query(query, onSuccess, onError);
                    }, onError);
                });
            });
        }
        ,

        traverse : function (traverse, onSuccess, onError) {
            var _this = this;
            this.connect(function() {
                _this.branch.nodes().read(traverse.sourceId, function(loadedNode) {
                    loadedNode.traverse(traverse, function(result) {
                        if (onSuccess && _this.isFunction(onSuccess)) {
                            result._ticket = _this.ticket;
                            //inject ticket
                            result.repositoryId = loadedNode.getRepositoryId();
                            result.branchId = loadedNode.getBranchId();
                            result.sourceNode = loadedNode;
                            result.sourceNode._ticket = _this.ticket;
                            result.sourceNode._url = "/repositories/" + loadedNode.getRepositoryId() + "/branches/" + loadedNode.getBranchId() + "/nodes/" + loadedNode.getId();
                            onSuccess(result);
                        }
                    }, function(error) {
                        _this.connectorErrorCallback(error, function() {
                            _this.traverse(traverse, onSuccess, onError);
                        }, onError);
                    });
                }, function(error) {
                    _this.connectorErrorCallback(error, function() {
                        _this.traverse(traverse, onSuccess, onError);
                    }, onError);
                });
            });
        }
    });

})(window);
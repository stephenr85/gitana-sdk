(function($) {
    SearchResults = Ratchet.Gadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.post("/search", this.index);

            // subscribe to observable
            this.subscribe("key", function() {
                this.run("POST", "/search");
            });
        },

        index: function(el) {
            var _this = this;
            var key = this.observable("key").get();

            var result = {
                "count":0,
                "list":[]
            };
            connector.connect(function() {
                //TODO: filter doesn't seem to work.
                connector.branch.searchNodes(key).filter(function(){
                    return (this.get('_type') == 'theoffice:product' || this.get('_type') == 'theoffice:promotion');
                }).count(function(count) {
                    result.count = count;
                }).each(function() {
                    //if (this.get('_type') == 'theoffice:product' || this.get('_type') == 'theoffice:promotion') {
                        var searchResult = this.object;
                        this.listAttachments().then(function() {
                            searchResult.attachments = {};
                            this.each(function() {
                                searchResult.attachments[this.getId()] = this.getDownloadUri();
                            }).then(function() {
                                result.list.push(searchResult);
                            });
                        });
                    //}
                }).then(function() {
                    el.transform({
                        "view" : {
                            "globalTemplate": '../../templates/SearchResults.html'
                        }
                    }, {
                        "data": result
                    }, function() {
                        el.swap();
                    });
                });
            });
        }
    });

    Ratchet.GadgetRegistry.register("main_content_gadget", SearchResults);

})(jQuery);
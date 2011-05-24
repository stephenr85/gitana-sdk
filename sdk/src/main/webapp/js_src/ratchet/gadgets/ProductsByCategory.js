(function($) {
    ProductsByCategory = Ratchet.Gadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get('/category/{id}', this.index);
        },

        index: function(el) {
            var id = el.tokens["id"];
            connector.connect(function() {
                connector.branch.queryNodes({
                    "_type" : "theoffice:product",
                    "categories" : id
                }).then(function() {
                    var data = {
                        "category" : id,
                        "list" : []
                    };
                    this.each(
                            function() {
                                var node = this.object;
                                this.listAttachments().then(function() {
                                    node.attachments = {};
                                    this.each(
                                            function() {
                                                node.attachments[this.getId()] = this.getDownloadUri();
                                            }).then(function() {
                                        data.list.push(node);
                                    });
                                });
                            }).then(function() {
                        el.transform({
                            "view" : {
                                "globalTemplate": '../../templates/ProductsByCategory.html'
                            }
                        }, {
                            "data": data
                        }, function() {
                            el.swap();
                        });
                    });
                });
            });
        }
    });

    Ratchet.GadgetRegistry.register("main_content_gadget", ProductsByCategory);

})(jQuery);
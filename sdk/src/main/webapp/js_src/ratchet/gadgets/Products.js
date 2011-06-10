(function($) {
    Products = Ratchet.Gadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get('/products', this.index);
        },

        index: function(el) {
            var gitanaContext = Ratchet.renditionEngine.connector.gitanaContext;
            gitanaContext.getBranch().queryNodes({
                "_type" : "theoffice:product"
            }).then(function() {
                var data = {
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
                            "globalTemplate": '../../templates/Products.html'
                        }
                    }, {
                        "data": data
                    }, function() {
                        el.swap();
                    });
                });
            });
        }
    });

    Ratchet.GadgetRegistry.register("main_content_gadget", Products);

})(jQuery);
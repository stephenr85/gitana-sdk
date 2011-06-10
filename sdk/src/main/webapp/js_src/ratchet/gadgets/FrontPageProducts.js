(function($) {
    FrontPageProducts = Ratchet.Gadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get(this.index);
        },

        index: function(el) {
            var gitanaContext = Ratchet.renditionEngine.connector.gitanaContext;
            gitanaContext.getBranch().queryNodes({
                "_type" : "theoffice:product",
                "tags" : "Front Page"
            }).then(function() {
                var data = {
                    "list" : []
                };
                this.each( function() {
                    var node = this.object;
                    node.attachments = {};
                    this.listAttachments().each(function() {
                        node.attachments[this.getId()] = this.getDownloadUri();
                    }).then(function() {
                        data.list.push(node);
                    });
                }).then(function() {
                    el.transform({
                        "view" : {
                            "globalTemplate": '../../templates/FrontPageProducts.html'
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

    Ratchet.GadgetRegistry.register("front_page_products_gadget", FrontPageProducts);

})(jQuery);
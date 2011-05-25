(function($) {
    RelatedProducts = Ratchet.Gadget.extend(
    {
        constructor: function(ratchet, container) {
            this.base(ratchet, container);
        },

        setup: function() {
            this.get('/product/{id}', this.index);
        },

        index: function(el) {
            var id = el.tokens["id"];

            connector.connect(function() {
                var relatedProducts = [];
                connector.branch.readNode(id).traverse({
                    "associations": {
                        "theoffice:isRelatedTo": "ANY"
                    },
                    "depth": 1
                }).nodes().each(function() {
                    var relatedProduct = this.object;
                    this.listAttachments().then(function() {
                        relatedProduct.attachments = {};
                        this.each(function() {
                            relatedProduct.attachments[this.getId()] = this.getDownloadUri();
                        });
                    }).then(function() {
                        relatedProducts.push(relatedProduct);
                    });
                }).then(function() {
                    el.transform({
                        "view" : {
                            "globalTemplate": '../../templates/RelatedProducts.html'
                        }
                    }, {
                        "data": relatedProducts
                    }, function() {
                        el.swap();
                    });
                });
            });
        }
    });

    Ratchet.GadgetRegistry.register("related_products_gadget", RelatedProducts);

})(jQuery);
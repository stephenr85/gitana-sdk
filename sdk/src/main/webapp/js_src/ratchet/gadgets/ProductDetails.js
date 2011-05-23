(function($) {
    ProductDetails = Ratchet.Gadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get('/product/{id}',this.index);
        },

        index: function(el) {
            var id = el.tokens["id"];
            el.transform({
                "view" : {
                    "globalTemplate": '../../templates/ProductDetails.html'
                }
            }, {
                "data": id
            }, function() {
                el.swap();
            });

        }
    });

    Ratchet.GadgetRegistry.register("main_content_gadget", ProductDetails);

})(jQuery);
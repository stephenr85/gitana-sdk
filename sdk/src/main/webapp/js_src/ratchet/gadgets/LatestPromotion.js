(function($) {
    LatestPromotion = Ratchet.Gadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/",this.index);
        },

        index: function(el) {
            el.transform({
                "view" : {
                    "globalTemplate": '../../templates/LatestPromotion.html'
                }
            }, {
                "data":"theoffice:binderpromotion"
            }, function() {
                el.swap();
            });

        }
    });

    Ratchet.GadgetRegistry.register("main_content_gadget", LatestPromotion);

})(jQuery);
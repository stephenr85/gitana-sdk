(function($) {
    SearchForm = Ratchet.Gadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/",this.index);

            this.post("/search",this.submit);

            // declare observables
            this.observable("key");
        },

        index: function(el)
        {
            var _this = this;

            el.model["key"] = this.observable("key").get();

            // transform
            el.transform({
                "view" : {
                    "globalTemplate": '../../templates/SearchForm.html'
                }
            }, function(el) {

                // override the submit handlers
                var form = el.find("form");
                $(form).find("input[type='image']").click(function(event)
                {
                    event.preventDefault();

                    // convert form to json
                    _this.run("POST", "/search", form.serializeObject());
                });

                el.swap();
            });
        },

        submit: function(el, data)
        {
            this.observable("key").set(data.key);
        }
    });

    Ratchet.GadgetRegistry.register("search_form_gadget", SearchForm);

})(jQuery);
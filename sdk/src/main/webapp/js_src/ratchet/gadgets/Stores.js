(function($) {
    Stores = Ratchet.Gadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get('/stores', this.index);
        },

        index: function(el) {
            connector.connect(function() {
                connector.branch.chain().queryNodes({
                    "_type" : "theoffice:store"
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
                                "globalTemplate": '../../templates/Stores.html'
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

    Ratchet.GadgetRegistry.register("main_content_gadget", Stores);

})(jQuery);
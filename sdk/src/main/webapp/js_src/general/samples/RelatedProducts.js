(function($) {
    $(document).ready(function() {
        var gitanaConnector = window.gitanaConnector;
        gitanaConnector.traverse({
            "sourceId":"theoffice:papermateballpointstickpens",
            "associations": {
                "theoffice:isRelatedTo": "BOTH"
            },
            "depth": 1
        }, function(result) {
            new Gitana.jQueryTemplateEngine('LatestPromotion').render($('#latest_promotion'), "../../templates/ProductDetails", {
                "data": result.sourceNode
            }, function() {
                new Gitana.jQueryTemplateEngine('RelatedProducts').render($('#front_page_products'), "../../templates/RelatedProducts", {
                    "data": result
                });
            }, function(loadedError) {
            });
        });
    }, function(loadedError) {
    });
})(jQuery);
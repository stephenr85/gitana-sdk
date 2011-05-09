(function($) {
    $(document).ready(function() {
        var gitanaConnector = window.gitanaConnector;
        var templateId = "../../templates/FrontPageProducts";
        var el = $('#front_page_products');
        gitanaConnector.query({
            "query" : {
                "_type" : "theoffice:product",
                "tags" : "Front Page"
            }
        }, function(result) {
            new Gitana.jQueryTemplateEngine('LatestPromotion').render(el, templateId, {
                "data": result
            });
        }, function(loadedError) {
        });
    });
})(jQuery);
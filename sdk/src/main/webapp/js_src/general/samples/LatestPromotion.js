(function($) {
    $(document).ready(function() {
        var gitanaConnector = window.gitanaConnector;
        var templateId = "../../templates/LatestPromotion";
        var el = $('#latest_promotion');
        gitanaConnector.readNode("theoffice:binderpromotion", function(node) {
            new Gitana.jQueryTemplateEngine('LatestPromotion').render(el, templateId, {
                "data": node
            });
        }, function(loadedError) {
        });
    });
})(jQuery);
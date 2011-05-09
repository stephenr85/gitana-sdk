(function($) {
    $(document).ready(function() {
        var gitanaConnector = window.gitanaConnector;
        var templateId = "../../templates/SocialGraphUserDetails";
        var el = $('#main_content');

        gitanaConnector.search(key, function(result) {
            new Gitana.jQueryTemplateEngine('SearchResults').render(el, templateId, {
                "data": result
            });
        }, function(loadedError) {
        });
    });
})(jQuery);
(function($) {
    var connector = new Alpaca.Connectors.GitanaConnector('gitana', {
        "userName": "admin",
        "password": "admin",
        "repositoryId" : Gitana.SDK.defaults.theOfficeRepositoryQuery
    });

    $.connector = window.connector = connector;

    Ratchet.renditionEngine = new Ratchet.AlpacaEngine('Alpaca', connector);
})(jQuery);
(function($) {
    var connector = new Alpaca.Connectors.GitanaConnector('gitana', {
        "userName": "admin",
        "password": "admin",
        "repositoryId" : {
            "title" : "Dunder Mifflin sample repository",
            "tags":["Demo","The office"]
        }
    });

    $.connector = window.connector = connector;

    Ratchet.renditionEngine = new Ratchet.AlpacaEngine('Alpaca', connector);
})(jQuery);
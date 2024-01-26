(function(global) {
    var window_gtag = global.gtag;

    var LIMIT_LENGTH_PARAM_VALUE = 100;
    var createTextWithinLimit = function(text, limitLength) {
        if (text.length <= limitLength) {
            return text;
        } else {
            return text.substring(0, limitLength);
        }
    };
    var sendGaEvent = function(type, content) {
        var trimmedContent = createTextWithinLimit(content, LIMIT_LENGTH_PARAM_VALUE);
        var eventName = 'error_occurred';
        var eventParameters = {'element_type': 'global', 'element_name': type, 'event_content': trimmedContent};
        window_gtag('event', eventName, eventParameters);
    };

    var standardType = 'error';
    global.addEventListener(standardType, function(event) {
        var text = `${event.error.message}[${event.filename}[${event.lineno}]]`;
        console.error(`Error occurred: type[${standardType}] [${text}]`);
        sendGaEvent(standardType, text);
    });

    var promiseType = 'unhandledrejection';
    global.addEventListener(promiseType, function(event) {
        var text = `${event.reason.stack}`;
        console.error(`Error occurred: type[${promiseType}] [${text}]`);
        sendGaEvent(promiseType, text);
    });
    
}(this));

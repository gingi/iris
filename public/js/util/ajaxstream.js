define(function () {
    function AJAXStream(options) {
        if (!options.url) {
            throw new Error("URL is required");
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", options.url, true);
        var offset = 0;
        var DELIM = "\r\n\r\n";
        xhr.onreadystatechange = function (e) {
            if (this.readyState == 3 && this.status == 200) {
                var chunk = this.responseText.substring(offset);
                offset = this.responseText.length;
                
                var payloads = chunk.split(DELIM); payloads.pop();
                payloads.forEach(function (payload) {
                    var json;
                    try {
                        json = JSON.parse(payload)
                    } catch (err) {
                        throw new Error("Can't parse chunk [" + payload + "]");
                    }
                    options.chunk(json);
                })
            } else if (this.readyState == 4) {
            }
        };
        xhr.send();
        return this;
    }
    return AJAXStream;
});
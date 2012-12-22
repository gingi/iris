define(function () {
    function AJAXStream(options) {
        if (!options.url) {
            throw new Error("URL is required");
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", options.url, true);
        var offset = 0;
        xhr.onreadystatechange = function (e) {
            if (this.readyState == 3 && this.status == 200) {
                var chunk = this.responseText.substring(offset);
                offset = this.responseText.length;
                var json;
                try {
                    json = JSON.parse(chunk)
                } catch (err) {
                    throw new Error("Can't parse chunk [" + chunk + "]");
                }
                
                options.chunk(JSON.parse(chunk));
            } else if (this.readyState == 4) {
                console.log("Length of response %d", this.responseText.length);
            }
        };
        xhr.send();
        return this;
    }
    return AJAXStream;
});
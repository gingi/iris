
$(document).ready(function(){


    $('#gwasquery_button').click(function(){
        var study = $("input#study").val();
        var chr = $("input#chr").val();
        var bin1 = $("input#xbin").val();
        var bin2 = $("input#ybin").val();
        var fastbitGet = '/scatter/GWAS/' + study + "/" + chr + "/" + bin1 + "/" + bin2;
        writejson(fastbitGet);
    });
    function writejson (fastbitGet){
        $.getJSON( fastbitGet, {},
            function(json) {
                var pre = document.createElement('pre');
                pre.innerHTML = JSON.stringify(json, null, '\t');
                $('#bottomwidget').append('<h1>' + fastbitGet + '</h1>');
                $('#bottomwidget').append(pre);
            }
        );
    }
    
});
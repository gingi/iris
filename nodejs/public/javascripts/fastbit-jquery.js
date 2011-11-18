//$(function() {
$(document).ready(function(){

    // Grab the data

    var fastbitGet = '/scatter/GWAS/3396/1/10/15';


    $('#fetch_json').click(function(){
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
    
    // $('#topwidget input[value=Fetch]').toggle(function(){
    //     alert("Registring click");
    //     alert("As you can see, the link no longer took you to jquery.com");
    //     event.preventDefault();
    // );

   
});
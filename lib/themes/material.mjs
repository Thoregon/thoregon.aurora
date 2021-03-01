function modifyText() {

}

function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}
// use like
r(function(){
    var el = document.getElementsByClassName("aurora-text-field-container");

    //el[0].addEventListener("click", modifyText, false);

});

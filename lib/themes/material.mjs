function modifyText() {
alert("you clicked");
}

function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}
// use like
r(function(){
    var el = document.getElementsByClassName("inline-text-field-container");

    //el[0].addEventListener("click", modifyText, false);

});

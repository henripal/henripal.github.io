// #################
// # RELOAD BUTTON #
// #################

$(function() {
    $("#reload")
        .button()
        .click(function (){
            location.reload();
        });
});

// #####################
// # PARAMETER SLIDERS #
// #####################

// Lennard Jones Potential 1
$("#LJAslider").slider({
    value:normF[0], min: 0, max: 10, step: 0.5,
    slide: function( event, ui) {
        $( "#LJAslider-val" ).html(ui.value);
        updateParams();
    }
});
$( "#LJAslider-val" ).html(  $('#LJAslider').slider('value') );

// Lennard Jones Potential 2
$("#LJBslider").slider({
    value:normF[1], min: 0, max: 100, step: 1,
    slide: function( event, ui) {
        $( "#LJBslider-val" ).html(ui.value);
        updateParams();
    }
});
$( "#LJBslider-val" ).html(  $('#LJBslider').slider('value') );


// Diffusion Coefficient
$("#Dslider").slider({
            value:D, min: 0, max: 100000,
            slide: function( event, ui) {
                $( "#Dslider-val" ).html(ui.value);
                updateParams();
            }
});
$( "#Dslider-val" ).html(  $('#Dslider').slider('value') );


// damping coefficient
$("#Gslider").slider({
            value: gamma, min: 0, max: 50,
            slide: function( event, ui) {
                $( "#Gslider-val" ).html(ui.value);
                updateParams();
            }
});
$( "#Gslider-val" ).html(  $('#Gslider').slider('value') );

// gravity
$("#Gravslider").slider({
            value: gravity, min: 0, max: 100,
            slide: function( event, ui) {
                $( "#Gravslider-val" ).html(ui.value);
                updateParams();
            }
});
$( "#Gravslider-val" ).html(  $('#Gravslider').slider('value') );

//buttonset
$(function() {
  $( "#radio" ).buttonset();
});

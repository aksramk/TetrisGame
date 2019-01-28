/* eslint-disable space-before-function-paren */
/* eslint-disable space-before-blocks */
/* eslint-disable eol-last */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */

var canvas = document.getElementById("myCanvas");
var canvas2d = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function init(){
    canvas2d.fillStyle = '#000000';
    for(i=0;i<20;i++){
        canvas2d.fillRect(0, 0, 10, 10);
    }
}

function main(){
    init();
}
document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded(){
    main();
}
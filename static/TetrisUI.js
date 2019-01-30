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
var backgroundColor = '#213a3d';
var tetrisPixelSize = height/20;
var tetrisWell = []
var dropFinished = false;
var dropBlock = [];
for(i=0;i<10;i++){
    tetrisWell.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
}
var tempTetrisWell = tetrisWell;
var tempDropBlock = dropBlock;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function listsEqual(l1,l2){
    var ifEqual=true;
    for(i=0;i<l1.length;i++){
        if(l1[i]!==l2[i]){
            ifEqual=false;
        }
    }
    return ifEqual
}

function includesList(bigList, subList){
    for(j=0; j<bigList.length; j++){
        if(listsEqual(bigList[j],subList)){
            return true
        }

    }
    return false
}

function tetronimoIGradient(x, y){
    var tetronimoIColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoIColor.addColorStop(0, "#b5f3ff");
    tetronimoIColor.addColorStop(1, "#00d4ff");
    return tetronimoIColor;
}

function tetronimoJGradient(x, y){
    var tetronimoJColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoJColor.addColorStop(0, "#4a52f7");
    tetronimoJColor.addColorStop(1, "#252ff9");
    return tetronimoJColor;

}

function tetronimoLGradient(x, y){
    var tetronimoLColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoLColor.addColorStop(0, "#ffca68");
    tetronimoLColor.addColorStop(1, "#ffb121");
    return tetronimoLColor;

}

function tetronimoOGradient(x, y){
    var tetronimoOColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoOColor.addColorStop(0, "#c4c45e");
    tetronimoOColor.addColorStop(1, "#cece00");
    return tetronimoOColor;

}

function tetronimoSGradient(x, y){
    var tetronimoSColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoSColor.addColorStop(0, "#80fc93");
    tetronimoSColor.addColorStop(1, "#31f950");
    return tetronimoSColor;

}

function tetronimoTGradient(x, y){
    var tetronimoTColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoTColor.addColorStop(0, "#ff7ced");
    tetronimoTColor.addColorStop(1, "#f731dc");
    return tetronimoTColor;

}

function tetronimoZGradient(x, y){
    var tetronimoZColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoZColor.addColorStop(0, "#ff7c84");
    tetronimoZColor.addColorStop(1, "#ff1625"); 
    return tetronimoZColor;

}

function coordinateToLocation(coordinateX,coordinateY){
    var startingX = Math.round(width/4) + Math.round(width/20) * coordinateX;
    var startingY =Math.round(height/20) * coordinateY;
    return [startingX, startingY];
    
}

function fillCoordinate(x,y,func){
    var h = coordinateToLocation(x,y);
    var x = h[0];
    var y = h[1];
    canvas2d.fillStyle = func(x, y);
    canvas2d.lineWidth = width/800;
    roundRect(canvas2d, x, y, tetrisPixelSize, tetrisPixelSize, Math.round(tetrisPixelSize/30), true);
    return x,y;
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
  ctx.closePath();

}

function drawTetronimoO(startX = 4, startY=0){
    tetrisWell[startX][startY] = 4;
    tetrisWell[startX+1][startY] = 4;
    tetrisWell[startX][startY+1] = 4;
    tetrisWell[startX+1][startY+1] = 4;
    dropFinished=false;
    dropBlock = [[startX,startY+1], [startX+1,startY+1],[startX,startY], [startX+1,startY]];
    return 0;
}

function dropTetronimo(coordinates){
    dropFinished=false;
    tempTetrisWell = JSON.parse(JSON.stringify(tetrisWell));
    length = coordinates.length;
    var tuple;
    var x;
    var y;
    tempDropBlock = [];
    for(coordinate=0; coordinate<length; coordinate++){
        tuple = coordinates[coordinate];
        x = tuple[0];
        y = tuple[1];
        ifImportant = includesList(coordinates, [x,y+1]);

        if((y===19) || (y==18 && ifImportant)){
            dropFinished = true;
            tempTetrisWell = [];
            return 0;
        }
        if(tetrisWell[x][y+1]!==0 && ifImportant==false){
            dropFinished=true;
            tempTetrisWell = [];
            return 0;
        }
        
        if(dropFinished===false){
            num = tempTetrisWell[x][y];
            tempTetrisWell[x][y]=0;
            tempTetrisWell[x][y+1]= num;
            if(ifImportant){
                tempTetrisWell[x][y+2]=num;
            }
            tempDropBlock.push([x,y+1]);
        }
    }
    tetrisWell = tempTetrisWell;
    tempTetrisWell = [];
    dropBlock = tempDropBlock;
    return 1;
}

function moveTetronimo(coordinates, goingRight){
    tempTetrisWell = tetrisWell;
    length = coordinates.length;
    var tempDropBlock = [];
    var x;
    var y;
    var tuple;
    var ifImportant;
    for(k=0; k<length; k++){
        tuple = coordinates[k];
        x = tuple[0];
        y = tuple[1];
        go = true;
        if (goingRight){
            ifImportant = includesList(coordinates, [x+1,y]);
        }
        
        if (!goingRight){
            ifImportant = includesList(coordinates, [x-1,y]);
        }

        if(((x===9)&&goingRight) || ((x===8)&&goingRight&&ifImportant)){
            go = false;
            return 0;
        }
        
        if(((x===0)&&(!goingRight)) || ((x===1)&&(!goingRight)&&ifImportant)){
            go = false;
            return 0;
        }
        
        if(tetrisWell[x][y+1]!==0 && ifImportant  && goingRight){
            go = false;
            return 0;
            
        }
        
        if(tetrisWell[x][y-1]!==0 && ifImportant  && !goingRight){
            go = false;
            return 0;
            
        }
        
        if(go){
            num = tempTetrisWell[x][y];
            tempTetrisWell[x][y]=0;
            tempTetrisWell[x+1][y]= num;
            if(ifImportant && goingRight){
                tempTetrisWell[x+2][y]=num;
            }
            
            if(ifImportant && !goingRight){
                tempTetrisWell[x-2][y]=num;
            }
            
            tempDropBlock.push([x+1,y])
        }
    }
    tetrisWell = tempTetrisWell;
    dropBlock = tempDropBlock;
    return 0;
}

function render(){
    for(x=0; x<10; x++){
        for(y=0; y<20; y++){
            if(tetrisWell[x][y] === 0){
                starts = coordinateToLocation(x,y);
                canvas2d.fillStyle = backgroundColor;
                canvas2d.fillRect(starts[0], starts[1], tetrisPixelSize, tetrisPixelSize);
            }
            
            if(tetrisWell[x][y] === 1){
                fillCoordinate(x,y,tetronimoIGradient);
            }
            
            if(tetrisWell[x][y] === 2){
                fillCoordinate(x,y,tetronimoJGradient);
            }
            
            if(tetrisWell[x][y] === 3){
                fillCoordinate(x,y,tetronimoLGradient);
            }
            
            if(tetrisWell[x][y] === 4){
                fillCoordinate(x,y,tetronimoOGradient);
            }
            
            if(tetrisWell[x][y] === 5){
                fillCoordinate(x,y,tetronimoSGradient);
            }
            
            if(tetrisWell[x][y] === 6){
                fillCoordinate(x,y,tetronimoTGradient);
            }
            
            if(tetrisWell[x][y] === 7){
                fillCoordinate(x,y,tetronimoZGradient);
            }
        }
    }
}

function init(){ 
    canvas2d.clearRect(0, 0, width, height);
    canvas2d.fillStyle = backgroundColor;
    canvas2d.strokeStyle = '#ffffff';
    canvas2d.fillRect(0, 0, width, height);
    canvas2d.lineWidth = width/100;
    canvas2d.beginPath()
    canvas2d.moveTo(Math.round(width/4), 0);
    canvas2d.lineTo(Math.round(width/4), height);
    canvas2d.moveTo(Math.round(3*width/4), 0);
    canvas2d.lineTo(Math.round(3*width/4), height);
    canvas2d.stroke();
    canvas2d.closePath();
    return 0;
}

async function main(){
    init();
    var a;
    while(true){
        drawTetronimoO();
        render();
        while(true){
            dropTetronimo(dropBlock);
            moveTetronimo(dropBlock, true);
            render();
            if(dropFinished){
                break
            }
            await sleep(500);
        }
        await sleep(500);
        
        
    }
}
document.addEventListener('DOMContentLoaded', domloaded, false);
async function domloaded(){
    main();
}

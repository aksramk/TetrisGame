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
var backgroundColor = '#1f305f';
var tetrisPixelSize = height / 20;
var tetrisWell = []
var dropFinished = false;
var dropBlock = [];
var time = 1000;
var change = false;
var ifSquare = false;
var gameOn = true;
var holdBlock = 0;
var holdFinished = false;
var canHold = true;
var nextFunc;
var tetrisLevel = 1;
var linesCleared = 0;
var numLines = 10;
var score = 0;
var speed = 25;
var countdownDone = true;
var dropNum = 0;
var spaced = false;
var startGame;
for (i = 0; i < 10; i++) {
    tetrisWell.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
}
var tempTetrisWell = tetrisWell;
var tempDropBlock = dropBlock;
var dropPivot = [];
var lineRot = 0;
var paused = false;
var draws = [drawTetronimoI,drawTetronimoJ,drawTetronimoL,drawTetronimoO,drawTetronimoS,drawTetronimoT,drawTetronimoZ];
canvas2d.textAlign = "center";

function wait(ms) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function listsEqual(l1, l2){
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
        if(listsEqual(bigList[j], subList)){
            return true
        }

    }
    return false
}

function tetronimoIGradient(x, y){
    var tetronimoIColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoIColor.addColorStop(0, "#4fa7f8");
    tetronimoIColor.addColorStop(1, "#57adf8");
    return tetronimoIColor;
}

function tetronimoJGradient(x, y){
    var tetronimoJColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoJColor.addColorStop(0, "#3c6ccd");
    tetronimoJColor.addColorStop(1, "#3157ab");
    return tetronimoJColor;
}

function tetronimoLGradient(x, y){
    var tetronimoLColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoLColor.addColorStop(0, "#e56a2e");
    tetronimoLColor.addColorStop(1, "#e56a2e");
    return tetronimoLColor;

}

function tetronimoOGradient(x, y){
    var tetronimoOColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoOColor.addColorStop(0, "#f2b03e");
    tetronimoOColor.addColorStop(1, "#f2b03e");
    return tetronimoOColor;

}

function tetronimoSGradient(x, y){
    var tetronimoSColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoSColor.addColorStop(0, "#53ad36");
    tetronimoSColor.addColorStop(1, "#53ad36");
    return tetronimoSColor;

}

function tetronimoTGradient(x, y){
    var tetronimoTColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoTColor.addColorStop(0, "#8770d3");
    tetronimoTColor.addColorStop(1, "#8770d3");
    return tetronimoTColor;

}

function tetronimoZGradient(x, y){
    var tetronimoZColor = canvas2d.createLinearGradient(x, y, x + tetrisPixelSize, y+ tetrisPixelSize);
    tetronimoZColor.addColorStop(0, "#ce4141");
    tetronimoZColor.addColorStop(1, "#ce3c31"); 
    return tetronimoZColor;

}

function coordinateToLocation(coordinateX,coordinateY){
    var startingX = Math.round(width/4) + Math.round(width/20) * coordinateX;
    var startingY =Math.round(height/20) * coordinateY;
    return [startingX, startingY];
    
}

function backgroundColorFunc(x,y){
    return backgroundColor;
}

function fillCoordinate(x,y,func){
    var h = coordinateToLocation(x,y);
    var x = h[0];
    var y = h[1];
    canvas2d.fillStyle = func(x, y);
    canvas2d.lineWidth = width/800;
    roundRect(canvas2d, x, y, tetrisPixelSize-width/1000, tetrisPixelSize-height/1000, Math.round(tetrisPixelSize/15), true);
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
  ctx.lineWidth = width/15;
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

function drawTetronimoI(startX=3, startY=0, newBlock=true){
    if(newBlock){
        if(tetrisWell[startX][startY]!==0 || tetrisWell[startX+1][startY]!==0 || tetrisWell[startX+2][startY]!==0 || tetrisWell[startX+3][startY]!==0){
            gameOn = false;
            return 0;
        }
        tetrisWell[startX][startY] = 1;
        tetrisWell[startX+1][startY] = 1;
        tetrisWell[startX+2][startY] = 1;
        tetrisWell[startX+3][startY] = 1;

        dropFinished=false;
        dropBlock = [[startX,startY], [startX+1,startY],[startX+2,startY], [startX+3,startY]];
        dropCoordinate = [startX+1,startY];
        dropPivot = [startX+1, startY];
        ifSquare = false;
        ifLine = true;
        lineRot = 0;
    }
    else{
        fillCoordinate(startX-.5, startY+.5, tetronimoIGradient);
        fillCoordinate(startX+.5, startY+.5, tetronimoIGradient);
        fillCoordinate(startX+1.5, startY+.5, tetronimoIGradient);
        fillCoordinate(startX+2.5, startY+.5, tetronimoIGradient);
    }
    
    return 0;
}

function drawTetronimoJ(startX = 3, startY=0, newBlock=true){
    if(newBlock){
        if(tetrisWell[startX][startY]!==0 || tetrisWell[startX][startY+1]!==0 || tetrisWell[startX+1][startY+1]!==0 || tetrisWell[startX+2][startY+1]!==0){
            gameOn = false;
            return 0;
        }  
        tetrisWell[startX][startY] = 2;
        tetrisWell[startX][startY+1] = 2;
        tetrisWell[startX+1][startY+1] = 2;
        tetrisWell[startX+2][startY+1] = 2;
        dropFinished=false;
        dropBlock = [[startX,startY], [startX,startY+1],[startX+1,startY+1], [startX+2,startY+1]];
        dropPivot = [startX+1, startY+1]
        ifSquare = false;
        ifLine = false;
    }
    else{
        fillCoordinate(startX, startY, tetronimoJGradient);
        fillCoordinate(startX, startY+1, tetronimoJGradient);
        fillCoordinate(startX+1, startY+1, tetronimoJGradient);
        fillCoordinate(startX+2, startY+1, tetronimoJGradient);
    }
    return 0;
}

function drawTetronimoL(startX = 3, startY=0, newBlock=true){
    if(newBlock){
        if(tetrisWell[startX][startY+1]!==0 || tetrisWell[startX+1][startY+1]!==0 || tetrisWell[startX+2][startY+1]!==0 || tetrisWell[startX+2][startY]!==0){
            gameOn = false;
            return 0;
        }
        tetrisWell[startX][startY+1] = 3;
        tetrisWell[startX+1][startY+1] = 3;
        tetrisWell[startX+2][startY+1] = 3;
        tetrisWell[startX+2][startY] = 3;
        dropFinished=false;
        dropBlock = [[startX,startY+1], [startX+1,startY+1],[startX+2,startY+1], [startX+2,startY]];
        dropPivot = [startX+1, startY+1];
        ifSquare = false;
        ifLine = false;
    }
    else{
        fillCoordinate(startX, startY+1, tetronimoLGradient);
        fillCoordinate(startX+1, startY+1, tetronimoLGradient);
        fillCoordinate(startX+2, startY+1, tetronimoLGradient);
        fillCoordinate(startX+2, startY, tetronimoLGradient);
    }
    
    return 0;
}

function drawTetronimoO(startX = 3, startY=0, newBlock=true){
    if(newBlock){
        if(tetrisWell[startX+1][startY]!==0 || tetrisWell[startX+2][startY]!==0 || tetrisWell[startX+1][startY+1]!==0 || tetrisWell[startX+2][startY+1]!==0){
            gameOn = false;
            return 0;
        }
        tetrisWell[startX+1][startY] = 4;
        tetrisWell[startX+2][startY] = 4;
        tetrisWell[startX+1][startY+1] = 4;
        tetrisWell[startX+2][startY+1] = 4;
        
        dropFinished=false;
        dropBlock = [[startX+1,startY], [startX+2,startY],[startX+1,startY+1], [startX+2,startY+1]];
        ifSquare = true;
        ifLine = false;
    }
    else{
        fillCoordinate(startX+.5, startY, tetronimoOGradient);
        fillCoordinate(startX+1.5, startY, tetronimoOGradient);
        fillCoordinate(startX+.5, startY+1, tetronimoOGradient);
        fillCoordinate(startX+1.5, startY+1, tetronimoOGradient);
    }
    
    return 0;
}

function drawTetronimoS(startX = 3, startY=0, newBlock=true){
    if(newBlock){
        if(tetrisWell[startX+1][startY]!==0 || tetrisWell[startX][startY+1]!==0 || tetrisWell[startX+1][startY+1]!==0 || tetrisWell[startX+2][startY]!==0){
            gameOn = false;
            return 0;
        }
        tetrisWell[startX+1][startY] = 5;
        tetrisWell[startX][startY+1] = 5;
        tetrisWell[startX+1][startY+1] = 5;
        tetrisWell[startX+2][startY] = 5;
        dropFinished=false;
        dropBlock = [[startX+1,startY], [startX,startY+1],[startX+1,startY+1], [startX+2,startY]];
        dropPivot = [startX+1,startY];
        ifSquare = false;
        ifLine = false;
    }
    else{
        fillCoordinate(startX+1, startY, tetronimoSGradient);
        fillCoordinate(startX, startY+1, tetronimoSGradient);
        fillCoordinate(startX+1, startY+1, tetronimoSGradient);
        fillCoordinate(startX+2, startY, tetronimoSGradient);
    }
    return 0;
}

function drawTetronimoT(startX = 3, startY = 0, newBlock=true){
    if(newBlock){
        if(tetrisWell[startX][startY+1]!==0 || tetrisWell[startX+1][startY+1]!==0 || tetrisWell[startX+1][startY]!==0 || tetrisWell[startX+2][startY+1]!==0){
            gameOn = false;
            return 0;
        }
        tetrisWell[startX][startY+1] = 6;
        tetrisWell[startX+1][startY+1] = 6;
        tetrisWell[startX+1][startY] = 6;
        tetrisWell[startX+2][startY+1] = 6;
        dropFinished=false;
        dropBlock = [[startX,startY+1], [startX+1,startY+1],[startX+1,startY], [startX+2,startY+1]];
        dropPivot = [startX+1,startY+1];
        ifSquare = false;
        ifLine = false;
    }
    else{
        fillCoordinate(startX, startY+1, tetronimoTGradient);
        fillCoordinate(startX+1, startY+1, tetronimoTGradient);
        fillCoordinate(startX+1, startY, tetronimoTGradient);
        fillCoordinate(startX+2, startY+1, tetronimoTGradient);
    }
    return 0;
}

function drawTetronimoZ(startX = 3, startY = 0, newBlock=true){
    if(newBlock){
        if(tetrisWell[startX][startY]!==0 || tetrisWell[startX+1][startY]!==0 || tetrisWell[startX+1][startY+1]!==0 || tetrisWell[startX+2][startY+1]!==0){
            gameOn = false;
            return 0;
        }
        tetrisWell[startX][startY] = 7;
        tetrisWell[startX+1][startY] = 7;
        tetrisWell[startX+1][startY+1] = 7;
        tetrisWell[startX+2][startY+1] = 7;
        dropFinished=false;
        dropBlock = [[startX,startY], [startX+1,startY],[startX+1,startY+1], [startX+2,startY+1]];
        dropPivot = [startX+1,startY];
        ifSquare = false;
        ifLine = false;
    }
    else{
        fillCoordinate(startX, startY, tetronimoZGradient);
        fillCoordinate(startX+1, startY, tetronimoZGradient);
        fillCoordinate(startX+1, startY+1, tetronimoZGradient);
        fillCoordinate(startX+2, startY+1, tetronimoZGradient);
    }
    return 0;
}

async function dropTetronimo(coordinates){
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
        ifDown = includesList(coordinates, [x,y-1]);

        if((y===19)){
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
            if(!ifDown){
                tempTetrisWell[x][y]=0;
            }
            tempTetrisWell[x][y+1]= num;
            if(ifImportant){
                tempTetrisWell[x][y+2]=num;
            }
            tempDropBlock.push([x,y+1]);
        }
    }
    tetrisWell = JSON.parse(JSON.stringify(tempTetrisWell));
    tempTetrisWell = [];
    dropBlock = JSON.parse(JSON.stringify(tempDropBlock));
    dropPivot[1]++;
    return 1;
}

function moveTetronimo(coordinates, goingRight){
    tempTetrisWell = JSON.parse(JSON.stringify(tetrisWell));
    length = coordinates.length;
    var tempDropBlock = [];
    var x;
    var y;
    var tuple;
    var ifImportant;
    var ifLeft;
    var perm = -1972;
    var ifRight;
    for(coordList=0; coordList<length; coordList++){
        tuple = coordinates[coordList];
        x = tuple[0];
        y = tuple[1];
        if(x>perm){
            perm = x;
        }
        go = true;
        if (goingRight){
            ifImportant = includesList(coordinates, [x+1,y]);
            ifLeft = includesList(coordinates, [x-1,y]);
        }
        
        if (!goingRight){
            ifImportant = includesList(coordinates, [x-1,y]);
            ifRight = includesList(coordinates, [x+1,y]);
        }

        if(((x===9)&&goingRight)){
            go = false;

            return 0;
        }
        if((x===8)&&goingRight&&ifImportant){
            go = false;
            return 0;
        }
        
        if((x===0)&&(!goingRight)){
            go = false;
            return 0;
        }
        
        if((x===1)&&(!goingRight)&&ifImportant){
            go = false;
            return 0;
        }
        
        if(goingRight){
            if(tetrisWell[x+1][y]!==0 && !ifImportant){
                go = false;
                return 0;   
            }
        }
        
        
        if(!goingRight){
            if(tetrisWell[x-1][y]!==0 && !ifImportant){
                go = false;
                return 0;
            }
            
        }
        
        

        
        num = tempTetrisWell[x][y];
        tempTetrisWell[x][y]=0;
        if(goingRight){
            tempTetrisWell[x+1][y]= num;
            tempDropBlock.push([x+1,y])
            if (ifLeft){
                tempTetrisWell[x][y]=num;
            }
        }

        if(!goingRight){
            tempTetrisWell[x-1][y]= num;
            tempDropBlock.push([x-1,y])
            if (ifRight){
                tempTetrisWell[x][y]=num;
            }
        }

        if(ifImportant && goingRight){
            tempTetrisWell[x+2][y]=num;
        }

        if(ifImportant && !goingRight){
            tempTetrisWell[x-2][y]=num;
        }

    }
    tetrisWell = JSON.parse(JSON.stringify(tempTetrisWell));;
    dropBlock = JSON.parse(JSON.stringify(tempDropBlock));
    if(goingRight){
        dropPivot[0] = dropPivot[0]+1;
    }
    if(!goingRight){
        dropPivot[0] = dropPivot[0]-1;
    }
    return 0;
}

function rotateTetronimoBox(coordinates, pivotCoordinate){
    var tempDropBlock = [];
    var tempDropPivot = [];
    var tempTetrisWell = JSON.parse(JSON.stringify(tetrisWell));
    var pushRight = false;
    var pushLeft = false;
    var pushDown = false;
    for (swivel = 0; swivel < coordinates.length; swivel++){
        var coordinate = coordinates[swivel];
        var x = coordinate[0];
        var y = coordinate[1];
        var y0 = y;
        var x0 = x;
        y = pivotCoordinate[1]+(x-pivotCoordinate[0]);
        x = pivotCoordinate[0] - (y0-pivotCoordinate[1]);
        if(x>9){
            pushLeft = true;
            console.log(x)
            break;
        }
        if(x<0){
            pushRight = true;
            console.log(x)
            break;
        }
        if(y<0){
            pushDown = true;
            break;
        }
    }
    for (swivel = 0; swivel < coordinates.length; swivel++){
        var coordinate = coordinates[swivel];
        var x = coordinate[0];
        var y = coordinate[1];
        var y0 = y;
        var x0 = x;
        y = pivotCoordinate[1]+(x-pivotCoordinate[0]);
        x = pivotCoordinate[0] - (y0-pivotCoordinate[1]);
        if(pushRight){
            x++;
        }
        if(pushDown){
            y++
        }
        if(pushLeft){
            x--;
        }


        if(x0+pushRight-pushLeft==x && y0+pushDown===y){
            tempDropPivot = [x,y];
            if(pushRight || pushLeft){
                console.log(x,y)
            }
        }
        
        var ifTrue = includesList(coordinates, [x, y]);

        if(tetrisWell[x][y]!==0 && !ifTrue){
            tempDropBlock = [];
            return 0;
        }

        if(includesList(tempDropBlock, [x0,y0])){
            tempDropBlock.push([x,y]);
            num = tetrisWell[x0][y0];
            tempTetrisWell[x][y] = num;
        }
        else{
            tempDropBlock.push([x,y]);
            num = tetrisWell[x0][y0];
            tempTetrisWell[x0][y0] = 0;
            tempTetrisWell[x][y] = num;


        }
        
        
    }
    
    tetrisWell = JSON.parse(JSON.stringify(tempTetrisWell));
    dropBlock = JSON.parse(JSON.stringify(tempDropBlock));

    dropPivot = JSON.parse(JSON.stringify(tempDropPivot));

}

function rotateTetronimoLine(coordinates){
    if(lineRot === 0) {
        coordinates.sort(function(a,b){return a[1] > b[1]})
        xValue = coordinates[2][0];
        yValueMin = coordinates[0][1]-1;
        if(yValueMin<0){
            yValueMin++;
        }

        if(yValueMin>16){
            yValueMin=16;
        }
        var tempDropBlock = [[xValue, yValueMin], [xValue, yValueMin+1], [xValue, yValueMin+2], [xValue, yValueMin+3]]
        for(block=0;block<4;block++){
            var coordinate = tempDropBlock[block];
            if(coordinate[0] > 9 || coordinate[1] > 19 || coordinate[1] < 0 || coordinate[0] < 0){
                tempDropBlock = 0;
                return 0;
            }

            if(tetrisWell[coordinate[0]][coordinate[1]] !== 0 && !includesList(dropBlock, coordinate)) {
                tempDropBlock = 0;
                return 0;
            }
            
        }
        tetrisWell[coordinates[0][0]][coordinates[0][1]] = 0;
        tetrisWell[coordinates[1][0]][coordinates[1][1]] = 0;
        tetrisWell[coordinates[2][0]][coordinates[2][1]] = 0;
        tetrisWell[coordinates[3][0]][coordinates[3][1]] = 0;
        tetrisWell[xValue][yValueMin] = 1;
        tetrisWell[xValue][yValueMin + 1] = 1;
        tetrisWell[xValue][yValueMin + 2] = 1;
        tetrisWell[xValue][yValueMin + 3] = 1;
        dropBlock = JSON.parse(JSON.stringify(tempDropBlock))
        
    }

    if(lineRot === 1) {
        coordinates.sort(function(a,b){return a[0] > b[0]})
        xValueMin = coordinates[0][0]-2;
        yValue = coordinates[2][1];

        if(xValueMin>6){
            xValueMin=6;
        }
        if(xValueMin<0){
            xValueMin=0;
        }
        var tempDropBlock = [[xValueMin, yValue], [xValueMin+1, yValue], [xValueMin+2, yValue], [xValueMin+3, yValue]]
        for(block=0;block<4;block++){
            var coordinate = tempDropBlock[block];
            if(coordinate[0] > 9 || coordinate[1] > 19 || coordinate[1] < 0 || coordinate[0] < 0){
                tempDropBlock = 0;
                return 0;
            }

            if(tetrisWell[coordinate[0]][coordinate[1]] !== 0 && !includesList(dropBlock, coordinate)) {
                tempDropBlock = 0;
                return 0;
            }
            
        }
        tetrisWell[coordinates[0][0]][coordinates[0][1]] = 0;
        tetrisWell[coordinates[1][0]][coordinates[1][1]] = 0;
        tetrisWell[coordinates[2][0]][coordinates[2][1]] = 0;
        tetrisWell[coordinates[3][0]][coordinates[3][1]] = 0;
        tetrisWell[xValueMin][yValue] = 1;
        tetrisWell[xValueMin+1][yValue] = 1;
        tetrisWell[xValueMin+2][yValue] = 1;
        tetrisWell[xValueMin+3][yValue] = 1;
        dropBlock = JSON.parse(JSON.stringify(tempDropBlock))
        
    }

    if(lineRot === 2) {
        coordinates.sort(function(a,b){return a[1] > b[1]})
        xValue = coordinates[1][0];
        yValueMin = coordinates[0][1]-2;
        if(yValueMin<0){
            yValueMin=0;
        }
        if(yValueMin>16){
            yValueMin=16;
        }
        var tempDropBlock = [[xValue, yValueMin], [xValue, yValueMin+1], [xValue, yValueMin+2], [xValue, yValueMin+3]]
        for(block=0;block<4;block++){
            var coordinate = tempDropBlock[block];
            if(coordinate[0] > 9 || coordinate[1] > 19 || coordinate[1] < 0 || coordinate[0] < 0){
                tempDropBlock = 0;
                return 0;
            }

            if(tetrisWell[coordinate[0]][coordinate[1]] !== 0 && !includesList(dropBlock, coordinate)) {
                tempDropBlock = 0;
                return 0;
            }
            
        }
        tetrisWell[coordinates[0][0]][coordinates[0][1]] = 0;
        tetrisWell[coordinates[1][0]][coordinates[1][1]] = 0;
        tetrisWell[coordinates[2][0]][coordinates[2][1]] = 0;
        tetrisWell[coordinates[3][0]][coordinates[3][1]] = 0;
        tetrisWell[xValue][yValueMin] = 1;
        tetrisWell[xValue][yValueMin + 1] = 1;
        tetrisWell[xValue][yValueMin + 2] = 1;
        tetrisWell[xValue][yValueMin + 3] = 1;
        dropBlock = JSON.parse(JSON.stringify(tempDropBlock))
        
    }

    if(lineRot === 3) {
        coordinates.sort(function(a,b){return a[0] > b[0]})
        xValueMin = coordinates[0][0]-1;
        yValue = coordinates[0][1]+1;
        if(xValueMin>6){
            xValueMin=6;
        }
        if(xValueMin<0){
            xValueMin=0;
        }
        var tempDropBlock = [[xValueMin, yValue], [xValueMin+1, yValue], [xValueMin+2, yValue], [xValueMin+3, yValue]]
        for(block=0;block<4;block++){
            var coordinate = tempDropBlock[block];
            if(coordinate[0] > 9 || coordinate[1] > 19 || coordinate[1] < 0 || coordinate[0] < 0){
                tempDropBlock = 0;
                return 0;
            }

            if(tetrisWell[coordinate[0]][coordinate[1]] !== 0 && !includesList(dropBlock, coordinate)) {
                tempDropBlock = 0;
                return 0;
            }
            
        }
        tetrisWell[coordinates[0][0]][coordinates[0][1]] = 0;
        tetrisWell[coordinates[1][0]][coordinates[1][1]] = 0;
        tetrisWell[coordinates[2][0]][coordinates[2][1]] = 0;
        tetrisWell[coordinates[3][0]][coordinates[3][1]] = 0;
        tetrisWell[xValueMin][yValue] = 1;
        tetrisWell[xValueMin+1][yValue] = 1;
        tetrisWell[xValueMin+2][yValue] = 1;
        tetrisWell[xValueMin+3][yValue] = 1;
        dropBlock = JSON.parse(JSON.stringify(tempDropBlock))
        
    }

    lineRot++;
    lineRot = lineRot%4;
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
    // writeScore(score);
    return 0;
}

function clearRow(num){
    tempTetrisWell = JSON.parse(JSON.stringify(tetrisWell))
    for(xo=0; xo<10;xo++){
        for(yo=1; yo<=num; yo++){
            tempTetrisWell[xo][yo] = tetrisWell[xo][yo-1];
        }
        tempTetrisWell[xo][0]=0;
    }
    tetrisWell = JSON.parse(JSON.stringify(tempTetrisWell))
    return 0;
}


function clearSuccess(){
    var scoreLines = 0;
    var listScores = scoreReinitialize(tetrisLevel);

    for(y=0;y<20; y++){
        makeSure = true;
        for(x=0; x<10; x++){
            if(tetrisWell[x][y]===0){
                makeSure = false;
            }
        }
        if(makeSure){
            time *= .98;
            linesCleared++;
            if(linesCleared===numLines){
                linesCleared = 0;
                tetrisLevel++;
            }
            scoreLines++;
            clearRow(y)
        }
    }

    for(y=0;y<20; y++){
        perfectClear = true;
        for(x=0; x<10; x++){
            if(tetrisWell[x][y]!==0){
                perfectClear=false;
            }
        }
    }
    
    if(scoreLines!==0 && perfectClear){
        score+=10 *listScores[scoreLines-1];
    }
    else if(scoreLines!==0){
        score += listScores[scoreLines-1];
    }
}

function scoreReinitialize(level){
    var levelScoreVar = Math.min(Math.floor(level/2)+1, 5);
    return [100 * levelScoreVar, 400 * levelScoreVar, 900 * levelScoreVar, 2000 * levelScoreVar, levelScoreVar];
}

function showNextFunc(nextFunc){
    var start = coordinateToLocation(10.4, 7)
    var startX = start[0]
    var startY = start[1]
    var end = coordinateToLocation(15, 11)
    var endX = end[0]
    var endY = end[1]
    canvas2d.fillStyle = backgroundColor;
    canvas2d.fillRect(startX, startY, endX-startX, endY-startY);
    nextFunc(11,8,false);
}

async function writeScore(score){
    var stringAddon = Math.round((width/35)).toString()
    canvas2d.fillStyle = backgroundColor;
    canvas2d.fillRect(0, 40*height/50, width/4-width/100, 10*height/50)
    canvas2d.font = stringAddon + "px Righteous";
    canvas2d.fillStyle = "#ffffff";
    canvas2d.save()
    canvas2d.restore()
    canvas2d.fillText("Score: " + score, Math.round(width/8.2), Math.round(48*height/50));
    canvas2d.fillText("Level: " + tetrisLevel, Math.round(width/8.2), Math.round(46*height/50));
    if(startGame===0){
        await sleep(10);
        canvas2d.fillStyle = backgroundColor;
        canvas2d.fillRect(0, 40*height/50, width/4-width/100, 10*height/50)
        canvas2d.fillStyle = "#ffffff";
        canvas2d.fillText("Score: " + score, Math.round(width/8.2), Math.round(48*height/50));
        canvas2d.fillText("Level: " + tetrisLevel, Math.round(width/8.2), Math.round(46*height/50));
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
    return 0;
}

function writeHold(){
    var stringAddon = Math.round((width/20)).toString()
    canvas2d.save();
    canvas2d.fillStyle = backgroundColor;
    canvas2d.fillRect(Math.round(width/14), Math.round(10 * height/50), width/100, height/500);
    canvas2d.font = stringAddon + "px Righteous";
    canvas2d.fillStyle = backgroundColor;
    canvas2d.fillRect(Math.round(width/14), Math.round(10 * height/50), width/8, height/5-height/75);
    canvas2d.fillStyle = "#ffffff";
    canvas2d.fillText("Hold", Math.round(width/8.2), Math.round(18*height/50));
    canvas2d.restore();
}

function writeNext(){
    var stringAddon = Math.round((width/20)).toString()
    canvas2d.save();
    canvas2d.font = stringAddon + "px Righteous";
    canvas2d.fillStyle = backgroundColor;
    canvas2d.fillRect(Math.round(11.5 * width/14), Math.round(10 * height/50), width, height/5 - height/75);
    canvas2d.fillStyle = "#ffffff";
    canvas2d.fillText("Next", Math.round(3*width/4 + width/8), Math.round(18*height/50));
    canvas2d.restore();
    return 0;
}

function countdown(){
    countdownDone=false
    for(number=3;number>0;number--){
        var stringAddon = Math.round((width/10)).toString()
        canvas2d.font = stringAddon + "px Righteous";
        canvas2d.fillStyle = "#ffffff"
        canvas2d.fillText(number, Math.round(width/2 * .95), Math.round(height/2 * .95))
        canvas2d.stroke();
        wait(1000);
    }
    
    return 0;
}

async function main(){
    startGame = 0;
    gameOn = true;
    var a;
    var n = 0;
    init();
    
    nextFunc = draws[Math.floor(Math.random()*draws.length)];
    while(gameOn){
        writeScore(score);
        if(!holdFinished){
            funcNow = nextFunc;
            nextFunc = draws[Math.floor(Math.random()*draws.length)];
            funcNow();
            canHold = true;
        }
        else{
            holdFinished = false;
            
        }
        
        showNextFunc(nextFunc);

        while(true){
            if(!paused){
                render();
                writeNext();
                writeHold();
                await sleep(5);
                writeNext();
                writeHold();
                
                if(dropFinished){
                    dropNum++;
                    clearSuccess();
                    writeScore(score);
                    if(dropNum%1!==0){
                        dropFinished = false;
                    }
                    else{
                        break;
                    }
                }

                if(holdFinished){
                    break;  
                }
                for(sleeping=0;sleeping<10;sleeping++){
                    if(spaced===true){
                        spaced = false;
                        break;
                    }
                    await sleep(time/10);
                }
                if(!paused){
                    dropTetronimo(dropBlock);
                    render();
                }
                if(change&&!dropFinished){
                    listScore = scoreReinitialize(tetrisLevel)
                    score += listScore[listScore.length-1];
                }
            }
            else{
                await sleep(5)
            }
            startGame++;
        }
        n++;
        await sleep(5);
        
        
    }
    init();
    var stringAddon = Math.round((width/11.3)).toString()
    canvas2d.font = stringAddon + "px Righteous";
    canvas2d.fillStyle = "#ffffff";
    
    canvas2d.fillText("Game Over", Math.round(width/2), Math.round(height/2));
    canvas2d.fillText("Game Over", Math.round(width/2), Math.round(height/2));
    var stringAddon = Math.round((width/30)).toString()
    canvas2d.font = stringAddon + "px Righteous";
    canvas2d.fillText("Your Score Was: " + score, Math.round(width/2, Math.round(30*height/50)));

}
document.addEventListener('DOMContentLoaded', domloaded, false);
document.addEventListener("keydown", dealWithKeyboard, false);
document.addEventListener("keyup", keyboardEnded, false);
function dealWithKeyboard(e){
    if(!gameOn){
        return 0;
    }
    if(e.keyCode===80){
        paused = !paused;
        if(paused){
            canvas2d.fillStyle=backgroundColor;
            canvas2d.fillRect(0, 0, width, height);
            init();
            canvas2d.fillStyle="#ffffff";
            var stringAddon = Math.round((width/11.3)).toString()
            canvas2d.font = stringAddon + "px Righteous";
            canvas2d.fillText("Paused", Math.round(width/2), Math.round(height/2));
        }

        else{
            writeNext();
            writeHold();
            writeScore(score);
            render();

        }
        return 0;
    }
    switch(e.keyCode){
        case 16:
            if(holdBlock === 0 && canHold){
                for(eraseCoord=0;eraseCoord<4;eraseCoord++){
                    tetrisWell[dropBlock[eraseCoord][0]][dropBlock[eraseCoord][1]] = 0;
                }
                holdBlock = funcNow;
                holdFinished = true
                canHold = false;
                nextFunc(3,0);
                nextFunc = draws[Math.floor(Math.random()*draws.length)];
                showNextFunc(nextFunc);
                var start = coordinateToLocation(-5, 7)
                var startX = start[0]
                var startY = start[1]
                var end = coordinateToLocation(-.4, 11)
                var endX = end[0]
                var endY = end[1]
                canvas2d.fillStyle = backgroundColor;
                canvas2d.fillRect(startX, startY, endX-startX, endY-startY);
                holdBlock(-4,8,false);
                writeHold();
                render();
            }
            else if(canHold){
                for(eraseCoord=0;eraseCoord<4;eraseCoord++){
                    tetrisWell[dropBlock[eraseCoord][0]][dropBlock[eraseCoord][1]] = 0;
                }
                var start = coordinateToLocation(-5, 7)
                var startX = start[0]
                var startY = start[1]
                var end = coordinateToLocation(-.4, 11)
                var endX = end[0]
                var endY = end[1]
                canvas2d.fillStyle = backgroundColor;
                canvas2d.fillRect(startX, startY, endX-startX, endY-startY);
                holdBlock(3,0);
                canHold = false;
                holdBlock = funcNow;
                holdFinished = true
                holdBlock(-4,8,false);
                writeHold();
                render();
            
            }

            else{
                return 0;
            }
            break;

        case 37:
            if(!dropFinished){
                moveTetronimo(dropBlock,false)
                render();
            }
            break;

        case 38:
            if(!ifSquare && !ifLine && !dropFinished){
                rotateTetronimoBox(dropBlock, dropPivot);
                render();
            }
            
            if(ifLine && !dropFinished){
                rotateTetronimoLine(dropBlock);
                render();
                break
            }
            render();
            break;

        case 39:
            if(!dropFinished){
                moveTetronimo(dropBlock,true)
                render();
            }
            break;

        case 40:
            if(!change){
                time/=speed;
            }
            change = true
            break;

        case 32:
            while(!dropFinished){
                dropTetronimo(dropBlock);
                if(!dropFinished){
                    listScore = scoreReinitialize(tetrisLevel)
                    score += listScore[listScore.length-1];
                }
            }
            dropNum = dropNum + dropNum%2
            dropFinished = true;
            render();
            spaced = true;
            break;
    }
}
function keyboardEnded(e){
    switch(e.keyCode){
        case 40:
            if(change){
                time*=speed;
            }
            change = false;
    }
}
async function domloaded(){
    main();
}

var startingTiles = 2;
var spawnFourTileChance = .1;
var tileSize = 100;
var tilePadding = 16;
var gameFinished = 0;
var board = new Array(16);

$("#tile-container").bind("click", function(){
  $(this).addClass("meme");
  setTimeout(function(){ $("#tile-container").removeClass("meme"); }, 2250);
});

$(document).keydown(function(e) {  
  switch(e.which) {
    case 37: // left
    updateGame(4);
    break;

    case 38: // up
    updateGame(1);
    break;

    case 39: // right
    updateGame(2);
    break;

    case 40: // down
    updateGame(3);
    break;
    
    case 13: // enter
      resetGame();
      break;
  }
});

$(function() {
  initGrid();
  init();
  
  /* $("#tile-container").append("<div class='tile tile-16 tile-4-2'></div>");
  $("#tile-container").append("<div class='tile tile-4 tile-4-2'></div>");
  $("#tile-container").append("<div class='tile tile-512 tile-4-2'></div>");*/
});


  /* ==================== */
 /* game state functions */
/* ==================== */

function initGrid(){
  for(var i=0; i<16; i++)
    $("#tile-container").append("<div class='tile-bg'></div>");
}

function init(){
  $(".tile").remove();
  hideGameOverScreen();
  for(var i = 0; i < 16; i++)
    board[i] = 0;
  for(var i=0; i<startingTiles; i++)
    addRandomTile();
}

function resetGame(){
  if(gameFinished == 0){ // stop here if the game is still active (e.g. when user presses enter during active game
    return;
  }
    
  gameFinished = 0;
  init();
}

function updateGame(direction){
  if(gameFinished > 0) return; // ignore arrow key presses in game over state
  
  updateBoard(direction);
  addRandomTile();
  updateGameState();
  if(gameFinished){
    showGameOverScreen();
  }
}

function showGameOverScreen(){
  $("#game-over-screen").fadeIn(1000);
  $("#tile-container").addClass("blurred");
  $("#game-restart-button").bind("click", resetGame);
  $("#hide-game-over-screen-button").bind("click", hideGameOverScreen);
}

function hideGameOverScreen(){
  $("#game-over-screen").fadeOut(100);
  $("#tile-container").removeClass("blurred");
}

function updateGameState(){
  gameFinished = getEmptyTiles().length == 0;
}


  /* ================ */
 /* action functions */
/* ================ */

function updateBoard(direction){
  if(direction == 2){
    for(var i=0; i<16; i+=4){
      shiftArray( board.slice(i,i+4), false, false, i/4);
    }
  }
}

function addRandomTile(){
  var emptyTiles = getEmptyTiles();
  var index = emptyTiles[ Math.floor(Math.random()*emptyTiles.length) ];
  var val = Math.random() < spawnFourTileChance ? 4 : 2;
  board[index] = val;
  coords = getCoordsFromIndex(index);
  console.log("Adding tile at index "+index+" | coords: ("+coords[0]+"|"+coords[1]+")");
  $("#tile-container").append("<div class='tile tile-"+val+" tile-"+coords[0]+"-"+coords[1]+"'></div>");
}

function moveTileStack(startX, startY, destX, destY){
  var elements = $(".tile-"+startX+"-"+startY);
  var newXOffset = tilePadding + ( (destX-1)*(tileSize + tilePadding) );
  var newYOffset = tilePadding + ( (destY-1)*(tileSize + tilePadding) );
  
  elements.css( "-webkit-transform", "translate("+newYOffset+"px, "+newXOffset+"px)" );
  
  elements.removeClass( elements.attr("class").split(" ").pop() ); //remove last class
  elements.addClass("tile-"+destX+"-"+destY);
}
/* function move(element, x, y){
  var newXOffset = tilePadding + ( x*(tileSize + tilePadding) );
  var newYOffset = tilePadding + ( y*(tileSize + tilePadding) );

  element.css( "-webkit-transform", "translate("+newYOffset+"px, "+newXOffset+"px)" );
  element.removeClass( element.attr("class").split(" ").pop() );
  element.addClass("tile-"+x+"-"+y);
} */


  /* ================ */
 /* helper functions */
/* ================ */

function removeBuriedTiles(x,y){
  //TODO
  var elements = $(".tile-"+x+"-"+y);
}

function getEmptyTiles(){
  var emptyTiles = [];
  for(var i = 0; i<16; i++){
    if(board[i] == 0) emptyTiles.push(i);
  }
  return emptyTiles;
}

function getCoordsFromIndex(i){
  var x = i%4;
  var y = Math.floor(i/4);
  return [x+1,y+1];
}

function shiftArray(arr, vertical, isReverse, index){
  var newArr = new Array(4);
  
  for(var i=arr.length-2; i>=0; i--){
    if(arr[i]==0) continue;
    
    var val = arr[i];
    var merged = false;
    var currentPos = i;
    offset = 1;
    while(arr[currentPos+offset] == 0 && currentPos+offset<4){
      offset++;
    }
    
    var newpos = i+offset-1;
    if(i+offset<4){
      newpos=i+offset;
      merged = true;
    }
    
    arr[newpos] = arr[i];
    arr[i] = 0;
    
    /* var element = $(".tile-"+i+"-"+index);
    if(merged){
      element.removeClass("tile-"+val);
      element.addClass("tile-"+val*2);
    } */
  }
}

var startingTiles = 0;
var spawnFourTileChance = .1;
var tileSize = 100;
var tilePadding = 16;
var gameFinished = 0;
var board = new Array(16);
var spinEnabled = false;

$("#tile-container").bind("click", function(){
  if(!spinEnabled) return;
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
});

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

  createTileAt(0,2);
  createTileAt(1,2);
  createTileAt(2,4);
  createTileAt(3,4);
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
  //addRandomTile();
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

function updateBoard(direction){
  printBoard();
  
  for(var i=0; i<16; i+=4){
    var returnVal = shiftArray( board.slice(i,i+4) );
    var updatedArray = returnVal[0];
    var tileUpdates = returnVal[1];
    var merged = returnVal[2];
    
    board.splice(i,4,updatedArray[0],updatedArray[1],updatedArray[2],updatedArray[3]); //TODO: improve this
    
    for(var j = 3; j>=0; j--){
      if( tileUpdates[j] == 0 ) continue;
      
      console.log(j + " => " + tileUpdates[j]);
      moveTileStack(j+i, tileUpdates[j]+i);
    }
    
    /*for(var tile in updatedArray){
      if(updatedArray[tile] > 0 && merged[tile]){ //TODO: check if updatedArray[tile] > 0 is necessary
        setTimeout(function(){
          createTileAt(3, 8);
        }, 100);  
      }
    } */
    for(var tile in merged){
      if(merged[tile]){
        createTileAt(i+parseInt(tile), board[i+parseInt(tile)]); //TODO: setTimeout here
      }
    }
  }
  printBoard();
}

function addRandomTile(){
  var emptyTiles = getEmptyTiles();
  var index = emptyTiles[ Math.floor(Math.random()*emptyTiles.length) ];
  var val = Math.random() < spawnFourTileChance ? 4 : 2;
  createTileAt(index, val);
}

function createTileAt(pos, val){
  board[pos] = val;
  coords = getCoordsFromIndex(pos);
  var className = "tile-"+coords[1]+"-"+coords[0];
  
  
  $("#tile-container").append("<div class='tile tile-"+val+" "+ className +"'></div>");
}

function moveTileStack(start, dest){
  var startX = getCoordsFromIndex(start)[0];
  var startY = getCoordsFromIndex(start)[1];
  var destX = getCoordsFromIndex(dest)[0];
  var destY = getCoordsFromIndex(dest)[1];
  
  //alert("Moving from "+".tile-"+startY+"-"+startX+" to "+"tile-"+destY+"-"+destX);
                                                  
  var elements = $(".tile-"+startY+"-"+startX);
  
  /*var newXOffset = tilePadding + ( (destX-1)*(tileSize + tilePadding) );
  var newYOffset = tilePadding + ( (destY-1)*(tileSize + tilePadding) );
  
  elements.css( "-webkit-transform", "translate("+newYOffset+"px, "+newXOffset+"px)" );*/
  
  elements.removeClass( elements.attr("class").split(" ").pop() ); //remove last class
  elements.addClass("tile-"+destY+"-"+destX);
}

function removeBuriedTiles(x,y){
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

//just for debugging
function printBoard(){
  for(var i=0; i<16; i+=4){
    console.log(board.slice(i,i+4));
  }
}

function shiftArray(arr){  
  //console.log("Input: "+arr);
  //[0,0,2,0]
  var offset;
  var newPos;
  var tile_val;
  var merged_tiles = [false,false,false,false];
  var tile_updates = [0,0,0,0];
  
  for(var i=arr.length-1; i>=0; i--){
    tile_val = arr[i];
    if(tile_val == 0) continue;
    offset = 1;
    
    while(arr[i+offset] == 0 && i+offset<4){
      offset++;
    }
    
    newPos = i+offset-1;
    
    //merging
    if(tile_val == arr[i+offset] && !merged_tiles[i+offset]){
      //console.log("Looking to merge...");
      tile_val *= 2;
      newPos++;
      merged_tiles[newPos] = true;
    }
    
    arr[newPos] = tile_val;
      
    if(i == newPos) continue; //continue if tile hasn't moved from it's initial position
    
    arr[i] = 0;
    tile_updates[i] = newPos;
  }
  
  //console.log("Output: "+arr);
  for(var i=0; i<4; i++){
    //if(tile_updates[i] !== undefined)
      //console.log(i + " => " + tile_updates[i]);
  }
  
  //console.log("==");
  //console.log(tile_updates);
  return [arr,tile_updates, merged_tiles];
}

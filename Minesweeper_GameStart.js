var gameMap = [];
var maxHeight;
var maxWidth;
var gameRunning = false;
var tilesToReveal = [];

function buildGame(){
    gameMap = [];

    gameRunning = true;
    let width = document.getElementById("boardWidth").value;
    let height = document.getElementById("boardHeight").value;
    let bombs = document.getElementById("boardBombs").value;

    maxHeight = height;
    maxWidth = width;
    createBoard(height, width, bombs);

    renderBoard();
}

function createBoard(height, width, bombs){
    for (let i = 0; i < height; i++){
        let row = [];
        for(let j =0; j < width; j++){
            row.push({isBomb:false, height: i, width: j, value: ""});
        }
        gameMap.push(row);
    }
    addBombs(bombs);
    addBoardValues();
}

function addBombs(bombs){
    while(bombs > 0){
        let randomI = Math.floor(Math.random()*maxHeight);
        let randomJ = Math.floor(Math.random()*maxWidth);

        if(!gameMap[randomI][randomJ].isBomb){
            gameMap[randomI][randomJ].isBomb = true;
            bombs--;
        }
    }
}

function addBoardValues(){
    for (let i = 0; i < gameMap.length; i++){
        for(let j = 0; j < gameMap[0].length; j++){
            let count = checkSurrounding(gameMap[i][j])
            gameMap[i][j].value = count;
            gameMap[i][j].revealed = false;
        }
    }
}

function checkSurrounding(tile){
    let count = 0;
    let skipRight = false;
    let skipLeft = false;
    let skipTop = false;
    let skipBottom = false;

    if(tile.width === 0){
        skipLeft = true;
    }
    if(tile.width == parseInt(maxWidth)-1){
        skipRight = true;
    }
    if(tile.height === 0){
        skipTop = true;
    }
    if(tile.height == parseInt(maxHeight)-1){
        skipBottom = true;
    }

    if(!skipTop){
        if(!skipLeft){
            if(gameMap[tile.height - 1][tile.width - 1].isBomb){
                count++;
            }
        }
        if(!skipRight){
            if(gameMap[tile.height - 1][tile.width + 1].isBomb){
                count++;
            }
        }
        if(gameMap[tile.height - 1][tile.width].isBomb){
            count++;
        }
    }

    if(!skipBottom){
        if(!skipLeft){
            if(gameMap[tile.height + 1][tile.width - 1].isBomb){
                count++;
            }
        }
        if(!skipRight){
            if(gameMap[tile.height + 1][tile.width + 1].isBomb){
                count++;
            }
        }
        if(gameMap[tile.height + 1][tile.width].isBomb){
            count++;
        }
    }

    if(!skipLeft){
        if(gameMap[tile.height][tile.width -1].isBomb){
            count++;
        }
    }
    if(!skipRight){
        if(gameMap[tile.height][tile.width + 1].isBomb){
            count++;
        }
    }
    
    return count;
}


function renderBoard(){
    let gameBoard = document.getElementById("GameBoard");
    gameBoard.innerHTML = "";
    for(let i = 0; i < gameMap.length; i++){
        let rowEl = document.createElement("div");
        rowEl.className="rowBoard";
        for(let j = 0; j < gameMap[0].length; j++){
            let btnEl = addBox(rowEl,gameMap[i][j]);
            gameMap[i][j].el = btnEl;
        }
        gameBoard.appendChild(rowEl);
    }
}

function addBox(parentEl, tile){
    let buttonElem = document.createElement("button");
    buttonElem.type = "button";
    buttonElem.value = tile.value;
    buttonElem.name = tile.isBomb;
    buttonElem.className = "btnBoard";
    parentEl.appendChild(buttonElem);
    buttonElem.addEventListener("click",function(){
        reveal(tile,buttonElem);
    });
    return buttonElem;
};

function addBreak(){
    let br = document.createElement("br");
    let gameBoard = document.getElementById("GameBoard");
    gameBoard.appendChild(br);
};

function reveal(tile, el){
    //change the tile
    revealCell(tile);
    
    //reveal tiles next to it if the value is 0
    if(tile.value == 0 && !tile.isBomb){
        revealOtherTiles(tile);
    }
    //check game status
    if(tile.isBomb){
        endGameFail();
    } 
    if(checkGameState()){
        endGameSuccess();
    }
}

function revealOtherTiles(tile){
    let skipRight = false;
    let skipLeft = false;
    let skipTop = false;
    let skipBottom = false;

    if(tile.width === 0){
        skipLeft = true;
    }
    if(tile.width == parseInt(maxWidth) - 1){
        skipRight = true;
    }
    if(tile.height === 0){
        skipTop = true;
    }
    if(tile.height == parseInt(maxHeight) - 1){
        skipBottom = true;
    }

    let newTile;

    if(!skipTop){
        if(!skipLeft){
            newTile = gameMap[tile.height - 1][tile.width - 1];
            if(!newTile.revealed && newTile.value == 0 && !newTile.isBomb){
                revealCell(newTile);
                tilesToReveal.push(newTile);
            }
            if(!newTile.revealed && !newTile.isBomb){
                revealCell(newTile);
            }
        }
        if(!skipRight){
            newTile = gameMap[tile.height - 1][tile.width + 1];
            if(!newTile.revealed && newTile.value == 0 && !newTile.isBomb){
                revealCell(newTile);
                tilesToReveal.push(newTile);
            }
            if(!newTile.revealed && !newTile.isBomb){
                revealCell(newTile);
            }
        }
        newTile = gameMap[tile.height - 1][tile.width];
        if(!newTile.revealed && newTile.value == 0 && !newTile.isBomb){
            revealCell(newTile);
            tilesToReveal.push(newTile);
        }
        if(!newTile.revealed && !newTile.isBomb){
            revealCell(newTile);
        }
    }

    if(!skipBottom){
        if(!skipLeft){
            newTile = gameMap[tile.height + 1][tile.width - 1];
            if(!newTile.revealed && newTile.value == 0 && !newTile.isBomb){
                revealCell(newTile);
                tilesToReveal.push(newTile);
            }
            if(!newTile.revealed && !newTile.isBomb){
                revealCell(newTile);
            }
        }
        if(!skipRight){
            newTile = gameMap[tile.height + 1][tile.width + 1];
            if(!newTile.revealed && newTile.value == 0 && !newTile.isBomb){
                revealCell(newTile);
                tilesToReveal.push(newTile);
            }
            if(!newTile.revealed && !newTile.isBomb){
                revealCell(newTile);
            }
        }
        newTile = gameMap[tile.height + 1][tile.width];
        if(!newTile.revealed && newTile.value == 0 && !newTile.isBomb){
            revealCell(newTile);
            tilesToReveal.push(newTile);
        }
        if(!newTile.revealed && !newTile.isBomb){
            revealCell(newTile);
        }
    }

    if(!skipLeft){
        newTile = gameMap[tile.height][tile.width - 1];
        if(!newTile.revealed && newTile.value == 0 && !newTile.isBomb){
            revealCell(newTile);
            tilesToReveal.push(newTile);
        }
        if(!newTile.revealed && !newTile.isBomb){
            revealCell(newTile);
        }
    }
    if(!skipRight){
        newTile = gameMap[tile.height][tile.width + 1]
        if(!newTile.revealed && newTile.value == 0 && !newTile.isBomb){
            revealCell(newTile);
            tilesToReveal.push(newTile);
        }
        if(!newTile.revealed && !newTile.isBomb){
            revealCell(newTile);
        }
    }

    if(tilesToReveal.length !== 0){
        revealOtherTiles(tilesToReveal.pop());
    }
}

function endGameFail(){
    alert("Bomb has been found. Game Over");
    revealBombs();
    disabledGame();
}

function revealBombs(){
    for(let i = 0; i < gameMap.length; i++){
        for(let j = 0; j < gameMap[0].length; j++){
            if(gameMap[i][j].isBomb){
                revealCell(gameMap[i][j]);
            }
        }
    }
}

function revealCell(tile){
    tile.revealed = true;
    if(tile.isBomb){
        tile.el.innerHTML = "b";
    } else {
        tile.el.innerHTML = tile.value;
    }
}

function checkGameState(){
    for(let i = 0; i < gameMap.length; i++){
        for(let j = 0; j < gameMap[0].length; j++){
            if(!gameMap[i][j].isBomb && !gameMap[i][j].revealed){
                return false;
            }
        }
    }
    return true;
}

function endGameSuccess(){
    alert("Revealed Map without hitting a bomb! Winner!");
    disabledGame();
}

function disabledGame(){
    gameMap.forEach(function(row){
        row.forEach(function(cell){
            cell.el.disabled = true;
        })
    });
}
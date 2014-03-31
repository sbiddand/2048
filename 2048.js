base_init();

function base_init()
{

	var test = new UnitTest();
	test.testMergeRight();

	var game = new Game();
	game.startGame();    

}

function RandomUtil() 
{
	this.randomInt = function(low,high) {
		//This function returns floating-point numbers from low (inclusive) 
		//up to high (exclusive) ([low, high))
        return Math.floor(Math.random() * (high-low) + low);
	}
}; 

function Game() 
{
	///public methods
	this.startGame = function() {
		var masterGrid = new Grid(); 
    	masterGrid.insertRandom();
    	masterGrid.printGrid();
    	read_input(masterGrid);
	}

    ///private methods
	var read_input = function(masterGrid)
	{
		var keypress = require('keypress');

		// make `process.stdin` begin emitting "keypress" events
		keypress(process.stdin);

		// listen for the "keypress" event
		process.stdin.on('keypress', function (ch, key) {
			//console.log('got "keypress"', key);
			
			if (key && key.ctrl && key.name === 'c') {
				process.stdin.pause();
			}
			else if ( key.name === 'up') {
			    masterGrid.moveUp();   
			}
			else if ( key.name === 'down') {
			    masterGrid.moveDown();
			}
			else if ( key.name === 'left') {
			    masterGrid.moveLeft();
			}
			else if ( key.name === 'right') {
			    masterGrid.moveRight();
			}
			else {
				console.log("Use Arrow Keys to move tiles or CTRL+C to exit.")
			}

			masterGrid.printGrid();
			masterGrid.checkWin();
    		if (masterGrid.checkIsGameOver()) {
    			console.log("Game over! :(")
    			process.stdin.pause();;
    		}

		});

		process.stdin.setRawMode(true);
		process.stdin.resume();
	}
}

function UnitTest() 
{
	///public methods
    this.testMergeRight = function() {
        //false is a failure

	    var testGrid = new Grid();
	    
	    var a,b;

	    a = [0,0,0,0];
	    b = testGrid.mergeRight(a);
        console.log(this.arraysEqual(a,b));
        
        a = [0,0,0,2];
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(a,b));

	    a = [0,0,2,4];
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(a,b));

	    a = [2,4,2,4];
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(a,b));

	    a = [2,0,0,0];
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(b,[0,0,0,2]));

	    a = [0,0,2,2];
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(b,[0,0,0,4]));

	    a = [0,2,0,2];
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(b,[0,0,0,4]));

        a = [2,0,2,0];
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(b,[0,0,0,4]));
        
	    a = [2,0,0,2];
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(b,[0,0,0,4]));

	    a = [2,4,4,2];
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(b,[0,2,8,2]));

	    a = [2048,2048,4,2];
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(b,[0,4096,4,2]));

	    a = [2,2,2,2];
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(b,[0,0,4,4]));

	    a = [2,4294967296,4294967296,2]; 
	    b = testGrid.mergeRight(a);
	    console.log(this.arraysEqual(b,[0,2,8589934592,2]));
	}

	this.arraysEqual = function(a, b) {
		if (a === b) { 
			console.log("warning: passed same reference");
			return true;
		}
		else if (a == null || b == null) { 
			return false;
		}
		else if (a.length != b.length) {
			return false;
		}

		// If you don't care about the order of the elements inside
		// the array, you should sort both arrays here.

		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) { 
				return false;
			}
		}
		return true;
	}
}


var ERROR = -1;

function Grid() 
{
    ///private members
    //4x4 array
    var m_array = [[0,0,0,0],
                   [0,0,0,0],
                   [0,0,0,0],
                   [0,0,0,0]];
   
    var startNumbers = [2,4];
    var wonGame = false;

    //map from number to array index
    //zero indicates free position -- this isn't really necessary
    var m_reverse_map = {0: [[0,0],[0,1],[0,2],[0,3],
    	                     [1,0],[1,1],[1,2],[1,3],
    	                     [2,0],[2,1],[2,2],[2,3], 
    	                     [3,0],[3,1],[3,2],[3,3],]};
    ///end private members

    ///public methods
	this.checkIsGameOver = function() {

    	var freePositions = m_reverse_map[0];
        if (freePositions && freePositions.length > 0) {
            return false;
        }
        //grid has no zeros, look for adjacent cells that match
        for (var i = 0, len_i = m_array.length; i < len_i; i++) {
            for (var j = 0, len_j = m_array.length; j < len_j; j++) {
            
                if (i < m_array.length-1 &&
                	m_array[i][j] == m_array[i+1][j]){
                	return false;
                }
                else if (j < m_array.length-1 &&
                	     m_array[i][j] == m_array[i][j+1]){
                	return false;
                }
            }
        }
        return true;
    }

    this.checkWin = function() {

    	var winningPosition = m_reverse_map[2048];
        if (winningPosition && winningPosition.length === 1 && !wonGame) {
        	wonGame = true;
        	console.log("CONGRATS, YOU WIN!");
        }
    }

    this.insertRandom = function () {
    	//inserts randomly selected element
    	//from startNumbers into empty position 
    	
        var freePositions = m_reverse_map[0];
        if (!freePositions) {
        	console.log("could not insert");
        } 

    	var r = new RandomUtil();
    	var numberToInsert = startNumbers[
    	                         r.randomInt(0,(startNumbers.length))];
     	var positionToInsert = r.randomInt(0,(freePositions.length))
        var positionToInsertX = freePositions[positionToInsert][0];
        var positionToInsertY = freePositions[positionToInsert][1];

        this.setArray(positionToInsertX,positionToInsertY,numberToInsert);
    }

    this.rightJustify = function(list) {
    	
    	var nonZeroList = []; 
        //right justify
        for (var i = 0, len_i = list.length; i < len_i; i++) {
            if (list[i] === 0) {
                continue;
            } else {
                nonZeroList.push(list[i]);
            }
        }
        while(nonZeroList.length < 4) {
        	//prepend zeros
        	nonZeroList.unshift(0);
        }
    	return nonZeroList;
    }

    this.mergeRight = function(list) {
        
        list = this.rightJustify(list);
        
        //combine from right to left
        for (var i = list.length - 1; i > 0; i-=1) {
            if (list[i] === 0) {
                continue;
            } else if (list[i] === list[i-1]) {
            	
            	list[i] += list[i];
                list[i-1] = 0;
            }
        }
        
		list = this.rightJustify(list);
        return list;
    }

  
    this.mergeElementsRight = function(array) {

    	var newArray = [];
        for (var i = 0, len_i = array.length; i < len_i; i++) {

            var list = array[i].slice(0); //make copy
            var newList = this.mergeRight(list);
            newArray.push(newList);
		}
        return newArray;
    }

    this.mergeElementsLeft = function(array) {
    	var newArray = [];
    	for (var i = 0, len_i = array.length; i < len_i; i++) {

            var list = array[i].slice(0); //make copy
            var newList = this.mergeRight(list.reverse());
            newArray.push(newList.reverse());
		}
		return newArray;
    }

    this.copyResult = function(newArray) {
		
		var changed = false;
        for (var i = 0, len_i = m_array.length; i < len_i; i++) {
			for (var j = 0, len_j = m_array.length; j < len_j; j++) {
		        if (m_array[i][j] === newArray[i][j]) {
                    continue;
		        }
		        changed = true;
		        this.setArray(i,j,newArray[i][j]);
            }    		
		}

		//if anything was changed, insertRandom into free spot
        if (changed) {
        	this.insertRandom();
    	}
    }

    this.transpose = function(array) {
        var newArray = [];
		for(var i=0, len_i = array.length; i < len_i; i++) {
			newArray[i] = [];
			for(var j=0, len_j = array.length; j < len_j; j++) {
				newArray[i][j] = array[j][i];
			}
		}
		return newArray;
	}

	this.moveRight = function() {
    	var newArray = this.mergeElementsRight(m_array);
    	this.copyResult(newArray);
    }

    this.moveLeft = function() {
		var newArray = this.mergeElementsLeft(m_array);
        this.copyResult(newArray);	
    }

    this.moveDown = function() {
		var newArray = this.transpose(m_array);
    	newArray = this.mergeElementsRight(newArray);
    	newArray = this.transpose(newArray);
    	this.copyResult(newArray);	
    }

    this.moveUp = function() {
		var newArray = this.transpose(m_array);
    	newArray = this.mergeElementsLeft(newArray);
    	newArray = this.transpose(newArray);
    	this.copyResult(newArray);	
    }
  
    this.setArray = function(positionX, positionY, newValue) {
        
        var old_value = m_array[positionX][positionY];

        var positionList = m_reverse_map[old_value];
        for (var i = 0, i_len = positionList.length; i < i_len; i++) {
            if (positionList[i][0] === positionX &&
            	positionList[i][1] === positionY) {
                positionList.splice(i,1);
                break;
            }
        }
        
        if (!m_reverse_map[newValue]) {
            m_reverse_map[newValue] = [];
        }
        m_reverse_map[newValue].
                 push([positionX,positionY]);

		m_array[positionX][positionY] = newValue;         
    }

    this.printGrid = function(grid) {

        if (!grid) {
            grid = m_array;
        }

    	var stringBuffer = [];
    	for (var i = 0, len_i = grid.length; i < len_i; i++) {
        	stringBuffer.push("[");
        	stringBuffer.push(grid[i][0]);
            for (var j = 1, len_j = grid.length; j < len_j; j++) {
                stringBuffer.push(",");
                stringBuffer.push(grid[i][j]);
            }
            stringBuffer.push("]\n");
        }
        var gridString = stringBuffer.join("");   
        console.log("%s",gridString);
    }
}


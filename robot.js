/*
	*
	*	declare one mars variable on load.
	*
*/

var mars;

/*
	*
	*	create mars based on inputs
	*	for example x = 5 -> 5 columns, y = 3 -> 3 columns
	*	results in a 2D matrix
	*
*/

function Landscape(_columns, _rows) {
	this.rows = parseInt(_rows);
    this.columns = parseInt(_columns);
    this.matrix = [];
    
    for (var i = 0; i <= this.columns; i++) {
    	this.matrix[i] = [];
    	for (var j = 0; j <= this.rows; j++) {
        	this.matrix[i][j] = [];
    	}
	}
}

/*
	*
	*	create a new robot with the new positions and orientations
	*
*/

function Robot(_x, _y, _orientation) {
	this.robotX = parseInt(_x);
	this.robotY = parseInt(_y);
	this.robotOrientation = _orientation;
}

Robot.prototype = {
	constructor: Robot,
	orientation: ["N", "E", "S", "W"],
	commands: [],
	lost: '',

	/*
		*
		*	converts to array
		*
	*/

	process: function(_commands) {
		this.commands = _commands;
		for(i=0; i<this.commands.length; i++) {
			if(!this.lost) {
				this.instruct(this.commands[i]);
			}
		}
		this.render();
	},

	/*
		*
		*	processes the instruction.
		*	further instructions can be added here
		* 	for example 'S' to move back = this.move(-1, this.robotOrientation)
		*
	*/

	instruct: function(command) {
		switch(command) {
			case 'L':
				this.changeOrientation(-1);
				break;
			case 'R':
				this.changeOrientation(+1);
				break;
			case 'F':
				this.move(+1);
				break;
			default:
				alert('You have entered incorrect instructions');
				break;
		}
	},

	/*
		*
		*	returns an index number for the current robot orientation
		*
	*/

	currentOrientationIndex: function() {
		return this.orientation.indexOf(this.robotOrientation);
	},

	/*
		*
		* 	index for N = 0, E = 1, S = 2, W = 3
		*	if robotOrientation is N, turning Left will give -1, and there is no index -1
		*	so we add the length of orientation and then do modulus to get the new index
		*
	*/

	changeOrientation: function(direction) {
		this.robotOrientation = this.orientation[ (this.currentOrientationIndex()+direction + this.orientation.length)%this.orientation.length];
	},

	/*
		*
		*	based on the orientation - the robot moves forward in that direction 
		*	(future can use -1 for backwards, however would need to rework this further)
		*	if the robot position is at the edge of mars then the lostRobot function is called
		*
	*/

	move: function(movement) {
		switch(this.robotOrientation) {
			case 'N':
				this.robotY != mars.rows ? this.robotY += movement : this.lostRobot();
				break;
			case 'E':
				this.robotX != mars.columns ? this.robotX += movement : this.lostRobot();
				break;
			case 'S':
				this.robotY != 0 ? this.robotY -= movement : this.lostRobot();
				break;
			case 'W':
				this.robotX != 0 ? this.robotX -= movement : this.lostRobot();
				break;
		}
	},

	/*
		*
		*	checks to see there is a scent first
		*	if there isn't then the robot is lost and leaves a scent
		*
	*/

	lostRobot: function() {
		if(mars.matrix[this.robotX][this.robotY] !== 'LOST')
		{
			this.lost = 'LOST';
			mars.matrix[this.robotX][this.robotY] = 'LOST';
		}
	},

	/*
		*
		*	render the final position of the robot
		*
	*/

	render: function() {
		document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + 'Output: '+ this.robotX + ' ' + this.robotY + ' ' + this.robotOrientation + ' ' + this.lost + '<br/>';
	}
};



function start() {

	var marsX, marsY, marsInputX, marsInputY, robotX, robotY, robotO, commands, failedCoord;

	/*
		*
		*	checks coordinate input, if it's more than 50
		*	it gives an alert message and makes failedCoord true
		* 	future - check to make sure robot x,y coordinate does not exceed mars x,y
		*	it also stops formation of mars and robot
		*
	*/

	var checkNumber = function(input) {
		if(input > 50){
			failedCoord = true;
			alert('please enter a coordinate less than or equal to 50');
		} else {
			return input;
		}

	}

	marsInputX = document.getElementById("marsCoordX");
	marsInputY = document.getElementById("marsCoordY");
	marsX = checkNumber(marsInputX.value);
	marsY = checkNumber(marsInputY.value);
	robotX = checkNumber(document.getElementById("robotCoordX").value);
	robotY = checkNumber(document.getElementById("robotCoordY").value);
	robotO = document.getElementById("robotOrientation").value.toUpperCase().replace(/\s/g, '');
	commands = document.getElementById("commands").value.toUpperCase().replace(/\s/g, '').split("");

	/*
		*
		*	if the coordinates don't exceed 50 then failedCoord will not be true
		*
	*/

	if(failedCoord !== true) {
		/*
			*
			*	disable the mars size inputs so they don't change when a new robot is created
			*
		*/

		marsInputX.disabled = true;
		marsInputY.disabled = true;
		
		/*
			*
			*	create only one mars
			*
		*/

		if(!mars) {
			mars = new Landscape(marsX, marsY);
		}

		/*
			*
			*	create a new robot
			*
		*/

		var martianRobot = new Robot(robotX, robotY, robotO);

		/*
			*
			*	checks to see if the number of commands (command array length) is not greater than 100
			*
		*/

		if(commands.length < 100) {
			martianRobot.process(commands);
		} else {
			alert('reduce your number of commands to less than 100')
		}
	}	
	
}

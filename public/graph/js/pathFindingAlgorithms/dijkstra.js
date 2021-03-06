// dijkstra algorithm

// importing functions
import { setWallAttribute } from '../wall.js';
import { rowsize, colsize } from '../main.js';
// variables
var container = document.querySelector('.container');
var time;
var initial_speedval = document.querySelector('#speed').value;

// Initializing time value
if (initial_speedval === 'fast') {
	time = 10;
} else if (initial_speedval === 'normal') {
	time = 30;
} else if (initial_speedval === 'sloth') {
	time = 60;
} else {
	time = 1;
}

// Value of time after change
export function speed(event) {
	var speedval = this.value;
	console.log(speedval);
	if (speedval === 'fast') {
		time = 10;
	} else if (initial_speedval === 'noneSpeed') {
		window.alert('choose speed');
	} else if (speedval === 'normal') {
		time = 30;
	} else if (speedval === 'flash') {
		time = 1;
	} else {
		time = 60;
	}
}
// Check and update node
function checkNode(row, col, curr, checker, seen, counter) {
	if (row >= 0 && col >= 0 && row < rowsize && col < colsize) {
		var node = document.querySelector(`div[row="${row}"][col="${col}"]`);
		if(row==rowsize-1 && col==colsize-1){
			checker = [node];
			return false
		}
		let wall = parseInt(node.getAttribute('wall'));
		// console.log(wall);
		if (wall != 1) {
			var cost = Math.min(
				parseInt(curr.getAttribute('cost')) +
					parseInt(node.getAttribute('weight')),
				node.getAttribute('cost')
			);
			if (cost < node.getAttribute('cost')) {
				node.setAttribute(
					'parent',
					curr.getAttribute('row') + '|' + curr.getAttribute('col')
				);
				node.setAttribute('cost', cost);
			}

			changeColor(node, counter, cost);
			changeColor(curr, counter, false);
		}
		if (!seen.includes(node)) {
			checker.push(node);
		}
		seen.push(node);
		return node;
	} else {
		return false;
	}
} // End checkNode

// Animate the nodes
function changeColor(node, counter, cost) {
	setTimeout(() => {
		node.style.backgroundColor = '#00FF00';
		if (cost) {
			node.innerHTML = cost;
		}
	}, counter * time);
	setTimeout(() => {
		node.style.backgroundColor = '#DC143C';
		node.style.color = '#ffffff';
	}, counter * time + 100);
} // End changeColor

export function dijkstra(x1 = 0, y1 = 0, x2 = rowsize - 1, y2 = colsize - 1) {
	console.log(time);
	container.removeEventListener('mousedown', setWallAttribute);
	container.removeEventListener('mouseover', setWallAttribute);
	var startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);
	var endNode = document.querySelector(`div[row='${x2}'][col='${y2}']`);
	// Hide button
	var btn = document.querySelector('.start');
	var refreshBtn = document.querySelector('.refresh');
	btn.style.visibility = 'hidden';
	// refreshBtn.style.visibility = 'hidden';

	// Algo here
	var seen = [startNode];
	var checker = [startNode];
	var counter = 1;
	while (checker.length != 0) {
		checker.sort(function (a, b) {
			if (parseInt(a.getAttribute('cost')) < parseInt(b.getAttribute('cost'))) {
				return 1;
			}
			if (parseInt(a.getAttribute('cost')) > parseInt(b.getAttribute('cost'))) {
				return -1;
			}
			return 0;
		});
		console.log(checker)
		let curr = checker.pop();
		// Important to parse string to integer
		//   console.log(curr);
		let row = parseInt(curr.getAttribute('row'));
		let col = parseInt(curr.getAttribute('col'));
		if(row==x2 && col==y2 ) break;
		let wall = parseInt(curr.getAttribute('wall'));
		if (wall == 1) continue;
		// Check up down left right
		let nextRow = row + 1;
		let prevRow = row - 1;
		let leftCol = col - 1;
		let rightCol = col + 1;
		let a = checkNode(nextRow, col, curr, checker, seen, counter);
		let b = checkNode(prevRow, col, curr, checker, seen, counter);
		let c = checkNode(row, leftCol, curr, checker, seen, counter);
		let d = checkNode(row, rightCol, curr, checker, seen, counter);
		counter++;
	}

	// Draw out best route
	setTimeout(() => {
		startNode.style.backgroundColor = '#26466D';
		startNode.style.color = '#000000';
		startNode.style.color="#ffffff";
		startNode.style.fontWeight="bolder";
		startNode.style.boxShadow = '3px 3px 5px #006400';
		while (endNode.getAttribute('parent') != 'null') {
			endNode.style.backgroundColor = '#00FF00';
			endNode.style.color = '#000000';
			endNode.style.boxShadow = '3px 3px 5px #006400';
			var coor = endNode.getAttribute('parent').split('|');
			var prow = parseInt(coor[0]);
			var pcol = parseInt(coor[1]);
			endNode = document.querySelector(`div[row="${prow}"][col="${pcol}"]`);
		}
		endNode = document.querySelector(`div[row="${x2}"][col="${y2}"]`);
		endNode.style.backgroundColor = '#26466D';
		endNode.style.color="#ffffff";
		endNode.style.fontWeight="bolder";
	}, counter * time + 100);
	// Show refresh button again
	setTimeout(() => {
		refreshBtn.style.visibility = 'visible';
	}, counter * time + 100);
} // End start

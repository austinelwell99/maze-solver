let canvas, ctx, output, noSolution

const WIDTH = 1156
const HEIGHT = 721

const MARGIN = 4

const tileW = 25
const tileH = 25

const tileRowCount = 25
const tileColumnCount = 40

let boundX = 0
let boundY = 0

let startX = 0
let startY = 0

let flagResetProhibitor = false
let startIsMoving = false
let finishIsMoving = false

let arrOfSolutionTiles = []

const themes = [
	{
		title: "default",
		s: "#00AAAA",
		f: "#AA0000",
		e: "#111111",
		w: "#c20071",
		x: "#ff7d0a"
	},
	{
		title: "ocean",
		s: "#FFFFFF",
		f: "#990000",
		e: "#001061",
		w: "#0393c7",
		x: "#999999"
	},
	{
		title: "forest",
		s: "#e3ffd1",
		f: "#961900",
		e: "#361900",
		w: "#2b8f4c",
		x: "#7877bd"
	},
	{
		title: "desert",
		s: "#fff057",
		f: "#731a1a",
		e: "#d9992b",
		w: "#7a7264",
		x: "#683900"
	}
]

let theme = 0

function setTheme(n) {
	reset()
	if (!output.innerHTML) {
		theme = n
		if (n == 0) {
			//default theme
			//removing ocean
			document.getElementById("body").classList.remove("ocean")
			document.getElementById("btn1").classList.remove("ocean")
			document.getElementById("btn2").classList.remove("ocean")
			document.getElementById("drop-button").classList.remove("ocean")
			document.getElementById("heading").classList.remove("ocean")
			document.getElementById("myCanvas").classList.remove("ocean2")
			document.getElementById("solution").classList.remove("ocean3")
			//removing forest
			document.getElementById("body").classList.remove("forest")
			document.getElementById("btn1").classList.remove("forest")
			document.getElementById("btn2").classList.remove("forest")
			document.getElementById("drop-button").classList.remove("forest")
			document.getElementById("heading").classList.remove("forest")
			document.getElementById("myCanvas").classList.remove("forest2")
			document.getElementById("solution").classList.remove("forest3")
			//removing desert
			document.getElementById("body").classList.remove("desert")
			document.getElementById("btn1").classList.remove("desert")
			document.getElementById("btn2").classList.remove("desert")
			document.getElementById("drop-button").classList.remove("desert")
			document.getElementById("heading").classList.remove("desert")
			document.getElementById("myCanvas").classList.remove("desert2")
			document.getElementById("solution").classList.remove("desert3")
		}

		if (n == 1) {
			//ocean theme
			//removing forest
			document.getElementById("body").classList.remove("forest")
			document.getElementById("btn1").classList.remove("forest")
			document.getElementById("btn2").classList.remove("forest")
			document.getElementById("drop-button").classList.remove("forest")
			document.getElementById("heading").classList.remove("forest")
			document.getElementById("myCanvas").classList.remove("forest2")
			document.getElementById("solution").classList.remove("forest3")
			//removing desert
			document.getElementById("body").classList.remove("desert")
			document.getElementById("btn1").classList.remove("desert")
			document.getElementById("btn2").classList.remove("desert")
			document.getElementById("drop-button").classList.remove("desert")
			document.getElementById("heading").classList.remove("desert")
			document.getElementById("myCanvas").classList.remove("desert2")
			document.getElementById("solution").classList.remove("desert3")
			//adding ocean
			document.getElementById("body").classList.add("ocean")
			document.getElementById("btn1").classList.add("ocean")
			document.getElementById("btn2").classList.add("ocean")
			document.getElementById("drop-button").classList.add("ocean")
			document.getElementById("heading").classList.add("ocean")
			document.getElementById("myCanvas").classList.add("ocean2")
			document.getElementById("solution").classList.add("ocean3")
		}
		if (n == 2) {
			//forest theme
			//removing ocean
			document.getElementById("body").classList.remove("ocean")
			document.getElementById("btn1").classList.remove("ocean")
			document.getElementById("btn2").classList.remove("ocean")
			document.getElementById("drop-button").classList.remove("ocean")
			document.getElementById("heading").classList.remove("ocean")
			document.getElementById("myCanvas").classList.remove("ocean2")
			document.getElementById("solution").classList.remove("ocean3")
			//removing desert
			document.getElementById("body").classList.remove("desert")
			document.getElementById("btn1").classList.remove("desert")
			document.getElementById("btn2").classList.remove("desert")
			document.getElementById("drop-button").classList.remove("desert")
			document.getElementById("heading").classList.remove("desert")
			document.getElementById("myCanvas").classList.remove("desert2")
			document.getElementById("solution").classList.remove("desert3")
			//adding forest
			document.getElementById("body").classList.add("forest")
			document.getElementById("btn1").classList.add("forest")
			document.getElementById("btn2").classList.add("forest")
			document.getElementById("drop-button").classList.add("forest")
			document.getElementById("heading").classList.add("forest")
			document.getElementById("myCanvas").classList.add("forest2")
			document.getElementById("solution").classList.add("forest3")
		}
		if (n == 3) {
			//desert theme
			//removing ocean
			document.getElementById("body").classList.remove("ocean")
			document.getElementById("btn1").classList.remove("ocean")
			document.getElementById("btn2").classList.remove("ocean")
			document.getElementById("drop-button").classList.remove("ocean")
			document.getElementById("heading").classList.remove("ocean")
			document.getElementById("myCanvas").classList.remove("ocean2")
			document.getElementById("solution").classList.remove("ocean3")
			//removing forest
			document.getElementById("body").classList.remove("forest")
			document.getElementById("btn1").classList.remove("forest")
			document.getElementById("btn2").classList.remove("forest")
			document.getElementById("drop-button").classList.remove("forest")
			document.getElementById("heading").classList.remove("forest")
			document.getElementById("myCanvas").classList.remove("forest2")
			document.getElementById("solution").classList.remove("forest3")
			//adding forest
			document.getElementById("body").classList.add("desert")
			document.getElementById("btn1").classList.add("desert")
			document.getElementById("btn2").classList.add("desert")
			document.getElementById("drop-button").classList.add("desert")
			document.getElementById("heading").classList.add("desert")
			document.getElementById("myCanvas").classList.add("desert2")
			document.getElementById("solution").classList.add("desert3")
		}
	}
}

//----------------------------------------------------------------------------------------------------------------------

const tiles = [] // parent array
for (let c = 0; c < tileColumnCount; c++) {
	tiles[c] = [] // each column will be a child array inside the tiles parent array
	for (let r = 0; r < tileRowCount; r++) {
		// adds each row in each columns array, making a 2d grid
		tiles[c][r] = {
			x: c * (tileW + MARGIN),
			y: r * (tileH + MARGIN),
			state: "e"
		} // for each specific square (tiles[c][r] the x coordinate is equal to the width plus a buffer of 4, same for the y coordinate, and the state is e for empty
	}
}
tiles[0][0].state = "s" //starting block
tiles[tileColumnCount - 1][tileRowCount - 1].state = "f" //finishing block

function rect(x, y, w, h, state) {
	if (state == "s") ctx.fillStyle = themes[theme].s
	else if (state == "f") ctx.fillStyle = themes[theme].f
	else if (state == "e") ctx.fillStyle = themes[theme].e
	else if (state == "w") ctx.fillStyle = themes[theme].w
	else ctx.fillStyle = themes[theme].e
	ctx.beginPath()
	ctx.rect(x, y, w, h) // rect is a built in html canvas method that draws a rectangle given the x,y,w,h
	ctx.closePath()
	ctx.fill()
}

function draw() {
	if (output.innerHTML != "Solved!") {
		for (c = 0; c < tileColumnCount; c++) {
			for (r = 0; r < tileRowCount; r++) {
				rect(tiles[c][r].x, tiles[c][r].y, tileW, tileH, tiles[c][r].state) // once again looping through all squares, this time drawing them using the rect method, with the args being x,y,w,h. Also including the state property as an arg so that we can fill them accordingly
			}
		}
	}
}

function animateSolution() {
	let totalSquares = arrOfSolutionTiles.length
	let squarePtr = 0

	const myInterval = setInterval(fillSolution, 65)

	function fillSolution() {
		if (squarePtr < totalSquares) {
			flagResetProhibitor = true
			let squareObject = arrOfSolutionTiles[squarePtr]
			ctx.fillStyle = themes[theme].x
			ctx.beginPath()
			ctx.rect(squareObject.x, squareObject.y, tileW, tileH)
			ctx.closePath()
			ctx.fill()
			squarePtr++
		} else {
			clearInterval(myInterval)
			solution.innerHTML = "Solved!"
			flagResetProhibitor = false
		}
	}
}

function clear() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT)
}

function solveMaze() {
	if (!output.innerHTML) {
		let xQ = [startX],
			yQ = [startY],
			pathFound = false

		let xLoc, yLoc

		while (xQ.length > 0 && !pathFound) {
			xLoc = xQ.shift()
			yLoc = yQ.shift()

			if (xLoc > 0) {
				if (tiles[xLoc - 1][yLoc].state == "f") {
					//checks if the tile to the left is the finish tile. Needed if the finish tile can be moved
					pathFound = true
				}
			}
			if (xLoc < tileColumnCount - 1) {
				if (tiles[xLoc + 1][yLoc].state == "f") {
					//checks if the tile to the right is the finish tile
					pathFound = true
				}
			}
			if (yLoc > 0) {
				if (tiles[xLoc][yLoc - 1].state == "f") {
					//checks if the tile above is the finish tile. Needed if the finish tile can be moved
					pathFound = true
				}
			}
			if (yLoc < tileRowCount - 1) {
				if (tiles[xLoc][yLoc + 1].state == "f") {
					//checks if the tile underneath is the finish tile
					pathFound = true
				}
			}
			//    ^^^  tests if finish tile has been reached  ^^^

			//    vvv  tells it to check neighbor tiles  vvv

			if (xLoc > 0) {
				if (tiles[xLoc - 1][yLoc].state == "e") {
					//checks if left tile is empty, if so it pushes both the coordiantes of the empty tile into the queue
					xQ.push(xLoc - 1)
					yQ.push(yLoc)
					tiles[xLoc - 1][yLoc].state = tiles[xLoc][yLoc].state + "l"
					//this last step updates the state of the empty block to include the direction in which it was found. in other words, since the searching algorithm arrived at this tile from the right, it will update it's state to include 'l' for 'left'. This way we can backtrace once a path is found. Easy way to understand it is to pretend that [xLoc][yLoc] is the start. this would be the block to the left,  so it's state would be 'start' plus 'left', basically this is a list of directions back the way the search came.
				}
			}
			if (xLoc < tileColumnCount - 1) {
				if (tiles[xLoc + 1][yLoc].state == "e") {
					xQ.push(xLoc + 1)
					yQ.push(yLoc)
					tiles[xLoc + 1][yLoc].state = tiles[xLoc][yLoc].state + "r"
				}
			}
			if (yLoc > 0) {
				if (tiles[xLoc][yLoc - 1].state == "e") {
					xQ.push(xLoc)
					yQ.push(yLoc - 1)
					tiles[xLoc][yLoc - 1].state = tiles[xLoc][yLoc].state + "u"
				}
			}
			if (yLoc < tileRowCount - 1) {
				if (tiles[xLoc][yLoc + 1].state == "e") {
					xQ.push(xLoc)
					yQ.push(yLoc + 1)
					tiles[xLoc][yLoc + 1].state = tiles[xLoc][yLoc].state + "d"
					//these only change values that have an 'e' state, so tiles already found will not be changed :)
				}
			}
		}
		if (!pathFound) {
			noSolution.innerHTML = "No Solution!"
			output.innerHTML = "No Solution!"
		} else {
			output.innerHTML = "Solved!"
			let path = tiles[xLoc][yLoc].state
			//the xLoc and yLoc now are the coordinates of the finish tile, so their state is a list of directions from the start
			let pathLength = path.length
			let currX = startX //starting at the beginning with these new coordinates (currX and currY)
			let currY = startY
			for (let i = 0; i < pathLength - 1; i++) {
				if (path.charAt(i + 1) == "l") currX -= 1
				if (path.charAt(i + 1) == "r") currX += 1
				if (path.charAt(i + 1) == "d") currY += 1
				if (path.charAt(i + 1) == "u") currY -= 1
				tiles[currX][currY].state = "x"
				arrOfSolutionTiles.push(tiles[currX][currY])
			}
			console.log(arrOfSolutionTiles)
			animateSolution()
		}
	}
}

function reset() {
	if (!flagResetProhibitor) {
		//just copied and pasted the code that sets up the maze
		for (let c = 0; c < tileColumnCount; c++) {
			tiles[c] = []
			for (let r = 0; r < tileRowCount; r++) {
				tiles[c][r] = {
					x: c * (tileW + MARGIN),
					y: r * (tileH + MARGIN),
					state: "e"
				}
			}
		}

		tiles[0][0].state = "s"
		tiles[tileColumnCount - 1][tileRowCount - 1].state = "f"
		clearPrevStart(tiles[0][0])
		clearPrevFinish(tiles[tileColumnCount - 1][tileRowCount - 1])
		startX = 0
		startY = 0

		arrOfSolutionTiles = []
		output.innerHTML = "" //resets output in case there was a message previously
		solution.innerHTML = ""
	}
}

function init() {
	canvas = document.getElementById("myCanvas")
	ctx = canvas.getContext("2d")
	output = document.getElementById("outcome")
	noSolution = document.getElementById("solution")
	return setInterval(draw, 10)
}

function myDown(e) {
	if (!output.innerHTML) {
		x = e.pageX - canvas.offsetLeft
		y = e.pageY - canvas.offsetTop
		canvas.onmousemove = myMove

		for (c = 0; c < tileColumnCount; c++) {
			for (r = 0; r < tileRowCount; r++) {
				if (
					//  VVVVVVVVV is how much we've shifted it over
					c * (tileW + MARGIN) < x && //if x is greater than the left hand side of the box
					x < c * (tileW + MARGIN) + tileW && // and less than the right hand side
					r * (tileH + MARGIN) < y && // and y is greater than the top
					y < r * (tileH + MARGIN) + tileH // and less than the bottom (all this means it's within bounds)
				) {
					if (tiles[c][r].state == "e") {
						tiles[c][r].state = "w"
						boundX = c
						boundY = r
					} else if (tiles[c][r].state == "w") {
						tiles[c][r].state = "e"
						boundX = c
						boundY = r
					} else if (tiles[c][r].state == "s") {
						startIsMoving = true
						boundX = c
						boundY = r
					} else if (tiles[c][r].state == "f") {
						finishIsMoving = true
						boundX = c
						boundY = r
					}
				}
			}
		}
	}
}

function myMove(e) {
	// same as myDown for obvious reasons
	x = e.pageX - canvas.offsetLeft
	y = e.pageY - canvas.offsetTop

	for (c = 0; c < tileColumnCount; c++) {
		for (r = 0; r < tileRowCount; r++) {
			if (
				//  VVVVVVVVV is how much we've shifted it over
				c * (tileW + 4) < x && //if x is greater than the left hand side of the box
				x < c * (tileW + 4) + tileW && // and less than the right hand side
				r * (tileH + 4) < y && // and y is greater than the top
				y < r * (tileH + 4) + tileH // and less than the bottom (all this means it's within bounds)
			) {
				if (startIsMoving == true) {
					if (tiles[c][r].state == "e" && (c != boundX || r != boundY)) {
						tiles[c][r].state = "s"
						startX = c
						startY = r
						clearPrevStart(tiles[c][r])
						boundX = c
						boundY = r
					}
				}
				if (finishIsMoving == true) {
					if (tiles[c][r].state == "e" && (c != boundX || r != boundY)) {
						tiles[c][r].state = "f"
						clearPrevFinish(tiles[c][r])
						boundX = c
						boundY = r
					}
				}
				if (tiles[c][r].state == "e" && (c != boundX || r != boundY)) {
					tiles[c][r].state = "w"
					boundX = c
					boundY = r
				}
			}
		}
	}
}

function clearPrevStart(currTile) {
	for (c = 0; c < tileColumnCount; c++) {
		for (r = 0; r < tileRowCount; r++) {
			if (tiles[c][r] != currTile && tiles[c][r].state == "s") {
				tiles[c][r].state = "e"
			}
		}
	}
}

function clearPrevFinish(currTile) {
	for (c = 0; c < tileColumnCount; c++) {
		for (r = 0; r < tileRowCount; r++) {
			if (tiles[c][r] != currTile && tiles[c][r].state == "f") {
				tiles[c][r].state = "e"
			}
		}
	}
}

function myUp(e) {
	// needed so it won't create walls when moving the mouse normally
	canvas.onmousemove = null
	startIsMoving = false
	finishIsMoving = false
}

init()
canvas.onmousedown = myDown // built into JS, needs to pass in an arg (e) as the event info
canvas.onmouseup = myUp

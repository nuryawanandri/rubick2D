let board = {}
let color = {
  color1: { value: "white", desc: 'white'},
  color2: { value: "red", desc: 'red'},
  color3: { value: "yellow", desc: 'yellow'},
  color4: { value: "orange", desc: 'orange'},
  color5: { value: "green", desc: 'green'},
  color6: { value: "blue", desc: 'blue'},
  color7: { value: "gray", desc: 'gray'},
}
let emptyCell = {x: 4, y: 4}
let answerPattern = {}

initBoard()
renderBoard()

function initBoard () {
  let colorCount = 0
  let selectColor = 1
  let colorTotalMax = 4
  for ( let i = 0; i < 5; i++) {
    for ( let j = 0; j < 5; j++) {
      colorCount++
      board[`cell${j}${i}`] = {
        x: j,
        y: i,
        color: color[`color${selectColor}`]
      }
      if (colorCount >= colorTotalMax) {
        colorCount = 0
        selectColor++
      }
    }
  }
}

function renderBoard () {
  // fungsi dapat disatukan dengan renderAnswer
  let boardElem = document.getElementById('board-rubick')
  boardElem.innerHTML = ''
  
  for ( let i = 0; i < 5; i++) {
    let rowElem = document.createElement('row')
    rowElem.className = 'row'
    for ( let j = 0; j < 5; j++) {
      let cellElem = document.createElement('cell')
      cellElem.className = 'cell'
      cellElem.style.background = board[`cell${j}${i}`].color.value
      rowElem.appendChild(cellElem)
    }
    boardElem.appendChild(rowElem)
  }
}

document.onkeydown = moveCell

function moveCell (event) {
  coorXempty = emptyCell.x
  coorYempty = emptyCell.y

  let emptyCellKey = Object.keys(board).filter((cell) => {
    return board[cell].x == coorXempty && board[cell].y == coorYempty
  })
  if (event.keyCode === 37) { // key left
    if (coorXempty + 1 <= 4) {
      swapColor(coorXempty + 1, coorYempty, emptyCellKey)
    }
  } else if (event.keyCode === 38) { // key up
    if (coorYempty + 1 <= 4) {
      swapColor(coorXempty, coorYempty + 1, emptyCellKey)
    }
  } else if (event.keyCode === 39) { // key right
    if (coorXempty - 1 >= 0) {
      swapColor(coorXempty - 1, coorYempty, emptyCellKey)
    }
  } else if (event.keyCode === 40) { // key down
    if (coorYempty - 1 >= 0) {
      swapColor(coorXempty, coorYempty - 1, emptyCellKey)
    }
  }
  renderBoard()
  if (answerPattern.cell11 !== undefined) {
    checkResult()
  }
}

function swapColor (coorX, coorY, emptyCellKey) {
  let moveAbleCell = Object.keys(board).filter((cell) => {
    return board[cell].x == coorX && board[cell].y == coorY
  })
  let tempCell = Object.assign({}, board[emptyCellKey])
  board[emptyCellKey].color = Object.assign({}, board[moveAbleCell].color)
  board[moveAbleCell].color = Object.assign({}, tempCell.color)

  emptyCell.x = board[moveAbleCell].x
  emptyCell.y = board[moveAbleCell].y
}

function randomAnswer () {
  let pattern = {}
  let cellArr = Object.keys(board).filter((cell) => {
    return board[cell].x !== emptyCell.x || board[cell].y !== emptyCell.y
  })
  for (let i = 1; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      let randomCell = Math.floor(Math.random()*cellArr.length - 1)
      pattern[`cell${j}${i}`] = {
        x: j,
        y: i,
        color: board[cellArr.splice(randomCell, 1)].color
      }
    }
  }
  return pattern
}

function renderAnswer () {
  //fungsi dapat disatukan dengan renderBoard
  answerPattern = randomAnswer()
  let answerElem = document.getElementById('board-answer')
  answerElem.innerHTML = ""
  for (let i = 1; i < 4; i++) {
    let rowElem = document.createElement('div')
    rowElem.className = 'row'
    for (let j = 1; j < 4; j++) {
      let cellElem = document.createElement('cell')
      cellElem.className = 'cell'
      cellElem.style.background = answerPattern[`cell${j}${i}`].color.value
      rowElem.appendChild(cellElem)
    }
    answerElem.appendChild(rowElem)
  }
}

function checkResult () {
  let totalCellTrue = 0
  for (let i = 1; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      let colorValueBoard = board[`cell${j}${i}`].color.value
      let colorValueAnswer = answerPattern[`cell${j}${i}`].color.value
      if (colorValueAnswer === colorValueBoard) {
        totalCellTrue++
      }
    }
  }
  if (totalCellTrue === 9) {
    let messageElem = document.getElementById('message')
    messageElem.textContent = "You Win"
  }
}

function showCheat() {
  let containerCheat = document.getElementById('container-cheat')
  containerCheat.className = 'show'
}

function cheatSwapCell () {
  let sourceInput = document.getElementById('first-tile').value.split(',')
  let destinationInput = document.getElementById('second-tile').value.split(',')

  let firstCell = Object.keys(board).filter((cell) => {
    return board[cell].x === parseInt(sourceInput[0]) && board[cell].y === parseInt(sourceInput[1])
  })

  let secondCell = Object.keys(board).filter((cell) => {
    return board[cell].x === parseInt(destinationInput[0]) && board[cell].y === parseInt(destinationInput[1])
  })

  let tempCell = Object.assign({}, board[firstCell])
  board[firstCell].color = Object.assign({}, board[secondCell].color)
  board[secondCell].color = Object.assign({}, tempCell.color)
  renderBoard()
  if (answerPattern.cell11 !== undefined) {
    checkResult()
  }
}


'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 1,
}

var gGame
var gBoard
var gIsFirstClick

function onInit() {
    gGame = {
        isOn: true,
        showCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }
    gIsFirstClick = true
    resetLives(gLevel.SIZE)

    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    const board = createMat(gLevel.SIZE, gLevel.SIZE)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})"
                            oncontextmenu="onCellMarked(event, this, ${i}, ${j})"
                            data-pos="${i},${j}"></td>`
        }
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] !== MINE) {
                board[i][j].minesAroundCount = countMinesNegs(board, i, j)
            }
        }
    }
}

function countMinesNegs(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}

function onCellClicked(elCell, i, j) {
    const clickedCell = gBoard[i][j]
    if (!gGame.isOn || clickedCell.isShown || clickedCell.isMarked) return
    if (gIsFirstClick) handleFirstClick(i, j)

    handleClickedCell(elCell, clickedCell, i, j)
    if (checkGameOver()) gGame.isOn = false
}

function handleClickedCell(elCell, clickedCell, i, j) {
    if (!clickedCell.isMine) {
        handleSafeClick(elCell, clickedCell, i, j)
    } else {
        handleMineClick(elCell)
    }
    elCell.classList.add('shown')
}

function handleSafeClick(elCell, clickedCell, i, j) {
    clickedCell.isShown = true
    gGame.showCount++
    elCell.innerText = clickedCell.minesAroundCount || ''
    if (clickedCell.minesAroundCount === 0) expandShown(gBoard, i, j)
}

function handleMineClick(elCell) {
    if (gLevel.LIVES > 0) {
        gLevel.LIVES--
        setTimeout(() => {
            elCell.innerText = ''
            elCell.classList.remove('shown')
        }, 1000)
    } else {
        gGame.isOn = false
        revealMines()
    }
    elCell.innerText = MINE
}

function handleFirstClick(rowIdx, colIdx) {
    gIsFirstClick = false
    placeMinesRandomly(gBoard, rowIdx, colIdx)
    setMinesNegsCount(gBoard)
}

function onCellMarked(ev, elCell, i, j) {
    ev.preventDefault()
    const clickedCell = gBoard[i][j]
    if (!gGame.isOn || clickedCell.isShown) return

    handleMarkedCell(elCell, clickedCell)
    if (checkGameOver()) gGame.isOn = false
}

function handleMarkedCell(elCell, clickedCell) {
    clickedCell.isMarked = !clickedCell.isMarked
    gGame.markedCount += clickedCell.isMarked ? 1 : -1
    elCell.innerText = clickedCell.isMarked ? FLAG : ''
}

function checkGameOver() {
    return (
        gGame.showCount === gBoard.length ** 2 - gLevel.MINES &&
        gGame.markedCount === gLevel.MINES
    )
}

function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            const currCell = board[i][j]
            if (currCell.isShown) continue
            if (!currCell.isMine && !currCell.isMarked) {
                currCell.isShown = true
                gGame.showCount++
                renderExpandedCells(currCell, i, j)
                if (!currCell.minesAroundCount) expandShown(board, i, j)
            }
        }
    }
}

function renderExpandedCells(currCell, i, j) {
    const elCell = document.querySelector(`[data-pos="${i},${j}"]`)
    elCell.innerText = currCell.minesAroundCount || ''
    elCell.classList.add('shown')
}

function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine) {
                const elCell = document.querySelector(`[data-pos="${i},${j}"]`)
                elCell.innerText = MINE
                elCell.classList.add('shown')
            }
        }
    }
}

function placeMinesRandomly(board, rowIdx, colIdx) {
    for (var i = 0; i < gLevel.MINES; i++) {
        const randCell = findEmptyCell(board, rowIdx, colIdx)
        board[randCell.i][randCell.j].isMine = true
    }
}

function findEmptyCell(board, rowIdx, colIdx) {
    var emptyCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (!board[i][j].isMine) emptyCells.push({ i, j })
        }
    }
    const randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}

function renderLevels() {
    const levelNames = ['Beginner', 'Medium', 'Expert']
    var strHTML = ''
    for (var i = 0; i < levelNames.length; i++) {
        strHTML += `<button onclick="onSetLevel(${i})">
                        ${levelNames[i]}
                    </button>`
    }
    document.querySelector('.levels').innerHTML = strHTML
}

function onSetLevel(level) {
    const levelConfig = {
        0: { SIZE: 4, MINES: 2, LIVES: 1 },
        1: { SIZE: 8, MINES: 14, LIVES: 3 },
        2: { SIZE: 12, MINES: 32, LIVES: 3 },
    }
    gLevel = levelConfig[level] || levelConfig['0']
    onInit()
}

function resetLives(size) {
    gLevel.LIVES = size === 4 ? 1 : 3
}

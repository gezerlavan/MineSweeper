'use strict'

function createMat(rows, cols) {
    const mat = []

    for (var i = 0; i < rows; i++) {
        mat[i] = []
        for (var j = 0; j < cols; j++) {
            mat[i][j] = ''
        }
    }
    return mat
}

function copyMat(mat) {
    const copiedMat = []
    for (let i = 0; i < mat.length; i++) {
        copiedMat[i] = []
        for (let j = 0; j < mat[0].length; j++) {
            copiedMat[i][j] = { ...mat[i][j] }
        }
    }
    return copiedMat
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function getFormattedDate(date, locale = 'en-IL') {
    return `${new Date(date).toLocaleTimeString(locale)} - 
      ${new Date(date).toLocaleDateString(locale)}`
}

function getFormattedTime(time) {
    return time.toString().padStart(2, '0')
}

const createMap = (rowSize, colSize) => {
    let m = [];
    for(let i = 0; i < rowSize; i++) {
        m[i] = [];
        for(let j = 0; j < colSize; j++) {
            m[i][j] = {
                isChoosen: false,
                move: null,
            }
        }
    }
    return m;
}

const updateBoard = (m, i, j, move) => {
    if(move === 'X') {
        m[i][j].move = 'X';
    }
    else {
        m[i][j].move = 'O';
    }
    return m;
}

const checkWin = (m, i, j, move) => {
    // Check row
    let directions = [
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1]
    ];
    for(let k = 0; k < directions.length; k++) {
        if(checkSequence(m, i, j, move, directions[k])) {
            return true;
        }
    }
    return false;
}

const checkSequence = (m, i, j, move, direction) => {
    let row = i + direction[0];
    let col = j + direction[1];
    let cnt = 1;
    while(1) {
        if(m[row][col].move === move) {
            cnt++;
            if(cnt === 5) {
                return true;
            }
            row += direction[0];
            col += direction[1];
        }
        else break;
    }
    row = i - direction[0];
    col = j - direction[1];
    while(1) {
        if(m[row][col].move === move) {
            cnt++;
            if(cnt === 5) {
                return true;
            }
            row -= direction[0];
            col -= direction[1];
        }
        else break;
    }
    return false;
}

module.exports = {
    createMap: createMap,
    updateBoard: updateBoard,
    checkWin: checkWin
}
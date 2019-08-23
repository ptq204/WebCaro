const changeRoomList = (payload) => {
    return {type: 'CHANGE_ROOM_LIST', payload}
}

const getUserInfo = (payload) => {
    return {type: 'GET_USER_INFO', payload}
}

const markCurrentRoom = (payload) => {
    return {type: 'MARK_CURRENT_ROOM', payload}
}

const markGameStart = (payload) => {
    return {type: 'MARK_GAME_START', payload}
}

const updateBoardState = (payload) => {
    return {type: 'UPDATE_BOARD', payload}
}

const markTurn = (payload) => {
    return {type: 'MARK_TURN', payload}
}

const markTurnNum = (payload) => {
    return {type: 'MARK_TURN_NUM', payload}
}

const markGameEnd = (payload) => {
    return {type: 'MARK_GAME_END', payload}
}

module.exports = {
    changeRoomList: changeRoomList,
    getUserInfo: getUserInfo,
    markCurrentRoom: markCurrentRoom,
    markGameStart: markGameStart,
    updateBoardState: updateBoardState,
    markTurn: markTurn,
    markTurnNum: markTurnNum,
    markGameEnd: markGameEnd
}
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

const markStatus = (payload) => {
    return {type: 'CHANGE_STATUS', payload}
}

const changeLoginUsername = (payload) => {
    return {type: 'CHANGE_LOGIN_USERNAME', payload}
}

const changeLoginPassword = (payload) => {
    return {type: 'CHANGE_LOGIN_PASSWORD', payload}
}

const setLoggedIn = (payload) => {
    return {type: 'SET_LOGGED_IN', payload}
}

const changeRegisterUsername = (payload) => {
    return {type: 'CHANGE_REGISTER_USERNAME', payload}
}

const changeRegisterPassword = (payload) => {
    return {type: 'CHANGE_REGISTER_PASSWORD', payload}
}

const changeInputRoomName = (payload) => {
    return {type: 'CHANGE_INPUT_ROOM_NAME', payload}
}

module.exports = {
    changeRoomList: changeRoomList,
    getUserInfo: getUserInfo,
    markCurrentRoom: markCurrentRoom,
    markGameStart: markGameStart,
    updateBoardState: updateBoardState,
    markTurn: markTurn,
    markTurnNum: markTurnNum,
    markGameEnd: markGameEnd,
    markStatus: markStatus,
    changeLoginUsername: changeLoginUsername,
    changeLoginPassword: changeLoginPassword,
    setLoggedIn: setLoggedIn,
    changeRegisterUsername: changeRegisterUsername,
    changeRegisterPassword: changeRegisterPassword,
    changeInputRoomName: changeInputRoomName
}
const changeRoomList = (payload) => {
    return {type: 'CHANGE_ROOM_LIST', payload}
}

const getUserInfo = (payload) => {
    return {type: 'GET_USER_INFO', payload}
}
module.exports = {
    changeRoomList: changeRoomList,
    getUserInfo: getUserInfo
}
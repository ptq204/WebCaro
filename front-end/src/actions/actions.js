const changeRoomList = (payload) => {
    return {type: 'CHANGE_ROOM_LIST', payload}
}

module.exports = {
    changeRoomList: changeRoomList
}
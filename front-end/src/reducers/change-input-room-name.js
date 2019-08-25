const intialState = {
    roomName: ''
}

const inputRoomNameReducer = (state = intialState, action) => {
    if(action.type === 'CHANGE_INPUT_ROOM_NAME') {
        return Object.assign({}, state, {
            roomName: action.payload
        });
    }
    return state;
}

export default inputRoomNameReducer;
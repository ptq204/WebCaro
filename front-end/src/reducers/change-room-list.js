const initialState = {
    roomList: []
}

const roomListReducer = (state=initialState, action) => {
    if(action.type === 'CHANGE_ROOM_LIST') {
        return Object.assign({}, state, {
            roomList: action.payload
        });
    }
    return state;
}

export default roomListReducer;
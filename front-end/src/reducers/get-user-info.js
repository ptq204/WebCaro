const initialState = {
    user: {
        username: '',
        win: 0,
        loss: 0,
        rank: 0
    }
}

const userReducer = (state = initialState, action) => {
    if(action.type == 'GET_USER_INFO') {
        return Object.assign({}, state, {
            user: action.payload
        });
    }
    return state;
}

export default userReducer;
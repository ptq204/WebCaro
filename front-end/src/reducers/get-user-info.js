const initialState = {
    user: null
}

const userReducer = (state = initialState, action) => {
    if(action == 'GET_USER_INFO') {
        return Object.assign({}, state, {
            user: action.payload
        });
    }
    return state;
}

export default userReducer;
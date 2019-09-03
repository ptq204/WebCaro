const intialState = {
    isLoggedOut: false
}

const logOutReducer = (state = intialState, action) => {
    if(action.type === 'SET_LOGOUT') {
        return Object.assign({}, state, {
            isLoggedOut: action.payload
        });
    }
    return state;
}

export default logOutReducer;
const intialState = {
    username: '',
    password: '',
}

const registerReducer = (state = intialState, action) => {
    if(action.type === 'CHANGE_REGISTER_USERNAME') {
        return Object.assign({}, state, {
            username: action.payload
        });
    }
    else if(action.type === 'CHANGE_REGISTER_PASSWORD') {
        return Object.assign({}, state, {
            password: action.payload
        });
    }
    return state;
}

export default registerReducer;
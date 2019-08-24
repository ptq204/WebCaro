const intialState = {
    username: '',
    password: '',
    isLoggedIn: false
}

const loginReducer = (state = intialState, action) => {
    if(action.type === 'CHANGE_LOGIN_USERNAME') {
        return Object.assign({}, state, {
            username: action.payload
        });
    }
    else if(action.type === 'CHANGE_LOGIN_PASSWORD') {
        return Object.assign({}, state, {
            password: action.payload
        });
    }
    else if(action.type === 'SET_LOGGED_IN') {
        return Object.assign({}, state, {
            isLoggedIn: action.payload
        });
    }
    return state;
}

export default loginReducer;
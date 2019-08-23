import { createMap } from '../algo/algo';

const initialState = {
    roomId: null,
    isGameStarted: false,
    board: null,
    isYourTurn: false,
    currTurn: -1,
    isGameEnd: true
}

const currRoomReducer = (state = initialState, action) => {
    if(action.type === 'MARK_CURRENT_ROOM') {
        return Object.assign({}, state, {
            roomId: action.payload,
            board: createMap(16, 19)
        });
    }
    else if(action.type === 'MARK_GAME_START') {
        return Object.assign({}, state, {
            isGameStarted: true
        });
    }
    else if(action.type === 'UPDATE_BOARD') {
        return Object.assign({} , state, {
            board: action.payload
        });
    }
    else if(action.type === 'MARK_TURN') {
        return Object.assign({} , state, {
            isYourTurn: action.payload
        });
    }
    else if(action.type === 'MARK_TURN_NUM') {
        return Object.assign({} , state, {
            currTurn: action.payload
        });
    }
    else if(action.type === 'MARK_GAME_END') {
        return Object.assign({} , state, {
            isGameEnd: action.payload
        });
    }
    return state;
}

export default currRoomReducer;
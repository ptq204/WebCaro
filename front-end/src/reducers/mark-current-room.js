import { createMap } from '../algo/algo';

const initialState = {
    roomId: null,
    isGameStarted: false,
    creatorName: '',
    creatorRank: 0,
    board: null,
    isYourTurn: false,
    currTurn: -1,
    isGameEnd: false,
    status: 0,
    name: ''
}

const currRoomReducer = (state = initialState, action) => {
    if(action.type === 'MARK_CURRENT_ROOM') {
        return Object.assign({}, state, {
            roomId: action.payload.id,
            board: createMap(16, 22),
            isGameStarted: false,
            creatorRank: action.payload.creatorRank,
            creatorName: action.payload.creatorName,
            isYourTurn: false,
            currTurn: -1,
            isGameEnd: false,
            status: 0,
            name: action.payload.name
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
    else if(action.type === 'CHANGE_STATUS') {
        return Object.assign({} , state, {
            status: action.payload
        });
    }
    return state;
}

export default currRoomReducer;
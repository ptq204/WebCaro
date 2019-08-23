import { combineReducers } from 'redux';
import roomListReducer from './change-room-list';
import userReducer from './get-user-info';
import currRoomReducer from './mark-current-room';

const reducers = combineReducers({
    changeRoomList: roomListReducer,
    getUserInfo: userReducer,
    markCurrentRoom: currRoomReducer
});

export default reducers;
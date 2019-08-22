import { combineReducers } from 'redux';
import roomListReducer from './change-room-list';
import userReducer from './get-user-info';

const reducers = combineReducers({
    changeRoomList: roomListReducer,
    getUserInfo: userReducer
});

export default reducers;
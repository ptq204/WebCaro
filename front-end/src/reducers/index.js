import { combineReducers } from 'redux';
import roomListReducer from './change-room-list';

const reducers = combineReducers({
    changeRoomList: roomListReducer
});

export default reducers;
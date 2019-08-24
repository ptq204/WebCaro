import { combineReducers } from 'redux';
import roomListReducer from './change-room-list';
import userReducer from './get-user-info';
import currRoomReducer from './mark-current-room';
import loginReducer from './change-login';
import registerReducer from './change-register';

const reducers = combineReducers({
    changeRoomList: roomListReducer,
    getUserInfo: userReducer,
    markCurrentRoom: currRoomReducer,
    login: loginReducer,
    register: registerReducer
});

export default reducers;
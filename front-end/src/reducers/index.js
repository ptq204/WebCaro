import { combineReducers } from 'redux';
import roomListReducer from './change-room-list';
import userReducer from './get-user-info';
import currRoomReducer from './mark-current-room';
import loginReducer from './change-login';
import registerReducer from './change-register';
import inputRoomNameReducer from './change-input-room-name';
import rankListReducer from './change-rank-list';
import watchLiveReducer from './mark-watch-live';

const reducers = combineReducers({
    changeRoomList: roomListReducer,
    getUserInfo: userReducer,
    markCurrentRoom: currRoomReducer,
    login: loginReducer,
    register: registerReducer,
    inputRoomName: inputRoomNameReducer,
    ranks: rankListReducer,
    markWatchLive: watchLiveReducer
});

export default reducers;
var initialState = {
    watchLive: false
}

const watchLiveReducer = (state = initialState, action) => {
    if(action.type === 'MARK_WATCH_LIVE') {
        return Object.assign({} , state, {
            watchLive: action.payload
        });
    }
    return state;
}

export default watchLiveReducer;
const initialState = {
    rankList: []
}

const rankListReducer = (state=initialState, action) => {
    if(action.type === 'CHANGE_RANK_LIST') {
        return Object.assign({}, state, {
            rankList: action.payload
        });
    }
    return state;
}

export default rankListReducer;
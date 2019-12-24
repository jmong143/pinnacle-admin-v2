import { ADMIN_LOGIN } from '../../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function(state = initialState, action){
    switch (action.type){
        case ADMIN_LOGIN: 
            return {
                ...state,
                data: action.payload
            }
        default:
            return state;
    }
}
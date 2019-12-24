import { ADMIN_UPLOAD_FILE, ADMIN_GET_FILE } from '../../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function(state = initialState, action){
    switch (action.type){
        case ADMIN_UPLOAD_FILE: 
            return {
                ...state,
                data: action.payload
            }
        case ADMIN_GET_FILE: 
        return {
            ...state,
            image: action.payload
        }
        default:
            return state;
    }
}
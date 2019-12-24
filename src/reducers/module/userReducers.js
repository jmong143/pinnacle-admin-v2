import { FETCH_USERS, NEW_USER, USER_INFO, USER_UPDATE, USER_DELETE } from '../../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_USERS: 
            return {
                ...state,
                lists: action.payload
            }
        case NEW_USER: 
            return {
                ...state,
                list: action.payload
            }
        case USER_INFO: 
            return {
                ...state,
                info: action.payload
            }
        case USER_UPDATE:
            return {
                ...state,
                userUpdate: action.payload
            }
        case USER_DELETE: 
            return {
                ...state,
                delete: action.payload
            }
        default:
            return state;
    }
}
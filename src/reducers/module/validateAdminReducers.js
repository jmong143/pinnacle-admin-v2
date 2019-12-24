import { VALIDATE_ADMIN, VALIDATE_PASSWORD } from '../../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function(state = initialState, action){
    switch (action.type){
        case VALIDATE_ADMIN: 
            return {
                ...state,
                testData: action.payload
            }
        case VALIDATE_PASSWORD: 
            return {
                ...state,
                validatePassword: action.payload
            }
        default:
            return state;
    }
}
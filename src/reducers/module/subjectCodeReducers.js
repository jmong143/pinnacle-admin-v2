import { 
    FETCH_SUBJECT_CODE, 
    NEW_SUBJECT_CODE, 
    SUBJECT_CODE_INFO, 
    SUBJECT_CODE_UPDATE, 
    RESEND_SUBJECT_CODE 
} from '../../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_SUBJECT_CODE: 
            return {
                ...state,
                items: action.payload
            }
        case NEW_SUBJECT_CODE:
            return {
                ...state,
                new: action.payload
        }
        case SUBJECT_CODE_INFO:
            return {
                ...state,
                info: action.payload
            }
        case SUBJECT_CODE_UPDATE:
            return {
                ...state,
                subjectCodeUpdate: action.payload
            }
        case RESEND_SUBJECT_CODE:
            return {
                ...state,
                subjectCodeResend: action.payload
            }
        default:
            return state;
    }
}
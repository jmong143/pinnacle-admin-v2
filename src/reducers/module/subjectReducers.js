import { FETCH_SUBJECTS, NEW_SUBJECT, SUBJECT_INFO, SUBJECT_UPDATE, SUBJECT_DELETE } from '../../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_SUBJECTS: 
            return {
                ...state,
                items: action.payload
            }
        case NEW_SUBJECT:
            return {
                ...state,
                subject: action.payload
            }
        case SUBJECT_INFO:
            return {
                ...state,
                subjectInfo: action.payload
            }
        case SUBJECT_UPDATE:
            return {
                ...state,
                subjectUpdate: action.payload
            }
        case SUBJECT_DELETE:
            return {
                ...state,
                subjectDelete: action.payload
            }
        default:
            return state;
    }
}
import { FETCH_QUESTIONS, CREATE_QUESTION, QUESTION_INFO, QUESTION_UPDATE, QUESTIONS_DELETE } from '../../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_QUESTIONS: 
            return {
                ...state,
                items: action.payload
            }
        case CREATE_QUESTION:
            return {
                ...state,
                question: action.payload
        }
        case QUESTION_INFO:
            return {
                ...state,
                info: action.payload
            }
        case QUESTION_UPDATE:
            return {
                ...state,
                questionUpdate: action.payload
            }
        case QUESTIONS_DELETE:
            return {
                ...state,
                questionDelete: action.payload
            }
        default:
            return state;
    }
}
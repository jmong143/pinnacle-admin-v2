import { FETCH_LESSONS, NEW_LESSON, LESSON_INFO, LESSON_UPDATE, LESSON_DELETE } from '../../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_LESSONS: 
            return {
                ...state,
                items: action.payload
            }
        case NEW_LESSON:
            return {
                ...state,
                lesson: action.payload
        }
        case LESSON_INFO:
            return {
                ...state,
                info: action.payload
            }
        case LESSON_UPDATE:
            return {
                ...state,
                lessonUpdate: action.payload
            }
        case LESSON_DELETE:
            return {
                ...state,
                lessonDelete: action.payload
            }
        default:
            return state;
    }
}
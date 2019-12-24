import { FETCH_MOCK, MOCK_INFO, NEW_MOCK_EXAM } from '../../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_MOCK: 
            return {
                ...state,
                items: action.payload
            }
        case NEW_MOCK_EXAM:
            return {
                ...state,
                list: action.payload
        }
        case MOCK_INFO:
            return {
                ...state,
                info: action.payload
            }
        // case LESSON_UPDATE:
        //     return {
        //         ...state,
        //         lessonUpdate: action.payload
        //     }
        // case LESSON_DELETE:
        //     return {
        //         ...state,
        //         lessonDelete: action.payload
        //     }
        default:
            return state;
    }
}
import { FETCH_TOPICS, NEW_TOPIC, TOPIC_UPDATE, TOPIC_DELETE } from '../../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_TOPICS: 
            return {
                ...state,
                items: action.payload
            }
        case NEW_TOPIC:
            return {
                ...state,
                item: action.payload
            }
        case TOPIC_UPDATE:
            return {
                ...state,
                topicUpdate: action.payload
            }
        case TOPIC_DELETE:
            return {
                ...state,
                topicDelete: action.payload
            }
        default:
            return state;
    }
}
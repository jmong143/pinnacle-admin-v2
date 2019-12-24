import { FETCH_NEWS, NEWS_INFO, NEW_NEWS, NEWS_UPDATE, NEWS_DELETE } from '../../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_NEWS: 
            return {
                ...state,
                lists: action.payload
            }
        case NEWS_INFO: {
            return {
                ...state,
                list:  action.payload
            }
        }
        case NEW_NEWS: {
            return {
                ...state,
                addedNews:  action.payload
            }
        }
        case NEWS_UPDATE:{
            return {
                ...state,
                newsUpdate:  action.payload
            }
        }
        case NEWS_DELETE:{
            return {
                ...state,
                newsDelete:  action.payload
            }
        }

        default:
            return state;
    }
}
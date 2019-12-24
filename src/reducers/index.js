import { combineReducers } from 'redux';
import postReducers from './module/postReducers';
import loginReducers from './module/loginReducers';
import validateAdminReducers from './module/validateAdminReducers';
import subjectReducers from './module/subjectReducers';
import uploadFileReducers from './module/uploadFileReducers';
import userReducers from './module/userReducers';
import newsReducers from './module/newsReducers';
import topicReducers from './module/topicReducers';
import questionsReducers from './module/questionsReducers';
import lessonReducers from './module/lessonReducers';
import mockReducers from './module/mockReducers';
import subjectCodeReducers from './module/subjectCodeReducers';


export default combineReducers({
    login: loginReducers,
    posts: postReducers,
    validateToken:  validateAdminReducers,
    subjects: subjectReducers,
    file: uploadFileReducers,
    users: userReducers,
    news: newsReducers,
    topics: topicReducers,
    questions: questionsReducers,
    lessons: lessonReducers,
    mock: mockReducers,
    subjectCode: subjectCodeReducers
})
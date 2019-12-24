import axios from 'axios';
import { FETCH_MOCK, MOCK_INFO, NEW_MOCK_EXAM } from '../types';
import { receiveData } from '../payload'
import { BasePath, headerNonUser } from '../env';
import lesson from '../../components/lesson';

export function fetchMock(){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/mock`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(FETCH_MOCK, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(FETCH_MOCK, error))
        })
    }
}

export function fetchMockInfo(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/mock/subjects/${id}/generate`, headerAdminUser)
        .then((response) => {
            console.log(response)
            return dispatch(receiveData(MOCK_INFO, response.data))
        })
        .catch(function (error) {
            console.log(error)
            return dispatch(receiveData(MOCK_INFO, error))
        })
    }
}


export function newMockExam(formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.post(`${BasePath}/mock`, formData, headerAdminUser)
        .then((response) => {
            // console.log(response)
            return dispatch(receiveData(NEW_MOCK_EXAM, response.data))
        })
        .catch(function (error) {
            // console.log(error.response.data)
            return dispatch(receiveData(NEW_MOCK_EXAM, error.response.data))
        })
    }
}

// export function updateLesson(topicId, lessonId, formData){
//     return function(dispatch){
//         let headerAdminUser = {
//             headers: {
//                 'x-client-id': 'Jeyk',
//                 'x-client-secret': 'Qwe12345',
//                 'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
//             }
//         }
//         return axios.put(`${BasePath}/topics/${topicId}/lessons/${lessonId}`, formData, headerAdminUser)
//         .then((response) => {
//             return dispatch(receiveData(LESSON_UPDATE, response.data))
//         })
//         .catch(function (error) {
//             return dispatch(receiveData(LESSON_UPDATE, error))
//         })
//     }
// }

// export function deleteLesson(topicId, lessonId){
//     return function(dispatch){
//         let headerAdminUser = {
//             headers: {
//                 'x-client-id': 'Jeyk',
//                 'x-client-secret': 'Qwe12345',
//                 'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
//             }
//         }
//         return axios.delete(`${BasePath}/topics/${topicId}/lessons/${lessonId}`, headerAdminUser)
//         .then((response) => {
//             return dispatch(receiveData(LESSON_DELETE, response.data))
//         })
//         .catch(function (error) {
//             return dispatch(receiveData(LESSON_DELETE, error))
//         })
//     }
// }
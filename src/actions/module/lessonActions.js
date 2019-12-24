import axios from 'axios';
import { FETCH_LESSONS, LESSON_INFO, NEW_LESSON, LESSON_UPDATE, LESSON_DELETE } from '../types';
import { receiveData } from '../payload'
import { BasePath, headerNonUser } from '../env';
import lesson from '../../components/lesson';

export function fetchLesson(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/topics/${id}/lessons`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(FETCH_LESSONS, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(FETCH_LESSONS, error))
        })
    }
}

export function fetchLessonInfo(topicId, lessonId){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/topics/${topicId}/lessons/${lessonId}`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(LESSON_INFO, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(LESSON_INFO, error))
        })
    }
}


export function newLesson(id, formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.post(`${BasePath}/topics/${id}/lessons`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(NEW_LESSON, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(NEW_LESSON, error))
        })
    }
}

export function updateLesson(topicId, lessonId, formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.put(`${BasePath}/topics/${topicId}/lessons/${lessonId}`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(LESSON_UPDATE, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(LESSON_UPDATE, error))
        })
    }
}

export function deleteLesson(topicId, lessonId){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.delete(`${BasePath}/topics/${topicId}/lessons/${lessonId}`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(LESSON_DELETE, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(LESSON_DELETE, error))
        })
    }
}
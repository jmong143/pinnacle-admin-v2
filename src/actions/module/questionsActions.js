import axios from 'axios';
import { FETCH_QUESTIONS, CREATE_QUESTION, QUESTION_INFO, QUESTION_UPDATE, QUESTIONS_DELETE } from '../types';
import { receiveData } from '../payload'
import { BasePath, headerNonUser } from '../env';

export function fetchQuestions(subjectId, topicId){
    var url;
    if(topicId === ""){
        url = `${BasePath}/questions?subjectId=${subjectId}`
    }else{
        url = `${BasePath}/questions?topicId=${topicId}&subjectId=${subjectId}`
    }
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(url, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(FETCH_QUESTIONS, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(FETCH_QUESTIONS, error))
        })
    }
}

export function newQuestion(formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.post(`${BasePath}/questions`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(CREATE_QUESTION, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(CREATE_QUESTION, error))
        })
    }
}


export function fetchQuestionInfo(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/questions/${id}`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(QUESTION_INFO, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(QUESTION_INFO, error))
        })
    }
}

export function updateQuestion(id, formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.put(`${BasePath}/questions/${id}`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(QUESTION_UPDATE, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(QUESTION_UPDATE, error))
        })
    }
}

export function deleteQuestion(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.delete(`${BasePath}/questions/${id}`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(QUESTIONS_DELETE, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(QUESTIONS_DELETE, error))
        })
    }
}

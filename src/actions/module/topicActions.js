import axios from 'axios';
import { FETCH_TOPICS, NEW_TOPIC, TOPIC_UPDATE, TOPIC_DELETE } from '../types';
import { receiveData } from '../payload'
import { BasePath, headerNonUser } from '../env';

export function fetchTopic(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/subjects/${id}/topics`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(FETCH_TOPICS, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(FETCH_TOPICS, error))
        })
    }
}


export function newTopic(id, formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.post(`${BasePath}/subjects/${id}/topics`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(NEW_TOPIC, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(NEW_TOPIC, error))
        })
    }
}

export function updateTopic(subjectId, topicId, formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.put(`${BasePath}/subjects/${subjectId}/topics/${topicId}`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(TOPIC_UPDATE, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(TOPIC_UPDATE, error))
        })
    }
}

export function deleteTopic(subjectId, topicId){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.delete(`${BasePath}/subjects/${subjectId}/topics/${topicId}`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(TOPIC_DELETE, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(TOPIC_DELETE, error))
        })
    }
}
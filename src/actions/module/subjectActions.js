import axios from 'axios';
import { FETCH_SUBJECTS, NEW_SUBJECT, SUBJECT_INFO, SUBJECT_UPDATE, SUBJECT_DELETE } from '../types';
import { receiveData } from '../payload'
import { BasePath, headerNonUser } from '../env';

export function fetchSubjects(){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/subjects`, headerAdminUser)
        .then((response) => {
            if(response.data.result == "success"){
                return dispatch(receiveData(FETCH_SUBJECTS, response.data))
            }else if(response.data.result == "failed"){
                return dispatch(receiveData(FETCH_SUBJECTS, response.data))
            }
        })
        .catch(function (error) {
            console.log(error)
            return dispatch(receiveData(FETCH_SUBJECTS, error))
        })
    }
}

export function newSubject(formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.post(`${BasePath}/subjects`, formData, headerAdminUser)
        .then((response) => {
            if(response.data.result == "success"){
                return dispatch(receivePostsData(response.data))
            }else if(response.data.result == "failed"){
                return dispatch(receivePostsData(response.data))
            }
        })
        .catch(function (error) {
            return dispatch(receivePostsData(error))
        })
    }
}

export function subjectInfo(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/subjects/${id}`, headerAdminUser)
        .then((response) => {
            if(response.data.result == "success"){
                return dispatch(receiveData(SUBJECT_INFO, response.data))
            }else if(response.data.result == "failed"){
                return dispatch(receiveData(SUBJECT_INFO, response.data))
            }
        })
        .catch(function (error) {
            return dispatch(receiveData(SUBJECT_INFO, error))
        })
    }
}


export function subjectUpdate(state, id, formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.put(`${BasePath}/subjects/${id}`, formData, headerAdminUser)
        .then((response) => {
            if(response.data){
                if(response.data.result == "success"){
                    return dispatch(receiveData(SUBJECT_UPDATE, response.data))
                }else if(response.data.result == "failed"){
                    return dispatch(receiveData(SUBJECT_UPDATE, response.data))
                }
            }
        })
        .catch(function (error) {
            return dispatch(receiveData(SUBJECT_UPDATE, error))
        })
    }
}

export function subjectDelete(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.delete(`${BasePath}/subjects/${id}`, headerAdminUser)
        .then((response) => {
            if(response.data){
                if(response.data.result == "success"){
                    return dispatch(receiveData(SUBJECT_DELETE, response.data))
                }else if(response.data.result == "failed"){
                    return dispatch(receiveData(SUBJECT_DELETE, response.data))
                }
            }
        })
        .catch(function (error) {
            return dispatch(receiveData(SUBJECT_DELETE, error))
        })
    }
}

export const receivePostsData = data => ({
  type: NEW_SUBJECT,
  payload: data
})

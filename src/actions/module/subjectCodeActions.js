

import axios from 'axios';
import { FETCH_SUBJECT_CODE, NEW_SUBJECT_CODE, SUBJECT_CODE_INFO, SUBJECT_CODE_UPDATE, RESEND_SUBJECT_CODE } from '../types';
import { receiveData } from '../payload'
import { BasePath, headerNonUser } from '../env';
import lesson from '../../components/lesson';

export function fetchSubjectCode(){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/admin/subjects/codes`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(FETCH_SUBJECT_CODE, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(FETCH_SUBJECT_CODE, error))
        })
    }
}

export function fetchSubjectCodeInfo(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/admin/subjects/codes/${id}`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(SUBJECT_CODE_INFO, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(SUBJECT_CODE_INFO, error))
        })
    }
}


export function newSubjectCode(formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.post(`${BasePath}/admin/subjects/codes/generate`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(NEW_SUBJECT_CODE, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(NEW_SUBJECT_CODE, error))
        })
    }
}

export function updateSubjectCode(id, formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.put(`${BasePath}/admin/subjects/codes/${id}`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(SUBJECT_CODE_UPDATE, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(SUBJECT_CODE_UPDATE, error))
        })
    }
}

export function resendSubjectCode(formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.post(`${BasePath}/admin/subjects/codes/mail/resend`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(RESEND_SUBJECT_CODE, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(RESEND_SUBJECT_CODE, error))
        })
    }
}
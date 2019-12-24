import axios from 'axios';
import { FETCH_NEWS, NEWS_INFO, NEW_NEWS, NEWS_UPDATE, NEWS_DELETE } from '../types';
import { receiveData } from '../payload'
import { BasePath, headerNonUser } from '../env';

export function fetchNews(){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/news?pageItems=10000`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(FETCH_NEWS, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(FETCH_NEWS, error))
        })
    }
}

export function newNews(formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.post(`${BasePath}/news`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(NEW_NEWS, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(NEW_NEWS, error))
        })
    }
}

export function newsInfo(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/news/${id}`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(NEWS_INFO, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(NEWS_INFO, error))
        })
    }
}


export function newsUpdate(state, id, formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.put(`${BasePath}/news/${id}`, formData, headerAdminUser)
        .then((response) => {
            if(response.data){
                return dispatch(receiveData(NEWS_UPDATE, response.data))
            }
        })
        .catch(function (error) {
            return dispatch(receiveData(NEWS_UPDATE, error))
        })
    }
}

export function newsDelete(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.delete(`${BasePath}/news/${id}`, headerAdminUser)
        .then((response) => {
            if(response.data){
                return dispatch(receiveData(NEWS_DELETE, response.data))
            }
        })
        .catch(function (error) {
            return dispatch(receiveData(NEWS_DELETE, error))
        })
    }
}

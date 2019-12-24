import axios from 'axios';
import { FETCH_USERS, NEW_USER, USER_INFO, USER_DELETE, USER_UPDATE } from '../types';
import { receiveData } from '../payload'
import { BasePath, headerNonUser } from '../env';

export function fetchUsers(){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/users?pageItems=1000`, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(FETCH_USERS, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(FETCH_USERS, error))
        })
    }
}

export function newUser(formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.post(`${BasePath}/auth/admin/register`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(NEW_USER, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(NEW_USER, error))
        })
    }
}

export function userInfo(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/users/${id}`, headerAdminUser)
        .then((response) => {
            console.log(response.data)
            return dispatch(receiveData(USER_INFO, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(USER_INFO, error))
        })
    }
}

export function userUpdate(id, formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.put(`${BasePath}/users/${id}`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(USER_UPDATE, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(USER_UPDATE, error))
        })
    }
}

export function userDelete(id){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.delete(`${BasePath}/users/${id}`, headerAdminUser)
        .then((response) => {
            if(response.data){
                return dispatch(receiveData(USER_DELETE, response.data))
            }
        })
        .catch(function (error) {
            return dispatch(receiveData(USER_DELETE, error))
        })
    }
}

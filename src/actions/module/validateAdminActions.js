import axios from 'axios';
import { VALIDATE_ADMIN, VALIDATE_PASSWORD } from '../types';
import { receiveData } from '../payload'
import { BasePath, headerNonUser } from '../env';

export function validateToken(){

    return function(dispatch){

        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.get(`${BasePath}/auth/admin/sessions/validate`, headerAdminUser)
        .then((response) => {
            if(response.data){
                let auth = response.data.auth;
                let message = response.data.message;
                let status = response.status
                return dispatch(receiveData(VALIDATE_ADMIN, {status, auth, message}))
                // dispatch({type: VALIDATE_ADMIN, payload: auth})
            }
        })
        .catch(function (error) {
            return dispatch(receiveData(VALIDATE_ADMIN, error))
        })
    }
}


export function validatePassword(formData){
    return function(dispatch){
        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
            }
        }
        return axios.post(`${BasePath}/auth/admin/password/validate`, formData, headerAdminUser)
        .then((response) => {
            return dispatch(receiveData(VALIDATE_PASSWORD, response.data))
        })
        .catch(function (error) {
            return dispatch(receiveData(VALIDATE_PASSWORD, error))
        })
    }
}
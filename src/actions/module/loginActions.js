import axios from 'axios';
import { ADMIN_LOGIN } from '../types';
import { receiveData } from '../payload'
import { BasePath, headerNonUser, headerAdminUser } from '../env';

export function loginPost(postData){
    
    return function(dispatch){
        return axios.post(`${BasePath}/auth/admin/login`, postData, headerNonUser)
        .then((response) => {
            if(response.data){
                let token = response.data.token
                let expiresIn = response.data.expiresIn
                let user = response.data.user
                let status = response.status
                dispatch(receiveData(ADMIN_LOGIN, {token, expiresIn, user, status}))
            }
            
        })
        .catch(function (error) {
            // if (error.response) {
            //     console.log(error.response.data);
            //     console.log(error.response.status);
            //     console.log(error.response.headers);
            // }
            let message = error.response.data.message;
            let status = error.response.status;
            dispatch(receiveData(ADMIN_LOGIN, {message, status}))
        })
    }
}




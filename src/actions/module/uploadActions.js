import axios from 'axios';
import { ADMIN_UPLOAD_FILE, ADMIN_GET_FILE } from '../types';
import { receiveData } from '../payload'
import { BasePath, headerNonUser } from '../env';

export function uploadFile(fileData){

    return function(dispatch){

        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'content-type': 'multipart/form-data',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
                // Access-Control-Allow-Origin
            }
        }
        const formData = new FormData();
        formData.append('file',fileData)
        return axios.post(`${BasePath}/uploads?type=subjects`, formData, headerAdminUser)
        .then((response) => {
            if(response.data){
                let filename = response.data.filename;
                let mimetype = response.data.mimetype;
                // return dispatch(receiveData(ADMIN_UPLOAD_FILE, response.data))
                return dispatch(receivePostsData(response.data))
                // dispatch({type: VALIDATE_ADMIN, payload: auth})
            }
        })
        .catch(function (error) {
            console.log("ERROR UPLOAD==> " + error)
            let message = error.response.data.message;
            let status = error.response.status;
            return dispatch(receiveData(ADMIN_UPLOAD_FILE, {message, status}))
        })
    }
}



export function getFile(fileName){
    console.log(fileName)
    return function(dispatch){

        let headerAdminUser = {
            headers: {
                'x-client-id': 'Jeyk',
                'x-client-secret': 'Qwe12345',
                'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token,
                'Accept': 'image/jpeg',
                'Content-Type': 'image/png'
            }
        }
        return axios.get(`${BasePath}/uploads/${fileName}`, {responseType: 'blob', headers: {
            'x-client-id': 'Jeyk',
            'x-client-secret': 'Qwe12345',
            'token': JSON.parse(localStorage.getItem("pinnacleAdmin")).token
        }})
        .then((response) => {
            if(response.data){
                var reader = new window.FileReader();
                reader.readAsDataURL(response.data);
                reader.onload = function() {
                    var imageDataUrl = reader.result;
                    return dispatch(receiveData(ADMIN_GET_FILE, imageDataUrl))
                }
            }
        })
        .catch(function (error) {
            return dispatch(receiveData(ADMIN_GET_FILE, error))
        })
    }
}


export const receivePostsData = posts => ({
  type: ADMIN_UPLOAD_FILE,
  payload: posts
})

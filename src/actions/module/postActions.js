import axios from 'axios';
import { FETCH_POSTS, NEW_POSTS } from '../types';

export function fetchPosts() {
    return function(dispatch){
        return axios.get('https://jsonplaceholder.typicode.com/posts')
        .then((response) => dispatch(receivePostsData(response.data)))
        .catch(function (error) {
            console.log(error);
        })
    }
}

export function createPost(postData){
    return function(dispatch){
        return axios.post('https://jsonplaceholder.typicode.com/posts', postData)
        .then((response) => dispatch(receivePostData(response.data)))
        .catch(function (error) {
            console.log(error);
        })
    }
}

export function loginPost(postData){
    let config = {
        headers: {
            'x-client-id': 'Jeyk',
            'x-client-secret': 'Qwe12345'
        }
      }
    return function(dispatch){
        return axios.post('https://pinnacle-backend-v1.herokuapp.com/auth/admin/login', postData, config)
        .then((response) => dispatch(receivePostData(response.data)))
        .catch(function (error) {
            console.log(error);
        })
    }
}

export const receivePostsData = posts => ({
  type: FETCH_POSTS,
  payload: posts
})

export const receivePostData = post => ({
  type: NEW_POSTS,
  payload: post
})

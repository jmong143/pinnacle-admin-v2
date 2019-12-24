import React from 'react';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware} from 'redux';

import Posts from './components/Posts';
import PostForm from './components/Postform';

import MainContent from '../src/components/main-content';


function App() {
  return (
    <div>
        <PostForm/>
        <Posts/>
        <hr/>
    </div>
  );
}

export default App;

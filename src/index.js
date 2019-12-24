import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import App from './App';
import DashboardComponent from './components/dashboard';
import LoginComponent from './components/login';
import TopicComponent from './components/topic';
import SubjectComponent from './components/subject';
import LessonComponent from './components/lesson';
import UsersComponent from './components/users';
import SubjectCodeComponent from './components/subject-code';
import NewsComponent from './components/news';
import QuestionsComponent from './components/question';
import MockExamComponent from './components/mock-exam';
import PageNotFoundComponent from './components/__pages/404';

import * as serviceWorker from './serviceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


import store from './store';
const routing = (
    <Router>
      <div>
        <Provider store={store}>
            <Route exact path="/" exact component={DashboardComponent} />
            <Route exact path="/login" component={LoginComponent} />
            <Route exact path="/topic" component={TopicComponent} />
            <Route exact path="/subjects" component={SubjectComponent} />
            <Route exact path="/subject-code" component={SubjectCodeComponent} />
            <Route exact path="/lessons" component={LessonComponent} />
            <Route exact path="/users" component={UsersComponent} />
            <Route exact path="/questions" component={QuestionsComponent} />
            <Route exact path="/news" component={NewsComponent} />
            <Route exact path="/mock" component={MockExamComponent} />
            {/* <Route component={PageNotFoundComponent} /> */}

            
            
        </Provider>
        
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'))

serviceWorker.unregister();

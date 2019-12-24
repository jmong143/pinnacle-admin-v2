import React, { Component } from 'react'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faChevronDown, faHome, faBook, faCalendarCheck, faClipboardList, faListAlt, faMoneyCheck, faCommentAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import SubjectComponent from '../subject';
import cx from "classnames";
import { CSSTransition } from "react-transition-group";
import './styles/index.css';
import './styles/sidebar.css';

export default class SideNavComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "showList": false,
            "highlightedHobby": false
        };
        this.clickDropdown = this.clickDropdown.bind(this);
    }

    switch = () => {
        this.setState(prevState => ({
          showList: !prevState.showList
        }));
      };
    
    listSwitch = () => {
        this.setState(state => ({
            highlightedHobby: !state.highlightedHobby
        }));
    };

    render() {
        return (
            <div class="sidenav">
                <Link to = "/" className = "sidenav-brand"><img src="../../img/logo.png" className = "logo" id="icon" alt="User Icon" /></Link>
                <Link to = "/" className = "sidenav-link"><FontAwesomeIcon icon = {faHome}/> Dashboard</Link>
                <Link to = "/users" className = "sidenav-link"><FontAwesomeIcon icon = {faUser}/> Users</Link>
                <button class="dropdown-btn sidenav-link" onClick={this.switch}> 
                    <FontAwesomeIcon icon = {faBook}/> Subject <FontAwesomeIcon icon = {faChevronDown} className = "float-right"/> 
                </button>
                        <CSSTransition
                        in={this.state.showList}
                        timeout={400}
                        classNames="list-transition"
                        unmountOnExit
                        appear
                        onEntered={this.listSwitch}
                        onExit={this.listSwitch}
                        >
                        <div className="list-body">
                            <ul className="list">
                                <li className="list-item"> <Link to="/subjects" className = ""> List</Link></li>
                                <li className="list-item"> <Link to="/subject-code" className = ""> Code</Link></li>
                            </ul>
                        </div>
                        </CSSTransition>
                <Link to="/topic" className = "sidenav-link"> <FontAwesomeIcon icon = {faClipboardList}/> Topics</Link>
                <Link to="/lessons" className = "sidenav-link"> <FontAwesomeIcon icon = {faClipboardList}/> Lessons</Link>
                <Link to="/questions" className = "sidenav-link"> <FontAwesomeIcon icon = {faCommentAlt}/> Questions</Link>
                <Link to="/news" className = "sidenav-link"> <FontAwesomeIcon icon = {faCalendarCheck}/> News</Link>
                <Link to="/mock" className = "sidenav-link"> <FontAwesomeIcon icon = {faMoneyCheck}/> Mock Exam</Link>
            </div>
        )
    }

    clickDropdown(){
        var dropdownContent =  this.refs.testRef;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    }
}

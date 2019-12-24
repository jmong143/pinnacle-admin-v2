import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';
import NavbarComponent   from '../__layout/Navbar';
import SideNavComponent   from '../__layout/SideNav';
import { validateToken } from '../../actions/module/validateAdminActions';
import { fetchSubjects } from '../../actions/module/subjectActions';
import { fetchQuestions } from '../../actions/module/questionsActions';
import { fetchMock, fetchMockInfo, newMockExam } from '../../actions/module/mockActions';
import { notification } from '../__plugins/noty';
import Moment from 'react-moment';
import 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faTrashAlt, faPlus, faTimes, faMinus } from '@fortawesome/free-solid-svg-icons';

import BootstrapTable from 'react-bootstrap-table-next'
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Modal from '../__layout/Modal';
import { CSSTransition } from "react-transition-group";
import SlideToggle from 'react-slide-toggle';
import { thisExpression } from '@babel/types';

const { SearchBar, ClearSearchButton  } = Search;

class MockExamComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cardStatus: false,
            cardActive: "",
            isModalOpen: false,
            subjectId: '',
            subjectName: '',
            topicId: '',
            topicName: '',
            lessonContent: '',
            lessonName: '',
            updateLessonContent: '',
            updateLessonName: '',
            showList: false,
            selectedQuestions: []

        }
        this.showCard = this.showCard.bind(this);
        this.formCreateLesson = this.formCreateLesson.bind(this);
        this.formUpdateLesson = this.formUpdateLesson.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleAddMockExam = this.handleAddMockExam.bind(this);
        // this.onEditorChange = this.onEditorChange.bind( this );
    }
    componentDidMount(){
        if (localStorage.getItem("pinnacleAdmin") !== null) {
            this.props.validateToken(this.state).then(tokenValidate => {
                if(tokenValidate.payload.status !== 200){
                    this.props.history.push("/login");
                }else{
                    this.props.fetchMock();
                }
            });
        }else {
            this.props.history.push("/login");
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.questionsLists){
            console.log( ">>>>> " + JSON.stringify(nextProps.questionsLists))
        }
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

    showCard(todo, status, id){
        if(status == "show"){
            this.setState({cardStatus: true})
            this.setState({cardActive: todo})
            this.props.fetchSubjects()
            if(todo == "view"){
                this.props.fetchMockInfo(id);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }else if(todo == "edit"){
                // this.props.fetchLessonInfo(lesson.topicId, lesson._id);
                this.props.fetchMockInfo(id);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }else{
            this.setState({cardStatus: false})
        }
    }

    onChange(e){
        let subject = JSON.parse(e.target.value);
        this.setState({subjectId: subject.id})
        this.setState({subjectName: subject.name})
        this.props.fetchQuestions(subject.id, "")
    }

    formCreateLesson(e){
        e.preventDefault();
        this.setState({disabled: true})
        let formData = {
            "name": this.state.lessonName,
            "content": this.state.lessonContent
        }
        this.props.newLesson(this.state.topicId, formData).then(res => {
            console.log("ADDED>>> " + JSON.stringify(res))
            if(res.payload.result === "success"){
                notification("success", `<i class = "fa fa-check"></i> ${res.payload.message}`)
                this.props.fetchLesson(this.state.topicId)
            }else if(res.payload.result === "error"){
                notification("success", `<i class = "fa fa-check"></i> ${res.payload.message}`)
            }else{
                notification("error", `<i class = "fa fa-check"></i> Something went wrong, Please try again`)
            }
            this.setState({lessonContent: ""});
            this.setState({lessonName: ""});
            this.setState({disabled: false})
            this.setState({cardStatus: false})
        });

    }

    formUpdateLesson(e){
        e.preventDefault();
        this.setState({disabled: true})
        let formData = {
            "name": this.state.updateLessonName,
            "content": this.state.updateLessonContent
        }
        this.props.updateLesson(this.state.topicId, this.props.lessonInfo.data._id, formData).then(res => {
            console.log("UPDATED>>> " + JSON.stringify(res))
            if(res.payload.result === "success"){
                notification("success", `<i class = "fa fa-check"></i> ${res.payload.message}`)
                // this.props.fetchLesson(this.state.topicId)
            }else if(res.payload.result === "error"){
                notification("success", `<i class = "fa fa-check"></i> ${res.payload.message}`)
            }else{
                notification("error", `<i class = "fa fa-check"></i> Something went wrong, Please try again`)
            }
            this.setState({updateLessonContent: ""});
            this.setState({updateLessonName: ""});
            this.setState({disabled: false})
            this.setState({cardStatus: false})
        })
    }

    handleAddMockExam(e){
        e.preventDefault();
        if(this.state.selectedQuestions.length > 0){
            console.log(this.state.selectedQuestions)
            let formData = {
                "subjectId": this.state.subjectId,
                "questions": this.state.selectedQuestions
            }
            console.log(formData)
            this.props.newMockExam(formData).then(data => {
                console.log(data)
                if(data.payload.result === "success"){
                    this.props.fetchMock();
                    this.setState({selectedQuestions: []})
                    notification("success", `<i class = "fa fa-check"></i> ${data.payload.message}`)
                    this.setState({disabled: false});
                    this.setState({cardStatus: false});
                }else if(data.payload.result === "failed"){
                    notification("error", `<i class = "fa fa-warning"></i> ${data.payload.error}`)
                }else{
                    notification("error", `<i class = "fa fa-warning"></i> Something went wrong please try agin`)
                }
            })
        }else{
            notification("error", `<i class = "fa fa-check"></i> Select questions first`)
        }
    }

    toggleState = (topicId, lessonId) => {
        if (typeof topicId === 'undefined') {
            this.setState({ isModalOpen: false});
        }else{
            this.props.fetchLessonInfo(topicId, lessonId);
            this.setState({ isModalOpen: !this.state.isModalOpen});
        }
    };

    btnSelectQuestion(question){
        var selected = this.state.selectedQuestions;
        var joined = selected.concat(question._id);
        if(selected.includes(question._id)){
            // console.log("REMOVE")
            var index = selected.indexOf(question._id);
            if (index > -1) {
                selected.splice(index, 1);
                this.setState({ selectedQuestions: selected })
            }
        }else{
            this.setState({ selectedQuestions: joined })
        }
    }

    render() {
        let mockListsArr = new Array();
        if(this.props.mockLists){
            // console.log(this.props.mockLists)
            if(this.props.mockLists.length > 0){
                this.props.mockLists.forEach( mock => {
                    mockListsArr.push({
                        name: mock.subjectName,
                        createdAt: <Moment format="MMMM D YYYY">{mock.createdAt}</Moment>,
                        action: <div className = "">
                                    <button type="button"  className="btn btn-primary btn-sm" onClick={() =>  this.showCard('view', 'show', mock.subjectId)}> <FontAwesomeIcon icon = {faEye}/></button> &nbsp;
                                    {/* <button type="button"  className="btn btn-success btn-sm" onClick={() =>  this.showCard('edit', 'show', mock.subjectId)}> <FontAwesomeIcon icon = {faMinus}/></button> &nbsp; */}
                                    {/* <button type="button"  className="btn btn-success btn-sm" onClick={() =>  this.showCard('edit', 'show', mock.subjectId)}> <FontAwesomeIcon icon = {faPlus}/></button> &nbsp; */}
                                    {/* <button type="button"  className="btn btn-danger btn-sm" onClick={() =>  this.toggleState(lesson.topicId, lesson._id)}> <FontAwesomeIcon icon = {faTrash}/></button> */}
                                </div>
                    })
                })
            }
        }else{
            mockListsArr = [];
        }
        let columns = [
            { dataField: 'name', text: 'Name',   style: { width: '600px' }, searchable: true},
            { dataField: 'createdAt', text: 'Date created',   style: { width: '600px' }, searchable: true},
            { dataField: 'action', text: 'Action', style: { width: '200px' } }
        ]
        
        
        return (
            <div>
                <SideNavComponent/>
                <div className="main">
                    <NavbarComponent/>
                    <div className="container">
                        <div className = "col">
                            <br/>
                            <h2>Lessons</h2>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                                <li className="breadcrumb-item">Mock</li>
                            </ol>
                            <div className = "row">
                                { this.state.cardStatus == true ?
                                    <div className = "col-md-12">
                                        <div className="card card-custom-border">
                                            <div className="card-header">
                                                {this.state.cardActive == "create" ? "Create new mock exam": ""}
                                                {this.state.cardActive == "edit" ? "Edit mock exam ": ""}
                                                {this.state.cardActive == "view" ? "View Mock Information" : ""}
                                                <small className = "float-right">
                                                    <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'hide')}>
                                                        <FontAwesomeIcon icon = {faTimes}/> Close
                                                    </a>
                                                </small>
                                            </div>
                                            <div className="card-body">
                                                {this.state.cardActive == "create" ? 
                                                    <div>
                                                        {this.props.subjectLists ? 
                                                            this.props.subjectLists.subjects.length > 0 
                                                            ? 
                                                            <select className = "form-control" name = "subjectId" id = "subjectId" onChange = {this.onChange} > <option value = "">Select Subject</option>{ this.props.subjectLists.subjects.map(subj => <option value = {JSON.stringify(subj)} key = {subj.id} data-subject = {subj.name}>{subj.name}</option>) } </select> 
                                                            : ""
                                                        : 
                                                        <div><i class="fa fa-spinner fa-spin"></i> Loading subjects... </div>
                                                        }

                                                        {this.props.questionsLists ?
                                                            <div>
                                                                {this.props.questionsLists.length > 0 ? 
                                                                    <div><br/>
                                                                    <form onSubmit = {this.handleAddMockExam}>
                                                                    <p>Add Question</p> <hr/>
                                                                    {this.state.subjectId === "" ? "" :  
                                                                        this.props.questionsLists.map( q => 
                                                                            <button
                                                                                key = {q._id} 
                                                                                type="button" 
                                                                                className= {this.state.selectedQuestions.length > 0 ? 
                                                                                    this.state.selectedQuestions.includes(q._id) ? 
                                                                                        "btn btn-success btn-block question-list" : 
                                                                                        "btn btn-secondary btn-block question-list" 
                                                                                    : "btn btn-secondary btn-block question-list"
                                                                                }
                                                                                disabled = {(this.state.disabled)? "disabled" : ""}
                                                                                onClick = {this.btnSelectQuestion.bind(this, q)}
                                                                            >
                                                                                {this.state.selectedQuestions.length > 0 ? this.state.selectedQuestions.includes(q._id) ? <i class="fa fa-check"></i> : "" : ""} {q.tag}
                                                                            </button>
                                                                        )}
                                                                        <hr/>
                                                                        <div className="form-group">
                                                                            <button type="submit" className="btn btn-primary btn-block" disabled = {(this.state.disabled)? "disabled" : ""}>
                                                                            {this.state.disabled ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Add Mock Exam'}
                                                                            </button>
                                                                        </div>
                                                                        </form>
                                                                    </div>
                                                                : <div><br/><label className = "text text-danger">Question for this subject is currently empty</label></div>}
                                                                
                                                            </div>
                                                        : ""
                                                        }
                                                    </div>
                                                : ""}

                                                {this.state.cardActive == "edit" ?  
                                                    this.props.mockInfo ? 
                                                        <div>                                                    
                                                            <p>Subject: {this.props.mockInfo.data.subject}</p>
                                                            <p>Total Questions: <b>{this.props.mockInfo.data.numberOfQuestions}</b></p>
                                                            <hr/>
                                                            {this.props.mockInfo.data.questions.map(q =>
                                                                <div>
                                                                <button class="dropdown-btn btn-primary" onClick={this.switch}> 
                                                                    {q.tag}
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
                                                                    <div className="list-body container">
                                                                        <br/>
                                                                        <div dangerouslySetInnerHTML={{ __html: q.question }} />
                                                                        <hr/>
                                                                        <p>Choices: </p><hr/>
                                                                        {q.choices.map( list => <p>{list}</p>)}
                                                                    </div>
                                                                    </CSSTransition>
                                                                </div>
                                                            )}
                                                        </div>
                                                    : ""
                                                : ""}

                                                {this.state.cardActive == "view" ?  
                                                    this.props.mockInfo ? 
                                                        <div>                                                    
                                                            <p>Subject: {this.props.mockInfo.data.subject}</p>
                                                            <p>Total Questions: <b>{this.props.mockInfo.data.numberOfQuestions}</b></p>
                                                            <hr/>
                                                            {this.props.mockInfo.data.questions.map(q =>
                                                                <div>
                                                                    <div className="list-body container q-list">
                                                                        <br/>
                                                                        <div dangerouslySetInnerHTML={{ __html: q.question }} />
                                                                        <hr/>
                                                                        <p>Choices: </p><hr/>
                                                                        {q.choices.map( list => <p>{list}</p>)}
                                                                    </div>
                                                                    <hr/>
                                                                {/* <button class="dropdown-btn btn-primary" onClick={this.switch}> 
                                                                    {q.tag}
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
                                                                    <div className="list-body container">
                                                                        <br/>
                                                                        <div dangerouslySetInnerHTML={{ __html: q.question }} />
                                                                        <hr/>
                                                                        <p>Choices: </p><hr/>
                                                                        {q.choices.map( list => <p>{list}</p>)}
                                                                    </div>
                                                                    </CSSTransition> */}
                                                                </div>
                                                             )}
                                                        </div>
                                                    : ""
                                                : "" }
                                            </div>
                                        </div>
                                        <hr/>
                                    </div>
                                : "" }
                                

                                <div className = "col-md-12">
                                    <div className="card card-custom-border">
                                        <div className="card-header">
                                            Content box
                                            <small className = "float-right">
                                                <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'show', '')}><FontAwesomeIcon icon = {faPlus}/> Add new mock</a>
                                            </small>
                                        </div>
                                        <div className="card-body">
                                            <div className = "row">
                                                </div>
                                                <div class = "container">
                                                    <div class=" card">
                                                        <div class="card-body">    
                                                            <ToolkitProvider
                                                            keyField="id"
                                                            data={ mockListsArr }
                                                            columns={ columns }
                                                            search
                                                            >
                                                            {
                                                                props => (
                                                                <div>
                                                                    <SearchBar { ...props.searchProps } />
                                                                    {/* <ClearSearchButton { ...props.searchProps } /> */}
                                                                    <hr />
                                                                    <BootstrapTable { ...props.baseProps } pagination={ paginationFactory() }/>
                                                                </div>
                                                                )
                                                            }
                                                            </ToolkitProvider>                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}






const mapStateToProps = state => ({
    validateToken: state.validateToken.testData,
    subjectLists: state.subjects.items.data,
    mockLists: state.mock.items.data,
    mockInfo: state.mock.info,
    questionsLists: state.questions.items.data
})

export default connect(mapStateToProps, { 
    validateToken,
    fetchMock,
    fetchMockInfo,
    fetchSubjects,
    fetchQuestions,
    newMockExam
})(MockExamComponent);

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';
import NavbarComponent   from '../__layout/Navbar';
import SideNavComponent   from '../__layout/SideNav';
import { validateToken } from '../../actions/module/validateAdminActions';
import { fetchSubjects } from '../../actions/module/subjectActions';
import { fetchTopic, newTopic, updateTopic } from '../../actions/module/topicActions';

import { uploadFile, getFile } from '../../actions/module/uploadActions';
import { notification } from '../__plugins/noty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faTrashAlt, faPlus, faTimes, faInfo } from '@fortawesome/free-solid-svg-icons';
import BootstrapTable from 'react-bootstrap-table-next'
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Modal from '../__layout/Modal';
const { SearchBar, ClearSearchButton  } = Search;

class TopicComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "subjectName": "",
            "subjectId": "",
            "cardStatus": false,
            "disabled": false,
            "isModalOpen": false,
            "createTopicName": "",
            "editTopicName": "",
            "topicId": "",
            "topicName": "",
            "topicInfo": ""
        };
        this.onChange = this.onChange.bind(this);
        this.onChangeForm = this.onChangeForm.bind(this);
        this.formCreateTopic = this.formCreateTopic.bind(this);
        this.formUpdateTopic = this.formUpdateTopic.bind(this);
    }
    componentDidMount(){
        if (localStorage.getItem("pinnacleAdmin") !== null) {
            this.props.validateToken(this.state).then(tokenValidate => {
                if(tokenValidate.payload.status !== 200){
                    this.props.history.push("/login");
                }else{
                    this.props.fetchSubjects();
                }
            });
        }else {
            this.props.history.push("/login");
        }
    }

    showCard(todo, status, id){
        if(status == "show"){
            this.setState({cardStatus: true})
            this.setState({cardActive: todo})
            if(todo == "view"){
                this.setState({disabled: true});
                // this.props.subjectInfo(id);
            }else if(todo == "edit"){
                this.setState({disabled: false});
                this.setState({topicId: id.id});
                this.setState({editTopicName: id.description});
                this.setState({updateLoad: false});
                // this.props.subjectInfo(id);
            }
        }else{
            this.setState({cardStatus: false})
        }
    }

    onChange(e){
        if(e.target.value == ""){
            this.setState({subjectId: ""})
        }else{
            let subject = JSON.parse(e.target.value);
            this.setState({subjectId: subject.id})
            this.setState({subjectName: subject.name})
            this.props.fetchTopic(subject.id)
        }
    }

    onChangeForm(e){
        this.setState({[e.target.name]: e.target.value})
    }

    formCreateTopic(e){
        e.preventDefault();
        if(this.state.subjectId === ""){
            notification("error", `<i class = "fa fa-remove"></i> Select subject first`)
        }else{
            this.setState({disabled: true})
            let formData = {
                "description": this.state.createTopicName
            }
            this.props.newTopic(this.state.subjectId, formData).then( data => {
                console.log("AAA> " + JSON.stringify(data))
                this.setState({disabled: false})
                this.setState({createTopicName: ''})
                if(data.payload.result === "success"){
                    this.props.fetchTopic(this.state.subjectId);
                    notification("success", `<i class = "fa fa-check"></i> ${data.payload.message}`)
                }else if(data.payload.result === "failed"){
                    notification("error", `<i class = "fa fa-remove"></i> ${data.payload.message}`)
                }else{
                    notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please try again`)
                }
            })
        }
    }

    formUpdateTopic(e){
        e.preventDefault();
        if(this.state.subjectId === ""){
            notification("error", `<i class = "fa fa-remove"></i> Select subject first`)
        }else{
            this.setState({disabled: true})
            let formData = {
                "description": this.state.editTopicName,
                "subjectId": this.state.subjectId,
                "isArchive": false
            }
            this.props.updateTopic(this.state.subjectId, this.state.topicId, formData).then( data => {
                console.log("AAA> " + JSON.stringify(data))
                this.setState({disabled: false})
                this.setState({editTopicName: ''})
                if(data.payload.result === "success"){
                    this.props.fetchTopic(this.state.subjectId);
                    notification("success", `<i class = "fa fa-check"></i> ${data.payload.message}`)
                }else if(data.payload.result === "failed"){
                    notification("error", `<i class = "fa fa-remove"></i> ${data.payload.message}`)
                }else{
                    notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please try again`)
                }
            })
        }
    }

    toggleState = (topic) => {
        // alert(window.location.href)
        console.log(topic)
        if (typeof topic === 'undefined') {
            this.setState({ isModalOpen: false});
        }else{
            this.setState({topicInfo: {"subjectId": this.state.subjectId, "topicId": topic.id, "topicName": topic.description}})
            console.log(this.state.topicInfo)
            this.setState({ isModalOpen: !this.state.isModalOpen});
        }
    };

    
    render() {
        let topicsListsArr = new Array();
        if(this.props.topicLists){
            if(this.props.topicLists.length > 0){
                this.props.topicLists.forEach( topic => {
                    topicsListsArr.push({
                        name: topic.description,
                        totalLessons: topic.lessons.length,
                        action: <div className = "">
                                    {/* <button type="button"  className="btn btn-primary btn-sm" onClick={() =>  this.showCard('view', 'show', topic.id)}> <FontAwesomeIcon icon = {faEye}/></button> &nbsp; */}
                                    <button type="button"  className="btn btn-success btn-sm" onClick={() =>  this.showCard('edit', 'show', topic)}> <FontAwesomeIcon icon = {faEdit}/></button> &nbsp;
                                    <button type="button"  className="btn btn-danger btn-sm" onClick={() =>  this.toggleState(topic)}> <FontAwesomeIcon icon = {faTrash}/></button>
                                </div>
                    })
                });
            }
        }
        let columns = [
            { dataField: 'name', text: 'Name', style: { width: '450px' }},
            { dataField: 'totalLessons', text: 'Total Lessons', style: { width: '350px' }},
            { dataField: 'action', text: 'Action', style: { width: '200px' } }
        ]
        
        return (
            <div>
            <SideNavComponent/>
                <div className="main">
                    <NavbarComponent/>
                        {/* <div className=""> */}
                    <div className="container">
                        <div className = "col">
                        <br/>
                        <h2>Topics</h2>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                            <li className="breadcrumb-item">Topics</li>
                        </ol>
                        <div className = "row">
                            <div className = {this.state.cardStatus == true ? "col-md-7" : "col"}>
                                <div className="card card-custom-border">
                                    <div className="card-header">
                                        Content box
                                        <small className = "float-right">
                                            {
                                                this.state.cardStatus == true ?  "" :  this.state.subjectId === "" ? "" : <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'show', '')}><FontAwesomeIcon icon = {faPlus}/> Add new topic</a>
                                            }
                                        </small>
                                    </div>
                                    <div className="card-body">
                                        
                                        
                                        
                                    {/* <div>
                                        {this.state.isModalOpen && (
                                        <Modal id="modal" isOpen={this.state.isModalOpen} onClose={this.toggleState} title = "Delete" type = "delete-topic" data = {this.state.topicInfo}>
                                            <div className="box-body">Are you sure you want to delete this <b> {this.state.topicInfo ? this.state.topicInfo.topicName : ""} </b>?</div>
                                        </Modal>
                                        )}
                                    </div> */}

                                    <div className = "col-md-12">
                                        <div>
                                            {this.state.isModalOpen && (
                                                <Modal id="modal" isOpen={this.state.isModalOpen} onClose={this.toggleState} title = "Delete" type = "delete-question" data = {this.props.questionInfo ? this.props.questionInfo.data : ""}>
                                                    <div className="box-body">Are you sure you want to delete this <b> {this.state.questionInfo ? this.state.questionInfo.data.tag : ""} </b>?</div>
                                                </Modal>
                                                )}
                                        </div>
                                        {this.props.subjectLists ? 
                                            this.props.subjectLists.subjects.length > 0 
                                            ? 
                                            <select className = "form-control" name = "subjectId" id = "subjectId" onChange = {this.onChange} > <option value = "">Select Subject</option>{ this.props.subjectLists.subjects.map(subj => <option value = {JSON.stringify(subj)} key = {subj.id} data-subject = {subj.name}>{subj.name}</option>) } </select> 
                                            : ""
                                        : 
                                        <div><i class="fa fa-spinner fa-spin"></i> Loading subjects... </div>
                                        }
                                    </div>
                                    <br/>
                                        <div class = "container">
                                            <div class=" card">
                                                <div class="card-body">    
                                                    {this.state.subjectId == '' ? 
                                                        <div class="alert alert-dismissible alert-primary">
                                                            <strong>Select Subject first</strong>
                                                        </div>
                                                    :  
                                                    <ToolkitProvider
                                                    keyField="id"
                                                    data={ topicsListsArr }
                                                    columns={ columns }
                                                    search
                                                    >
                                                    {
                                                        props => (
                                                        <div>
                                                            <SearchBar { ...props.searchProps } />
                                                            <hr />
                                                            <BootstrapTable { ...props.baseProps } pagination={ paginationFactory() }/>
                                                        </div>
                                                        )
                                                    }
                                                    </ToolkitProvider>
                                                    }
                                                    
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>



                            { this.state.cardStatus == true ?
                                <div className = "col-md-5">
                                    <div className="card border-primary">
                                        <div className="card-header">
                                            {this.state.cardActive == "view" ? "Topic Information" : ""}
                                            {this.state.cardActive == "create" ? "Create new topic": ""}
                                            {this.state.cardActive == "edit" ? "Edit topic": ""}
                                            <small className = "float-right">
                                                <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'hide')}>
                                                    <FontAwesomeIcon icon = {faTimes}/> Close
                                                </a>
                                            </small>
                                        </div>
                                        <div className="card-body">
                                            {this.state.cardActive == "create" ?
                                                <form onSubmit = {this.formCreateTopic} id = "createTopicForm">
                                                    <div className="form-group">
                                                        <label for="code"><b>{this.state.subjectName}</b></label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label for="code">Name</label>
                                                        <input type="text" className="form-control" placeholder="Enter topic name" name = "createTopicName"  value = {this.state.createTopicName} onChange = {this.onChangeForm} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div>
                                                    
                                                    <div className="form-group">
                                                        <button type="submit" className="btn btn-primary btn-block" disabled = {(this.state.disabled)? "disabled" : ""}>
                                                        {this.state.disabled ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Submit'}
                                                        </button>
                                                    </div>
                                                </form>
                                            : ""}

                                            {this.state.cardActive == "edit" ?
                                                <form onSubmit = {this.formUpdateTopic} id = "editTopicForm">
                                                    <div className="form-group">
                                                        <label for="code"><b>{this.state.subjectName}</b></label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label for="code">Name</label>
                                                        <input type="text" className="form-control" placeholder="Enter topic name" name = "editTopicName"  value = {this.state.editTopicName} onChange = {this.onChangeForm} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div>
                                                    
                                                    <div className="form-group">
                                                        <button type="submit" className="btn btn-primary btn-block" disabled = {(this.state.disabled)? "disabled" : ""}>
                                                        {this.state.disabled ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Submit'}
                                                        </button>
                                                    </div>
                                                </form>
                                            : ""}
                                        </div>
                                    </div>
                                </div>
                                : "" }


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
    topicLists: state.topics.items.data
})

export default connect(mapStateToProps, { 
    validateToken,
    fetchSubjects,
    fetchTopic,
    newTopic,
    updateTopic
})(TopicComponent);
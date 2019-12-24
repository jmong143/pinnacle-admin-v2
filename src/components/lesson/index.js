import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';
import NavbarComponent   from '../__layout/Navbar';
import SideNavComponent   from '../__layout/SideNav';
import { validateToken } from '../../actions/module/validateAdminActions';
import { fetchSubjects } from '../../actions/module/subjectActions';
import { fetchTopic } from '../../actions/module/topicActions';
import { fetchLesson, fetchLessonInfo, newLesson, updateLesson } from '../../actions/module/lessonActions';
import { fetchQuestions, newQuestion } from '../../actions/module/questionsActions';
import { notification } from '../__plugins/noty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faTrashAlt, faPlus, faTimes, faInfo } from '@fortawesome/free-solid-svg-icons';
// import CKEditor from 'ckeditor4-react';
// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Editor } from '@tinymce/tinymce-react'; 

import BootstrapTable from 'react-bootstrap-table-next'
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Modal from '../__layout/Modal';
const { SearchBar, ClearSearchButton  } = Search;

class LessonComponent extends Component {

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
            updateLessonName: ''
        }
        this.showCard = this.showCard.bind(this);
        this.formCreateLesson = this.formCreateLesson.bind(this);
        this.formUpdateLesson = this.formUpdateLesson.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeTopic = this.onChangeTopic.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);
        // this.onChangeFile = this.onChangeFile.bind(this);
        // this.onEditorChange = this.onEditorChange.bind( this );
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

    componentWillReceiveProps(nextProps){
        if(nextProps.lessonInfo){
            this.setState({updateLessonName: nextProps.lessonInfo.data.name})
            this.setState({updateLessonContent: nextProps.lessonInfo.data.content})
        }
    }

    showCard(todo, status, lesson){
        if(status == "show"){
            this.setState({cardStatus: true})
            this.setState({cardActive: todo})
            if(todo == "view"){
                this.props.fetchLessonInfo(lesson.topicId, lesson._id);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }else if(todo == "edit"){
                this.props.fetchLessonInfo(lesson.topicId, lesson._id);
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
        this.props.fetchTopic(subject.id)
        // if(e.target.value == ""){
        // }else{
        // }
    }

    onChangeText(e){
        this.setState({[e.target.name]: e.target.value})
    }

    onChangeTopic(e){
        // console.log(this.state.subjectId);
        if(e.target.value == ""){
            this.setState({topicId: ""})
        }else{
            let topic = JSON.parse(e.target.value);
            this.setState({topicId: topic.id})
            this.setState({topicName: topic.description})
            this.props.fetchLesson(topic.id)
        }
    }

    onEditorChange(evt) {
        if(this.state.cardActive === 'create'){
            // this.setState({ lessonContent: evt.editor.getData() });
            this.setState({ lessonContent: evt.target.getContent() });
        }else if(this.state.cardActive === 'edit'){
            // this.setState({ updateLessonContent: evt.editor.getData() });
            this.setState({ updateLessonContent: evt.target.getContent() });
        }
        
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
                this.props.fetchLesson(this.state.topicId)

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

    toggleState = (topicId, lessonId) => {
        if (typeof topicId === 'undefined') {
            this.setState({ isModalOpen: false});
        }else{
            this.props.fetchLessonInfo(topicId, lessonId);
            this.setState({ isModalOpen: !this.state.isModalOpen});
        }
    };

    render() {
        let lessonListsArr = new Array();
        let $this = this;
        if(this.state.subjectId !== "" && this.state.topicId !== "" && this.props.lessonLists){
            // $this.setState({cardStatus: true})
            if(this.props.lessonLists.data){
                if(this.props.lessonLists.data.length > 0){
                    this.props.lessonLists.data.forEach( lesson => {
                        lessonListsArr.push({
                            name: lesson.name,
                            action: <div className = "">
                                        <button type="button"  className="btn btn-primary btn-sm" onClick={() =>  this.showCard('view', 'show', lesson)}> <FontAwesomeIcon icon = {faEye}/></button> &nbsp;
                                        <button type="button"  className="btn btn-success btn-sm" onClick={() =>  this.showCard('edit', 'show', lesson)}> <FontAwesomeIcon icon = {faEdit}/></button> &nbsp;
                                        <button type="button"  className="btn btn-danger btn-sm" onClick={() =>  this.toggleState(lesson.topicId, lesson._id)}> <FontAwesomeIcon icon = {faTrash}/></button>
                                    </div>
                        })
                    });

                }
            }
        }else{
            lessonListsArr = [];
        }
        let columns = [
            { dataField: 'name', text: 'Name',   style: { width: '600px' }, searchable: true},
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
                                <li className="breadcrumb-item">Lessons</li>
                            </ol>
                            <div className = "row">
                                { this.state.cardStatus == true ?
                                    <div className = "col-md-12">
                                        <div className="card card-custom-border">
                                            <div className="card-header">
                                                {this.state.cardActive == "create" ? "Create new lesson": ""}
                                                {this.state.cardActive == "edit" ? "Edit lesson": ""}
                                                {this.state.cardActive == "view" ? "Lesson Information" : ""}
                                                <small className = "float-right">
                                                    <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'hide')}>
                                                        <FontAwesomeIcon icon = {faTimes}/> Close
                                                    </a>
                                                </small>
                                            </div>
                                            <div className="card-body">
                                                {this.state.cardActive == "create" ? 
                                                
                                                    <form onSubmit = {this.formCreateLesson} id = "createLessonForm">
                                                        <div className="form-group">
                                                            <p><b> {this.state.subjectName}</b></p>
                                                            <p><b> {this.state.topicName}</b></p>
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" placeholder="Enter lesson name" name = "lessonName" value = {this.state.lessonName} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="name">Content</label>
                                                            {/* <CKEditor
                                                                editor={ ClassicEditor }
                                                                data=""
                                                                onChange={this.onEditorChange}
                                                            /> */}
                                                            <Editor
                                                                initialValue=""
                                                                init={{
                                                                height: 500,
                                                                menubar: false,
                                                                plugins: [
                                                                    'font image underline',
                                                                    'advlist autolink lists link image charmap print preview anchor',
                                                                    'searchreplace visualblocks code fullscreen',
                                                                    'insertdatetime media table paste code help wordcount'
                                                                ],
                                                                // plugins: [
                                                                //     'lists link image paste help wordcount'
                                                                // ],
                                                                toolbar:
                                                                    'font undo redo | formatselect | bold italic underline backcolor | \
                                                                    alignleft aligncenter alignright alignjustify | \
                                                                    bullist numlist outdent indent | removeformat image | help'
                                                                }}
                                                                onChange={this.onEditorChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <button type="submit" className="btn btn-primary btn-block" disabled = {(this.state.disabled)? "disabled" : ""}>
                                                            {this.state.disabled ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Submit'}
                                                            </button>
                                                        </div>
                                                    </form>
                                                : ""}

                                                {this.state.cardActive == "edit" ? 
                                                
                                                <form onSubmit = {this.formUpdateLesson} id = "editLessonForm">
                                                    <div className="form-group">
                                                        <p><b> {this.state.subjectName}</b></p>
                                                        <p><b> {this.state.topicName}</b></p>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" placeholder="Enter lesson name" name = "updateLessonName" value = {this.state.updateLessonName} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label for="name">Content</label>
                                                        {/* <CKEditor
                                                            editor={ ClassicEditor }
                                                            data={this.state.updateLessonContent}
                                                            onChange={this.onEditorChange}
                                                        /> */}
                                                         <Editor
                                                            initialValue={this.state.updateLessonContent}
                                                            init={{
                                                            height: 500,
                                                            menubar: false,
                                                            plugins: [
                                                                'font image underline',
                                                                'advlist autolink lists link image charmap print preview anchor',
                                                                'searchreplace visualblocks code fullscreen',
                                                                'insertdatetime media table paste code help wordcount'
                                                            ],
                                                            // plugins: [
                                                            //     'lists link image paste help wordcount'
                                                            // ],
                                                            toolbar:
                                                                'font undo redo | formatselect | bold italic underline backcolor | \
                                                                alignleft aligncenter alignright alignjustify | \
                                                                bullist numlist outdent indent | removeformat image | help'
                                                            }}
                                                            onChange={this.onEditorChange}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <button type="submit" className="btn btn-primary btn-block" disabled = {(this.state.disabled)? "disabled" : ""}>
                                                        {this.state.disabled ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Submit'}
                                                        </button>
                                                    </div>
                                                </form>
                                            : ""}

                                                {this.state.cardActive == "view" ? 
                                                 <div>
                                                     <p>Topic Name: <b>{this.state.topicName} </b></p>
                                                     {this.props.lessonInfo ? 
                                                        <div>
                                                            <p>Lesson Name: <b>{this.props.lessonInfo.data.name} </b></p>
                                                            <p>Content: </p>
                                                            <div class="alert alert-secondary alert-lesson-content">
                                                                <div dangerouslySetInnerHTML={{ __html: this.props.lessonInfo.data.content }} />
                                                            </div>
                                                        </div>
                                                        
                                                     : "" }
                                                     

                                                </div>
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
                                                {
                                                    this.state.subjectId !== "" && this.state.topicId !== "" && this.props.topicLists  ?  <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'show', '')}><FontAwesomeIcon icon = {faPlus}/> Add new lesson</a> : ""
                                                }
                                            </small>
                                        </div>
                                        <div className="card-body">
                                            <div className = "row">
                                                <div>
                                                    {this.state.isModalOpen && (
                                                    <Modal id="modal" isOpen={this.state.isModalOpen} onClose={this.toggleState} title = "Delete" type = "delete-lesson" data = {this.props.lessonInfo ? this.props.lessonInfo.data : ""}>
                                                        <div className="box-body">Are you sure you want to delete this <b> {this.props.lessonInfo ? this.props.lessonInfo.data.name : ""} </b>?</div>
                                                    </Modal>
                                                    )}
                                                </div>
                                                <div className = "col-md-6">
                                                    {this.props.subjectLists ? 
                                                        this.props.subjectLists.subjects.length > 0 
                                                        ? 
                                                        <select className = "form-control" name = "subjectId" id = "subjectId" onChange = {this.onChange} > <option value = "">Select Subject</option>{ this.props.subjectLists.subjects.map(subj => <option value = {JSON.stringify(subj)} key = {subj.id} data-subject = {subj.name}>{subj.name}</option>) } </select> 
                                                        : ""
                                                    : 
                                                    <div><i class="fa fa-spinner fa-spin"></i> Loading subjects... </div>
                                                    }
                                                </div>
                                                <div className = "col-md-6">
                                                    {this.props.topicLists ? 
                                                        this.props.topicLists.length > 0 ? 
                                                            <div>
                                                                <select className = "form-control" onChange = {this.onChangeTopic} > 
                                                                    <option value = "">Select Topic</option>
                                                                    { this.props.topicLists.map(top => <option key = {top.id} value = {JSON.stringify(top)}>{top.description}</option>) } 
                                                                </select>
                                                            </div>
                                                        : <label className = "text text-danger">Topic currently empty</label>
                                                    : 
                                                    ""
                                                    }
                                                </div>
                                                <br/><br/>
                                                <div class = "container">
                                                    <div class=" card">
                                                        <div class="card-body">    
                                                            {this.state.topicId == '' ? 
                                                                <div class="alert alert-dismissible alert-primary">
                                                                    <strong>Select subject and topic first</strong>
                                                                </div>
                                                            : 
                                                                            <ToolkitProvider
                                                                            keyField="id"
                                                                            data={ lessonListsArr }
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
                                                            }
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
            </div>
        )
    }
}






const mapStateToProps = state => ({
    validateToken: state.validateToken.testData,
    subjectLists: state.subjects.items.data,
    topicLists: state.topics.items.data,
    questionsLists: state.questions.items.data,
    newQuestion: state.questions.question,
    lessonLists: state.lessons.items,
    lessonInfo: state.lessons.info
})

export default connect(mapStateToProps, { 
    validateToken,
    fetchSubjects, 
    fetchTopic,
    fetchQuestions,
    newQuestion,
    fetchLesson,
    fetchLessonInfo,
    newLesson,
    updateLesson
})(LessonComponent);

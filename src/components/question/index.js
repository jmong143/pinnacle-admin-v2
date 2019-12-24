import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';
import NavbarComponent   from '../__layout/Navbar';
import SideNavComponent   from '../__layout/SideNav';
import { validateToken } from '../../actions/module/validateAdminActions';
import { fetchSubjects } from '../../actions/module/subjectActions';
import { fetchTopic } from '../../actions/module/topicActions';
import { fetchQuestions, newQuestion, fetchQuestionInfo, updateQuestion } from '../../actions/module/questionsActions';
import { notification } from '../__plugins/noty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faTrashAlt, faPlus, faTimes, faInfo } from '@fortawesome/free-solid-svg-icons';
// import EditorJs from 'react-editor-js';
// import { EDITOR_JS_TOOLS } from './tools'


// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';


// import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';


import { Editor } from '@tinymce/tinymce-react'; 


import BootstrapTable from 'react-bootstrap-table-next'
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Modal from '../__layout/Modal';
const { SearchBar, ClearSearchButton  } = Search;

class QuestionsComponent extends Component {

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
            questionName: '',
            questionTag: '',
            questionChoice1: '',
            questionChoice2: '',
            questionChoice3: '',
            questionChoice4: '',
            questionSolution: '',
            questionAnswer: '',
            updateQuestionName: '',
            updateQuestionTag: '',
            updateQuestionChoice1: '',
            updateQuestionChoice2: '',
            updateQuestionChoice3: '',
            updateQuestionChoice4: '',
            updateQuestionSolution: '',
            updateQuestionAnswer: '',

        }
        this.showCard = this.showCard.bind(this);
        this.formCreateQuestion = this.formCreateQuestion.bind(this);
        this.formEditQuestion = this.formEditQuestion.bind(this);
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
        if(nextProps.questionInfo){
            // this.setState({disabled:false})
            console.log(">> " + JSON.stringify(nextProps.questionInfo))
            this.setState({disabled: false});
            this.setState({updateQuestionTag:nextProps.questionInfo.data.tag})
            this.setState({updateQuestionName:nextProps.questionInfo.data.question})
            this.setState({updateQuestionChoice1:nextProps.questionInfo.data.choices[0]})
            this.setState({updateQuestionChoice2:nextProps.questionInfo.data.choices[1]})
            this.setState({updateQuestionChoice3:nextProps.questionInfo.data.choices[2]})
            this.setState({updateQuestionChoice4:nextProps.questionInfo.data.choices[3]})
            this.setState({updateQuestionAnswer:nextProps.questionInfo.data.answer})
            this.setState({updateQuestionSolution:nextProps.questionInfo.data.solution})
        }
    }

    showCard(todo, status, id){
        if(status == "show"){
            this.setState({cardStatus: true})
            this.setState({cardActive: todo})
            if(todo == "view"){
                console.log("aaa>>> " + id )
                // this.setState({disabled: true});
                this.props.fetchQuestionInfo(id);
            }else if(todo == "edit"){
                this.setState({disabled: true});
                this.props.fetchQuestionInfo(id);
            }
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
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
            console.log(">>>>>>>>> " + topic)
            this.setState({topicId: topic.id})
            this.setState({topicName: topic.description})
            this.props.fetchQuestions(this.state.subjectId, topic.id)
        }
    }

    onEditorChange(evt) {
        console.log("event>>> " + evt)
        if(this.state.cardActive === 'create'){
            // this.setState({ questionName: evt.editor.getData() });
            let testt11 = this.editorInstance.save();
            console.log("testt11> " + testt11)
        }else if(this.state.cardActive === 'edit'){
            this.setState({ updateQuestionName: evt.editor.getData() });
        }
        
    }

    formCreateQuestion(e){
        e.preventDefault();
        this.setState({disabled: true})
        if(this.state.questionAnswer == ""){
            this.setState({disabled: false})
            notification("error", `<i class = "fa fa-check"></i> Select answer first`)
        }else{
            let formData = {
                "tag": this.state.questionTag,
                "name": this.state.questionName,
                "solution": this.state.questionSolution,
                "choices": [this.state.questionChoice1, this.state.questionChoice2, this.state.questionChoice3, this.state.questionChoice4],
                "answer": this.state.questionAnswer,
                "subjectId": this.state.subjectId,
                "topicId": this.state.topicId
            }
            console.log("FORM>>> " + JSON.stringify(formData))
            this.props.newQuestion(formData).then(res => {
                console.log("ADDED>>> " + JSON.stringify(res))
                if(res.payload.result === "success"){
                    notification("success", `<i class = "fa fa-check"></i> ${res.payload.message}`)
                    this.props.fetchQuestions(this.state.subjectId, this.state.topicId)
                }else if(res.payload.result === "error"){
                    notification("success", `<i class = "fa fa-check"></i> ${res.payload.message}`)
                }else{
                    notification("error", `<i class = "fa fa-check"></i> Something went wrong, Please try again`)
                }
                this.setState({questionName: ""});
                this.setState({questionChoice1: ""})
                this.setState({questionChoice2: ""})
                this.setState({questionChoice3: ""})
                this.setState({questionChoice4: ""})
                this.setState({questionSolution: ""})
                this.setState({questionAnswer: ""})
                this.setState({disabled: false})
                this.setState({cardStatus: false})
            });
        }

    }

    formEditQuestion(e){
        e.preventDefault();
        this.setState({disabled: true})
        if(this.state.updateQuestionAnswer == ""){
            notification("error", `<i class = "fa fa-check"></i> Select answer first`)
        }else{
            let formData = {
                "tag": this.state.updateQuestionTag,
                "question": this.state.updateQuestionName,
                "solution": this.state.updateQuestionSolution,
                "choices": [this.state.updateQuestionChoice1, this.state.updateQuestionChoice2, this.state.updateQuestionChoice3, this.state.updateQuestionChoice4],
                "answer": this.state.updateQuestionAnswer
            }
            console.log("FORM>>> " + JSON.stringify(formData))
            this.props.updateQuestion(this.props.questionInfo.data._id, formData).then(res => {
                console.log("ADDED>>> " + JSON.stringify(res))
                if(res.payload.result === "success"){
                    notification("success", `<i class = "fa fa-check"></i> ${res.payload.message}`)
                    this.props.fetchQuestions(this.state.subjectId, this.state.topicId)
                }else if(res.payload.result === "error"){
                    notification("success", `<i class = "fa fa-check"></i> ${res.payload.message}`)
                }else{
                    notification("error", `<i class = "fa fa-check"></i> Something went wrong, Please try again`)
                }
                // this.setState({questionName: ""});
                // this.setState({questionChoice1: ""})
                // this.setState({questionChoice2: ""})
                // this.setState({questionChoice3: ""})
                // this.setState({questionChoice4: ""})
                // this.setState({questionSolution: ""})
                // this.setState({questionAnswer: ""})
                this.setState({disabled: false})
                this.setState({cardStatus: false})
            });
        }
    }

    toggleState = (id) => {
        if (typeof id === 'undefined') {
            this.setState({ isModalOpen: false});
        }else{
            this.setState({ isModalOpen: true});
            this.props.fetchQuestionInfo(id);
        }
    };

    handleEditorChange = (e) => {
        
        console.log('Content was updated:', e.target.getContent());
        if(this.state.cardActive === 'create'){
            this.setState({ questionName: e.target.getContent() });
        }else if(this.state.cardActive === 'edit'){
            console.log("HERERERERERERERER")
            this.setState({ updateQuestionName: e.target.getContent() });
        }
    }

    handleEditorChangeSolution = (e) => {
        console.log('Content was updated:', e.target.getContent());
        if(this.state.cardActive === 'create'){
            this.setState({ questionSolution: e.target.getContent() });
        }else if(this.state.cardActive === 'edit'){
            this.setState({ updateQuestionSolution: e.target.getContent() });
        }
    }

    render() {
        let questionsArr = new Array();
        let $this = this;
        if(this.state.subjectId !== "" && this.state.topicId !== "" && this.props.questionsLists){
            // $this.setState({cardStatus: true})
            // if(this.props.questionsLists){
                console.log(">>  " + JSON.stringify(this.props.questionsLists))
                this.props.questionsLists.forEach( q => {
                    questionsArr.push({
                        name: q.tag,
                        answer: q.answer,
                        action: <div className = "">
                                    <button type="button"  className="btn btn-primary btn-sm" onClick={() =>  this.showCard('view', 'show', q._id)}> <FontAwesomeIcon icon = {faEye}/></button> &nbsp;
                                    <button type="button"  className="btn btn-success btn-sm" onClick={() =>  this.showCard('edit', 'show', q._id)}> <FontAwesomeIcon icon = {faEdit}/></button> &nbsp;
                                    <button type="button"  className="btn btn-danger btn-sm" onClick={() =>  this.toggleState(q._id)}> <FontAwesomeIcon icon = {faTrash}/></button>
                                </div>
                    })
                });
            // }
        }else{
            questionsArr = [];
        }
        let columns = [
            { dataField: 'name', text: 'Name'},
            { dataField: 'answer', text: 'Answer',   style: { width: '450px' }, searchable: true},
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
                            <h2>Questions</h2>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                                <li className="breadcrumb-item">Questions</li>
                            </ol>
                            <div className = "row">
                                <div>
                                    {this.state.isModalOpen && (
                                    <Modal id="modal" isOpen={this.state.isModalOpen} onClose={this.toggleState} title = "Delete" type = "delete-question" data = {this.props.questionInfo ? this.props.questionInfo.data : ""}>
                                        <div className="box-body">Are you sure you want to delete this <b> {this.state.questionInfo ? this.state.questionInfo.data.tag : ""} </b>?</div>
                                    </Modal>
                                    )}
                                </div>
                                { this.state.cardStatus == true ?
                                    <div className = "col-md-12">
                                        <div className="card card-custom-border">
                                            <div className="card-header">
                                                {this.state.cardActive == "create" ? "Create new question": ""}
                                                {this.state.cardActive == "edit" ? "Edit question": ""}
                                                {this.state.cardActive == "view" ? "Question Information" : ""}
                                                <small className = "float-right">
                                                    <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'hide')}>
                                                        <FontAwesomeIcon icon = {faTimes}/> Close
                                                    </a>
                                                </small>
                                            </div>
                                            <div className="card-body">


                                                {this.state.cardActive == "create" ? 
                                                    <form onSubmit = {this.formCreateQuestion} id = "createQuestionForm">
                                                        <div className="form-group">
                                                            <p>Selected Subject: {this.state.subjectName}</p>
                                                            <p>Selected Topic: {this.state.topicName}</p>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="name">Tag</label>
                                                            <input type="text" className="form-control" placeholder="Enter question tag" name = "questionTag" value = {this.state.questionTag} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="name">Title</label>
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
                                                                onChange={this.handleEditorChange}
                                                          />
                                                            {/* <EditorJs instanceRef={instance => this.editorInstance = instance}  data={this.onEditorChange} tools={EDITOR_JS_TOOLS} />; */}
                                                            {/* <CKEditor
                                                                editor={ ClassicEditor }
                                                                data=""
                                                                onChange={this.onEditorChange}
                                                            /> */}
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="name">Choices</label>
                                                            <div className = "row">
                                                                <div className = "col-md-6">
                                                                    <input type="text" className="form-control" placeholder="Choice A" name = "questionChoice1" value = {this.state.questionChoice1} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                                </div>
                                                                <div className = "col-md-6">
                                                                    <input type="text" className="form-control" placeholder="Choice B" name = "questionChoice2" value = {this.state.questionChoice2} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                                </div>
                                                                <div className = "col-md-6">
                                                                    <input type="text" className="form-control" placeholder="Choice C" name = "questionChoice3" value = {this.state.questionChoice3} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                                </div>
                                                                <div className = "col-md-6">
                                                                    <input type="text" className="form-control" placeholder="Choice D" name = "questionChoice4" value = {this.state.questionChoice4} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="name">Answer</label>
                                                            <select className = "form-control" name = "questionAnswer" onChange = {this.onChangeText}  disabled = {(this.state.disabled)? "disabled" : ""}>
                                                                <option value = ""></option>
                                                                {this.state.questionChoice1 === "" ? "" : <option key = {this.state.questionChoice1} value = {this.state.questionChoice1}>{this.state.questionChoice1}</option>}
                                                                {this.state.questionChoice2 === "" ? "" : <option key = {this.state.questionChoice2} value = {this.state.questionChoice2}>{this.state.questionChoice2}</option>}
                                                                {this.state.questionChoice3 === "" ? "" : <option key = {this.state.questionChoice3} value = {this.state.questionChoice3}>{this.state.questionChoice3}</option>}
                                                                {this.state.questionChoice4 === "" ? "" : <option key = {this.state.questionChoice4} value = {this.state.questionChoice4}>{this.state.questionChoice4}</option>}
                                                            </select>
                                                            {/* <input type="text" className="form-control" placeholder="Enter Answer" name = "questionAnswer" value = {this.state.questionAnswer} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/> */}
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="name">Solution</label>
                                                            {/* <input type="text" className="form-control" placeholder="Enter solution" name = "questionSolution" value = {this.state.questionSolution} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/> */}
                                                            <Editor
                                                                initialValue=""
                                                                init={{
                                                                height: 300,
                                                                menubar: false,
                                                                plugins: [
                                                                    'table image underline',
                                                                    'advlist autolink lists link image charmap print preview anchor',
                                                                    'searchreplace visualblocks code fullscreen',
                                                                    'insertdatetime media table paste code help wordcount'
                                                                ],
                                                                // plugins: [
                                                                //     'lists link image paste help wordcount'
                                                                // ],
                                                                toolbar:
                                                                    'table font-size undo redo | formatselect | bold italic underline backcolor | \
                                                                    alignleft aligncenter alignright alignjustify | \
                                                                    bullist numlist outdent indent | removeformat image | help'
                                                                }}
                                                                onChange={this.handleEditorChangeSolution}
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
                                                    <form onSubmit = {this.formEditQuestion} id = "createEditForm">
                                                        <div className="form-group">
                                                            <p>Selected Subject: {this.state.subjectName}</p>
                                                            <p>Selected Topic: {this.state.topicName}</p>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="name">Tag</label>
                                                            <input type="text" className="form-control" placeholder="Enter question tag" name = "updateQuestionTag" value = {this.state.updateQuestionTag} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="name">Question</label>
                                                            {/* <CKEditor
                                                                editor={ ClassicEditor }
                                                                data={this.state.updateQuestionName}
                                                                onChange={this.onEditorChange}
                                                            /> */}
                                                            <Editor
                                                                initialValue={this.state.updateQuestionName}
                                                                init={{
                                                                height: 300,
                                                                menubar: false,
                                                                plugins: [
                                                                    'image underline',
                                                                    'advlist autolink lists link image charmap print preview anchor',
                                                                    'searchreplace visualblocks code fullscreen',
                                                                    'insertdatetime media table paste code help wordcount'
                                                                ],
                                                                // plugins: [
                                                                //     'lists link image paste help wordcount'
                                                                // ],
                                                                toolbar:
                                                                    'table undo redo | formatselect | bold italic underline backcolor | \
                                                                    alignleft aligncenter alignright alignjustify | \
                                                                    bullist numlist outdent indent | removeformat image | help'
                                                                }}
                                                                onChange={this.handleEditorChange}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="name">Choices</label>
                                                            <div className = "row">
                                                                <div className = "col-md-6">
                                                                    <input type="text" className="form-control" placeholder="Choice A" name = "updateQuestionChoice1" value = {this.state.updateQuestionChoice1} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                                </div>
                                                                <div className = "col-md-6">
                                                                    <input type="text" className="form-control" placeholder="Choice B" name = "updateQuestionChoice2" value = {this.state.updateQuestionChoice2} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                                 </div>
                                                                <div className = "col-md-6">
                                                                    <input type="text" className="form-control" placeholder="Choice C" name = "updateQuestionChoice3" value = {this.state.updateQuestionChoice3} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                                </div>
                                                                <div className = "col-md-6">
                                                                    <input type="text" className="form-control" placeholder="Choice D" name = "updateQuestionChoice4" value = {this.state.updateQuestionChoice4} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="name">Answer</label>
                                                            <p><b>Current Answer:</b> {this.state.updateQuestionAnswer} </p>
                                                            <select className = "form-control" name = "updateQuestionAnswer" onChange = {this.onChangeText}  disabled = {(this.state.disabled)? "disabled" : ""}>
                                                                <option value = ""></option>
                                                                {this.state.updateQuestionChoice1 == "" ? "" : <option key = {this.state.updateQuestionChoice1} value = {this.state.updateQuestionChoice1}>{this.state.updateQuestionChoice1}</option>}
                                                                {this.state.updateQuestionChoice2 == "" ? "" : <option key = {this.state.updateQuestionChoice2} value = {this.state.updateQuestionChoice2}>{this.state.updateQuestionChoice2}</option>}
                                                                {this.state.updateQuestionChoice3 == "" ? "" : <option key = {this.state.updateQuestionChoice3} value = {this.state.updateQuestionChoice3}>{this.state.updateQuestionChoice3}</option>}
                                                                {this.state.updateQuestionChoice4 == "" ? "" : <option key = {this.state.updateQuestionChoice4} value = {this.state.updateQuestionChoice4}>{this.state.updateQuestionChoice4}</option>}                                                               
                                                            </select>
                                                            {/* <input type="text" className="form-control" placeholder="Enter Answer" name = "questionAnswer" value = {this.state.questionAnswer} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/> */}
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="name">Solution</label>
                                                            {/* <input type="text" className="form-control" placeholder="Enter solution" name = "updateQuestionSolution" value = {this.state.updateQuestionSolution} onChange = {this.onChangeText} required disabled = {(this.state.disabled)? "disabled" : ""}/> */}
                                                            <Editor
                                                                initialValue={this.state.updateQuestionSolution}
                                                                init={{
                                                                height: 300,
                                                                menubar: false,
                                                                plugins: [
                                                                    'font-size image underline',
                                                                    'advlist autolink lists link image charmap print preview anchor',
                                                                    'searchreplace visualblocks code fullscreen',
                                                                    'insertdatetime media table paste code help wordcount'
                                                                ],
                                                                // plugins: [
                                                                //     'lists link image paste help wordcount'
                                                                // ],
                                                                toolbar:
                                                                    'font-size undo redo | formatselect | bold italic underline backcolor | \
                                                                    alignleft aligncenter alignright alignjustify | \
                                                                    bullist numlist outdent indent | removeformat image | help'
                                                                }}
                                                                onChange={this.handleEditorChangeSolution}
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
                                                    this.props.questionInfo ?
                                                        <div>
                                                            <p>Subject Name:<b> {this.state.subjectName}</b></p>
                                                            <p>Topic Name:<b> {this.state.topicName}</b></p>
                                                            <p>Question Tag: <b>{this.props.questionInfo.data.tag}</b></p>
                                                            <div class="alert alert-secondary">
                                                                <div dangerouslySetInnerHTML={{ __html: this.props.questionInfo.data.question }} />
                                                            </div>
                                                            <p>Choices: </p>
                                                            <p><b>A. {this.props.questionInfo.data.choices[0]}</b></p>
                                                            <p><b>B. {this.props.questionInfo.data.choices[1]}</b></p>
                                                            <p><b>C. {this.props.questionInfo.data.choices[2]}</b></p>
                                                            <p><b>D. {this.props.questionInfo.data.choices[3]}</b></p>
                                                            <hr/>
                                                            <p>Answer: <b>{this.props.questionInfo.data.answer}</b></p>
                                                            <hr/>
                                                            <p>Solution:  <div dangerouslySetInnerHTML={{ __html: this.props.questionInfo.data.solution }} /></p>

                                                        </div> 
                                                     : <div><i class="fa fa-spinner fa-spin"></i> Loading content... </div>
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
                                                    this.state.subjectId !== "" && this.state.topicId !== "" && this.props.questionsLists  ?  <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'show', '')}><FontAwesomeIcon icon = {faPlus}/> Add new question</a> : ""
                                                }
                                            </small>
                                        </div>
                                        <div className="card-body">
                                            <div className = "row">
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
                                                                    <strong>Select Topic first</strong>
                                                                </div>
                                                            : 
                                                                            <ToolkitProvider
                                                                            keyField="id"
                                                                            data={ questionsArr }
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
    questionInfo: state.questions.info
})

export default connect(mapStateToProps, { 
    validateToken,
    fetchSubjects, 
    fetchTopic,
    fetchQuestions,
    newQuestion,
    fetchQuestionInfo,
    updateQuestion
})(QuestionsComponent);

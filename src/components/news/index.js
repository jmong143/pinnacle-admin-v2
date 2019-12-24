import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';
import NavbarComponent   from '../__layout/Navbar';
import SideNavComponent   from '../__layout/SideNav';
import { validateToken } from '../../actions/module/validateAdminActions';
import { fetchNews, newsInfo, newNews, newsUpdate, newsDelete } from '../../actions/module/newsActions';
import { uploadFile, getFile } from '../../actions/module/uploadActions';
import { notification } from '../__plugins/noty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faTrashAlt, faPlus, faTimes, faInfo } from '@fortawesome/free-solid-svg-icons';

import { Editor } from '@tinymce/tinymce-react'; 

// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import CKEditor from '@ckeditor/ckeditor5-react';
// The official CKEditor 5 instance inspector. It helps understand the editor view and model.
// import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
// The base editor class and features required to run the editor.
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Heading from '@ckeditor/ckeditor5-heading/src/heading';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
// import Table from '@ckeditor/ckeditor5-table/src/table';
// import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';




import BootstrapTable from 'react-bootstrap-table-next'
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Modal from '../__layout/Modal';
const { SearchBar, ClearSearchButton  } = Search;


// const editorConfiguration = {
//     plugins: [ Bold ],
//     toolbar: [ 'bold', ]
// };

// const editorConfig = {
//     plugins: [
//         // A set of editor features to be enabled and made available to the user.
//         Essentials, Heading, Bold, Italic, Underline, Paragraph, Table, TableToolbar
//     ],
//     toolbar: [
//         'heading',
//         '|',
//         'bold', 'italic', 'underline',
//         '|',
//         'insertTable',
//         '|',
//         'undo', 'redo'
//     ],
//     table: {
//         contentToolbar: [
//             'tableColumn',
//             'tableRow',
//             'mergeTableCells'
//         ]
//     }
// };

class NewsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cardStatus: false,
            cardActive: "",
            fileTargetValue: null,
            newsTitle: '',
            newsDescription: '',
            newsAuthor: '',
            updateLoad: true,
            updateNewsTitle: '',
            updateNewsDescription: '',
            updateNewsAuthor: '',
            isModalOpen: false,
            ckEditorValue: '',
            editorData: "<p>aaa</p>"
        }
        this.showCard = this.showCard.bind(this);
        this.formCreateNews = this.formCreateNews.bind(this);
        this.formUpdateNews = this.formUpdateNews.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.onEditorChange = this.onEditorChange.bind( this );

        this.handleEditorDataChange = this.handleEditorDataChange.bind( this );
        this.handleEditorInit = this.handleEditorInit.bind( this );
        }

        // A handler executed when the user types or modifies the editor content.
        // It updates the state of the application.
        handleEditorDataChange( evt, editor ) {
            this.setState( {
                editorData: editor.getData()
            } );
        }

        // A handler executed when the editor has been initialized and is ready.
        // It synchronizes the initial data state and saves the reference to the editor instance.
        handleEditorInit( editor ) {
            this.editor = editor;

            this.setState( {
                editorData: editor.getData()
            } );

            // CKEditor 5 inspector allows you to take a peek into the editor's model and view
            // data layers. Use it to debug the application and learn more about the editor.
            // CKEditorInspector.attach( editor );
        }

    
    
    componentDidMount(){
        if (localStorage.getItem("pinnacleAdmin") !== null) {
            this.props.validateToken(this.state).then(tokenValidate => {
                if(tokenValidate.payload.status !== 200){
                    this.props.history.push("/login");
                }else{
                    this.props.fetchNews();
                }
            });
        }else {
            this.props.history.push("/login");
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.lists){
            if(nextProps.lists.result == "failed") notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please refresh the page`)
        }
        if(nextProps.newsDetails){
            this.setState({updateNewsTitle:nextProps.newsDetails.data.title});
            this.setState({updateNewsDescription:nextProps.newsDetails.data.description});
            this.setState({updateNewsAuthor:nextProps.newsDetails.data.author});
            if(nextProps.newsDetails.data.imageUrl == "" || nextProps.newsDetails.data.imageUrl == null){
            }else{
                this.props.getFile(nextProps.newsDetails.data.imageUrl)
            }
            this.setState({disabled: false});
        }
        if(nextProps.addedNews){
            this.setState({disabled: false});
            this.setState({fileTargetValue: null});
            this.setState({newsTitle: ''});
            this.setState({newsDescription: ''});
            this.setState({newsAuthor: ''});   
        }
        // if(nextProps.deleteNewsProps){
        //     console.log(nextProps.deleteNewsProps)
        //     this.setState({isModalOpen: false});
        //     if(nextProps.deleteNewsProps.result === "success"){
        //         var deleteData = this.props.lists.data.items;
        //         deleteData.splice(nextProps.deleteNewsProps.data._id, 1)
        //         notification("success", `<i class = "fa fa-check"></i> ${nextProps.deleteNewsProps.message}`)
        //     }else{
        //         notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please try again`)
        //     }
        // }
    }

    showCard(todo, status, id){
        if(status == "show"){
            this.setState({cardStatus: true})
            this.setState({cardActive: todo})
            if(todo == "view"){
                this.setState({disabled: true});
                this.props.newsInfo(id);
            }else if(todo == "edit"){
                this.setState({disabled: true});
                this.setState({updateLoad: false});
                this.props.newsInfo(id);
            }
        }else{
            this.setState({cardStatus: false})
        }
    }

    onEditorChange( evt ) {
        if(this.state.cardActive === 'create'){
            // this.setState({ newsTitle: evt.editor.getData() });
            this.setState({ newsDescription: evt.target.getContent() });
        }else if(this.state.cardActive === 'edit'){
            // this.setState({ updateNewsTitle: evt.editor.getData() });
            this.setState({ updateNewsDescription: evt.target.getContent() });
        }
        
    }

    formCreateNews(e){
        e.preventDefault();
        if(this.state.fileTargetValue == null){
            notification("error", `<i class = "fa fa-info-circle"></i> Upload news image first`)
        }else{
            this.setState( {disabled: !this.state.disabled} )
            this.props.uploadFile(this.state.fileTargetValue).then(data => {
                  
                if('file' in data.payload){
                    console.log(data.payload)
                    let form = {
                        "title":  this.state.newsTitle,
                        "description": this.state.newsDescription,
                        "author": this.state.newsAuthor,
                        "imageUrl": data.payload.file.filename
                    }
                    this.props.newNews(form);
                    notification("success", `<i class = "fa fa-info-circle"></i> Successfully added news`)
                    this.props.fetchNews();
                    this.setState({cardStatus: false});
                }else{
                    this.setState({disabled: false});
                    notification("error", `<i class = "fa fa-info-circle"></i> ${data.payload.message}`)
                }
            
            });
        }

    }

    formUpdateNews(e){
        e.preventDefault();
        this.setState({disabled: true});
        let file = this.state.fileTargetValue;
        let form = {
            title: this.state.updateNewsTitle,
            description: this.state.updateNewsDescription,
            author: this.state.updateNewsAuthor,
            imageUrl: this.props.newsDetails.data.imageUrl,
            isArchive: false
        }
        if(file == null || file == ""){
            this.props.newsUpdate(this.state, this.props.newsDetails.data.id, form).then(sub => {
                let response = sub.payload.data;
                console.log(">>>>>>>>>>>>>>>>> " + JSON.stringify(response))
                this.props.lists.data.items.forEach( data => {
                    if(data.id == response._id){
                        data.title=response.title
                        data.author=response.author
                    }
                });
                this.props.fetchNews();
                this.setState({updateNewsTitle: ''});
                this.setState({updateNewsDescription: ''});
                this.setState({updateNewsAuthor: ''});
                this.setState({fileTargetValue: null});                
                this.setState({disabled: false});
                this.setState({cardStatus: false});
                notification("success", `<i class = "fa fa-check"></i> ${sub.payload.message}`);
            });
        }else{
            this.props.uploadFile(file).then(data => {
                if('file' in data.payload){
                    form.imageUrl = data.payload.file.filename;
                    this.props.newsUpdate(this.state, this.props.newsDetails.data.id, form).then(sub => {
                        let response = sub.payload.data;
                        this.props.lists.data.items.forEach( data => {
                            if(data.id == response._id){
                                data.title=response.title
                                data.author=response.author
                            }
                        });
                        this.props.fetchNews();
                        this.setState({updateNewsTitle: ''});
                        this.setState({updateNewsDescription: ''});
                        this.setState({updateNewsAuthor: ''});
                        this.setState({fileTargetValue: null});                
                        this.setState({disabled: false});
                        this.setState({cardStatus: false});
                        notification("success", `<i class = "fa fa-check"></i> ${sub.payload.message}`);
                    });

                }else{
                  this.setState({disabled: false});
                  notification("error", `<i class = "fa fa-info-circle"></i> ${data.payload.message}`)
                }
            });
        }
    }

    onChangeFile(event){
        let file = event.target.files[0];
        if(file == null || file == ""){
        }else{
            this.setState({fileTargetValue: file})
        }
    }

    toggleState = (id) => {
        // alert(window.location.href)
        if (typeof id === 'undefined') {
            this.setState({ isModalOpen: false});
        }else{
            this.props.newsInfo(id);
            this.setState({ isModalOpen: !this.state.isModalOpen});
        }
    };

    render() {
        let items = new Array();
        if(this.props.lists) {
            this.props.lists.data.items.forEach( item => {
                let str = item.title;
                if(item.title === null || item.title === ""){
                }else{
                    if(str.length > 30) str = str.substring(0,30) + '...';
                }
                

                items.push({
                    title: str,
                    author: item.author,
                    createdBy: item.createdBy,
                    isArchive: item.isArchive === true ? <span className="badge badge-danger">true</span> : <span className="badge badge-success">false</span> ,
                    action: <div className = "">
                                <button type="button"  className="btn btn-primary btn-sm" onClick={() =>  this.showCard('view', 'show', item.id)}> <FontAwesomeIcon icon = {faEye}/></button> &nbsp;
                                <button type="button"  className="btn btn-success btn-sm" onClick={() =>  this.showCard('edit', 'show', item.id)}> <FontAwesomeIcon icon = {faEdit}/></button> &nbsp;
                                <button type="button"  className="btn btn-danger btn-sm" onClick={() =>  this.toggleState(item.id)}> <FontAwesomeIcon icon = {faTrash}/></button>
                            </div>
                })
            });
        }

        let columns = [
            { dataField: 'title', text: 'Title', style: { width: '450px' }},
            { dataField: 'author', text: 'Author', style: { width: '300px' }},
            { dataField: 'createdBy', text: 'Created By', style: { width: '300px' }},
            { dataField: 'isArchive', text: 'Is Deleted'},
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
                            <h2>News</h2>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                                <li className="breadcrumb-item">News</li>
                            </ol>
                            <div className = "row">
                                <div className = {this.state.cardStatus == true ? "col-md-7" : "col"}>
                                <div className="card card-custom-border">
                                    <div className="card-header">
                                        Content box
                                        <small className = "float-right">
                                            {
                                                this.state.cardStatus == true ?  "" :  <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'show', '')}><FontAwesomeIcon icon = {faPlus}/> Add new news</a>
                                            }
                                        </small>
                                    </div>
                                        <div className="card-body">

                                        <div>
                                            {this.state.isModalOpen && (
                                            <Modal id="modal" isOpen={this.state.isModalOpen} onClose={this.toggleState} title = "Delete" type = "delete-news" data = {this.props.newsDetails}>
                                                <div className="box-body">Are you sure you want to delete this <b> {this.state.updateNewsTitle ? this.state.updateNewsTitle : ""} </b>?</div>
                                            </Modal>
                                            )}
                                        </div>
                                        
                                            <ToolkitProvider keyField="id" data={ items } columns={ columns } search >
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
                                        <div>
                                    </div>
                                    </div>
                                </div>
                            </div>

                            { this.state.cardStatus == true ?
                            <div className = "col-md-5">
                                <div className="card border-primary">
                                    <div className="card-header">
                                        {this.state.cardActive == "view" ? "News Information" : ""}
                                        {this.state.cardActive == "create" ? "Create new news": ""}
                                        {this.state.cardActive == "edit" ? "Edit news": ""}
                                        <small className = "float-right">
                                            <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'hide')}>
                                                <FontAwesomeIcon icon = {faTimes}/> Close
                                            </a>
                                        </small>
                                    </div>
                                    <div className="card-body">
                                        {this.state.cardActive == "create" ?
                                            <form onSubmit = {this.formCreateNews} id = "createNewsForm">
                                            <div className="form-group">
                                                <label for="name">Title</label>
                                                {/* data={this.state.editorData} */}

                                                {/* <CKEditor
                                                    editor={ClassicEditor}
                                                    data={this.state.editorData}
                                                    config={this.editorConfig}
                                                    onChange={this.handleEditorDataChange}
                                                    onInit={this.handleEditorInit}
                                                /> */}
                                                

                                                 {/* <CKEditor
                                                    editor={ ClassicEditor }
                                                    data="<p>Hello from CKEditor 5!</p>"
                                                    onInit={ editor => {
                                                        // You can store the "editor" and use when it is needed.
                                                        console.log( 'Editor is ready to use!', editor );
                                                    } }
                                                    onChange={ ( event, editor ) => {
                                                        const data = editor.getData();
                                                        console.log( { event, editor, data } );
                                                    } }
                                                    onBlur={ ( event, editor ) => {
                                                        console.log( 'Blur.', editor );
                                                    } }
                                                    onFocus={ ( event, editor ) => {
                                                        console.log( 'Focus.', editor );
                                                    } }
                                                />  */}

                                                    {/* config={ {
                                                        
                                                        toolbar: [ [ 'bold', 'italic', 'underline'] ]
                                                    } } */}
                                                    {/* old use 
                                                    <CKEditor
                                                        editor={ ClassicEditor }
                                                        data="<p>Hello from CKEditor 5!</p>"

                                                        onInit={ editor => {
                                                            // You can store the "editor" and use when it is needed.
                                                            console.log( 'Editor is ready to use!', editor );
                                                        } }
                                                        onChange={ ( event, editor ) => {
                                                            const data = editor.getData();
                                                            console.log( { event, editor, data } );
                                                        } }
                                                        onBlur={ ( event, editor ) => {
                                                            console.log( 'Blur.', editor );
                                                        } }
                                                        onFocus={ ( event, editor ) => {
                                                            console.log( 'Focus.', editor );
                                                        } }
                                                    /> */}
                                                    <input type="text" className="form-control" placeholder="Enter news name" name = "newsTitle" value = {this.state.newsTitle} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/> 
                                                    
                                                {/* <CKEditor
                                                    editor={ ClassicEditor }
                                                    data=""
                                                    onChange={this.onEditorChange}
                                                /> */}
                                                {/* <input type="text" className="form-control" placeholder="Enter news name" name = "newsTitle" value = {this.state.newsTitle} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/> */}
                                            </div>
                                            <div className="form-group">
                                                <label for="description">Description </label>
                                                {/* <textarea placeholder = "Enter description" className="form-control" name = "newsDescription" value = {this.state.newsDescription} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/> */}
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
                                                <label for="name">Author</label>
                                                <input type="text" className="form-control" placeholder="Enter author's name" name = "newsAuthor" value = {this.state.newsAuthor} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                            </div>
                                            <div className="form-group">
                                                <label for="icon">Banner</label>
                                                <input type="file" name="file" id = "fileSelect" className="form-control-file" onChange={this.onChangeFile} disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                {this.state.fileLoad == true ? <img src = {this.state.fileData} className = "img-thumb center"/> : ""}
                                            </div>
                                            <div className="form-group">
                                                <button type="submit" className="btn btn-primary btn-block" disabled = {(this.state.disabled)? "disabled" : ""}>
                                                  {this.state.disabled ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Submit'}
                                                </button>
                                            </div>
                                            </form>
                                        : ""}

                                        {this.state.cardActive == "edit" ?
                                            <div>
                                                { this.props.newsInfo ? 

                                                    <form onSubmit = {this.formUpdateNews} id = "updateSubjectForm">
                                                        <div className="form-group">
                                                            <label for="name">News Title</label>
                                                            {/* <CKEditor
                                                                data={this.state.updateNewsTitle}
                                                                onChange={this.onEditorChange}
                                                            /> */}
                                                            <input type="text" className="form-control" placeholder="Enter news name" name = "updateNewsTitle" value = {this.state.updateNewsTitle} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/> 
                                                             
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="description">Description </label>
                                                            {/* <textarea placeholder = "Enter description" className="form-control" name = "updateNewsDescription" value = {this.state.updateNewsDescription} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/> */}
                                                            <Editor
                                                                initialValue={this.state.updateNewsDescription}
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
                                                            <label for="name">Author</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                placeholder="Author" 
                                                                name = "updateNewsAuthor" 
                                                                value = {this.state.updateNewsAuthor} 
                                                                onChange = {this.onChange} 
                                                                required
                                                                disabled = {(this.state.disabled)? "disabled" : ""}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="icon">Update Banner</label>
                                                            <input type="file" name="file" id = "fileSelect" className="form-control-file" onChange={this.onChangeFile} disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                        <hr/>
                                                        {this.props.newsDetails ? 
                                                            this.props.newsDetails.data.imageUrl ? 
                                                                <div>
                                                                    {this.props.getIcon 
                                                                    ? 
                                                                        <img src = {this.props.getIcon} className = "img-thumb"/> 
                                                                    : 
                                                                        <div className="spinner-border text-default" role="status"></div>
                                                                    } 
                                                                </div>
                                                            : <div className = "d-flex align-items-center flex-column"><span className="badge badge-warning">No image uploaded for this content</span></div>
                                                         : "" }                                                        
                                                        <hr/>
                                                        <div className="form-group">
                                                            <button type="submit" className="btn btn-primary btn-block" disabled = {(this.state.disabled)? "disabled" : ""}>
                                                            {this.state.disabled ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Update'}
                                                            </button>
                                                        </div>
                                                        </form>
                                                :  
                                                <div className = "d-flex align-items-center flex-column">
                                                    <div className="spinner-border text-primary" role="status"></div>
                                                </div>
                                                }
                                            </div>

                                        : ""}

                                        {this.state.cardActive == "view" ?
                                        <div>
                                                { this.props.newsDetails ? 
                                                    <div className="row">
                                                        <div className="col-md-12 post">
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <h3>{this.props.newsDetails.data.title}</h3>
                                                                    <hr/>
                                                                    
                                                                    <h6>Author: <small>{this.props.newsDetails.data.author}</small></h6>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col">
                                                                    {/* <p>{this.props.newsDetails.data.description}</p> */}
                                                                    <p dangerouslySetInnerHTML={{ __html: this.props.newsDetails.data.description }} />
                                                                    <div className = " d-flex align-items-center flex-column"> 
                                                                        {this.props.newsDetails.data.imageUrl ? 
                                                                            <div>
                                                                                {this.props.getIcon 
                                                                                ? 
                                                                                    <img src = {this.props.getIcon} className = "img-thumb"/> 
                                                                                : 
                                                                                    <div className="spinner-border text-default" role="status"></div>
                                                                                } 
                                                                            </div>
                                                                        : <div className = "d-flex align-items-center flex-column"><span className="badge badge-warning">No icon uploaded for this content</span></div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                :  
                                                <div className = "d-flex align-items-center flex-column">
                                                    <div className="spinner-border text-primary" role="status"></div>
                                                </div>
                                                }
                                            </div>
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

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    
}

// SubjectComponent.propTypes = {
//     fetchSubjects: PropTypes.func.isRequired,
//     newSubject: PropTypes.func.isRequired,
//     subjectUpdate: PropTypes.func.isRequired,
//     subjectDelete: PropTypes.func.isRequired,
//     uploadFile: PropTypes.func.isRequired,
//     getFile: PropTypes.func.isRequired,
//     subjects:  PropTypes.array.isRequired,
//     fileUploaded: PropTypes.object,
//     subjectInfo: PropTypes.func.isRequired,
//     subjectInfoProps: PropTypes.object,
//     addedSubject: PropTypes.object,
//     updateSubject: PropTypes.object,
//     deleteSubjectProps: PropTypes.object
// };

const mapStateToProps = state => ({
    validateToken: state.validateToken.testData,
    lists: state.news.lists,
    newsDetails: state.news.list,
    getIcon: state.file.image,
    addedNews: state.news.addedNews,
    updateNews: state.news.newsUpdate,
    deleteNewsProps: state.news.newsDelete
})

export default connect(mapStateToProps, { 
    validateToken,
    fetchNews,
    newsInfo,
    getFile,
    uploadFile,
    newNews,
    newsUpdate,
    newsDelete
})(NewsComponent);

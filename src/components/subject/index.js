import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';
import NavbarComponent   from '../__layout/Navbar';
import SideNavComponent   from '../__layout/SideNav';
import { validateToken } from '../../actions/module/validateAdminActions';
import { fetchSubjects, subjectInfo, newSubject, subjectUpdate, subjectDelete } from '../../actions/module/subjectActions';
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

class SubjectComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "data": "",
            "subjects": [],
            "subject": null,
            "subjectCode": "",
            "subjectName": "",
            "subjectDescription": "",
            "subjectFileName": "",
            "updateSubjectCode": "",
            "updateSubjectName": "",
            "updateSubjectDescription": "",
            "updateLoad": true,
            "subjectFileName": "",
            "createSubject": false,
            "cardStatus": false,
            "cardActive": "",
            "fileData": "",
            "fileLoad": false,
            "spinLoad": false,
            "disabled": false,
            "fileTargetValue": null,
            "isModalOpen": false,
            "deleteData" : {}
        };
        this.onChange = this.onChange.bind(this);
        this.formCreateSubject = this.formCreateSubject.bind(this);
        this.formUpdateSubject = this.formUpdateSubject.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
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
        if(nextProps.fileUploaded){
            // let fileName = nextProps.fileUploaded.file.filename
            // this.setState({subjectFileName: fileName})
        }
        if(nextProps.getIcon){
            // console.log(nextProps.getIcon)
        }
        if(nextProps.addedSubject){
            this.setState({disabled: false});
            this.setState({subjectCode: ''});
            this.setState({subjectName: ''});
            this.setState({subjectDescription: ''});
            this.setState({subjectFileName: ''});
            this.setState({fileTargetValue: null});
            // this.state.fileTargetValue == null ? document.getElementById("fileSelect").value = "" : ""
            // this.props.lists.subjects.unshift({
            //     code: nextProps.addedSubject.data.code,
            //     name: nextProps.addedSubject.data.name,
            //     action: <div className = "">
            //                 <button type="button"  className="btn btn-primary btn-sm" onClick={() =>  this.showCard('view', 'show', nextProps.addedSubject.data._id)}> <FontAwesomeIcon icon = {faEye}/></button> &nbsp;
            //                 <button type="button"  className="btn btn-success btn-sm" onClick={() =>  this.showCard('edit', 'show', nextProps.addedSubject.data._id)}> <FontAwesomeIcon icon = {faEdit}/></button> &nbsp;
            //                 <button type="button"  className="btn btn-danger btn-sm" onClick={() =>  this.btnActionClick('delete', nextProps.addedSubject.data._id)}> <FontAwesomeIcon icon = {faTrash}/></button>
            //             </div>
            // })
        }
        if(nextProps.subjectInfoProps){
            console.log(nextProps.subjectInfoProps)
            this.setState({disabled: false});
            this.setState({updateSubjectCode: nextProps.subjectInfoProps.data.code})
            this.setState({updateSubjectName: nextProps.subjectInfoProps.data.name})
            this.setState({updateSubjectDescription: nextProps.subjectInfoProps.data.description})
            console.log(".....>> " + this.state.updateSubjectName);
            if(nextProps.subjectInfoProps.data.imageUrl == "" || nextProps.subjectInfoProps.data.imageUrl == null){
            }else{
                this.props.getFile(nextProps.subjectInfoProps.data.imageUrl)
            }
        }
        // if(nextProps.deleteSubjectProps){
        //     console.log(nextProps.deleteSubjectProps)
        //     if(nextProps.deleteSubjectProps.result === "success"){
        //         var deleteData = this.props.lists.subjects;
        //         deleteData.splice(nextProps.deleteSubjectProps.data._id, 1)
        //         this.toggleState();
        //         notification("success", `<i class = "fa fa-check"></i> ${nextProps.deleteSubjectProps.message}`)
        //     }else{
        //         this.toggleState();
        //         notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please try again`)
        //     }
        //     // this.setState({updateSubjectCode: ''});
        //     // this.setState({updateSubjectName: ''});
        //     // this.setState({updateSubjectDescription: ''});
        //     // this.setState({subjectFileName: ''});
        //     // this.setState({fileTargetValue: null});
        // }
    }
    handleFileRead(fileeRead){
        const content = fileeRead.result
    }

    render() {
        let items = new Array();
        if(this.props.lists){
            this.props.lists.subjects.forEach( subj => {
                items.push({
                    code: subj.code,
                    name: subj.name,
                    action: <div className = "">
                                <button type="button"  className="btn btn-primary btn-sm" onClick={() =>  this.showCard('view', 'show', subj.id)}> <FontAwesomeIcon icon = {faEye}/></button> &nbsp;
                                <button type="button"  className="btn btn-success btn-sm" onClick={() =>  this.showCard('edit', 'show', subj.id)}> <FontAwesomeIcon icon = {faEdit}/></button> &nbsp;
                                <button type="button"  className="btn btn-danger btn-sm" onClick={() =>  this.toggleState(subj.id)}> <FontAwesomeIcon icon = {faTrash}/></button>
                            </div>
                })
            });
        }
          let columns = [
            { dataField: 'code', text: 'Code', width: 1 },
            { dataField: 'name', text: 'Name',   style: { width: '450px' }, searchable: true},
            { dataField: 'action', text: 'Action', style: { width: '200px' } }
        ]
        var bTableOptions = {
            clearSearch: true,
            noDataText: (<i className="fa fa-circle-o-notch fa-spin" style={{'fontSize': '24px'}}></i>)
        };
        return (
            <div>

                <SideNavComponent/>
                <div className="main">
                    <NavbarComponent/>
                        {/* <div className=""> */}
                    <div className="container">
                    <div className = "col">
                    <br/>
                    <h2>Subjects</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                        <li className="breadcrumb-item">Subjects</li>
                    </ol>
                    <div className = "row">
                        <div className = {this.state.cardStatus == true ? "col-md-7" : "col"}>
                            <div className="card card-custom-border">
                                <div className="card-header">
                                    Content box
                                    <small className = "float-right">
                                        {
                                            this.state.cardStatus == true ?  "" :  <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'show', '')}><FontAwesomeIcon icon = {faPlus}/> Add new subject</a>
                                        }
                                    </small>
                                </div>
                                <div className="card-body">
                                    
                                    

                                <div>
                                    {this.state.isModalOpen && (
                                    <Modal id="modal" isOpen={this.state.isModalOpen} onClose={this.toggleState} title = "Delete" type = "delete-subject" data = {this.props.subjectInfoProps}>
                                        <div className="box-body">Are you sure you want to delete this <b> {this.state.updateSubjectName ? this.state.updateSubjectName : ""} </b>?</div>
                                    </Modal>
                                    )}
                                </div>

                                
                                    <ToolkitProvider
                                    keyField="id"
                                   
                                    data={ items }
                                    columns={ columns }
                                    search
                                    >
                                    {
                                        props => (
                                        <div>
                                            <SearchBar { ...props.searchProps } />
                                            {/* <ClearSearchButton { ...props.searchProps } /> */}
                                            <hr />
                                            <BootstrapTable { ...props.baseProps } options = { bTableOptions } pagination={ paginationFactory() }/>
                                        </div>
                                        )
                                    }
                                    </ToolkitProvider>
                                </div>
                            </div>
                        </div>

                        { this.state.cardStatus == true ?
                            <div className = "col-md-5">
                                <div className="card border-primary">
                                    <div className="card-header">
                                        {this.state.cardActive == "view" ? "Subject Information" : ""}
                                        {this.state.cardActive == "create" ? "Create new subject": ""}
                                        {this.state.cardActive == "edit" ? "Edit subject": ""}
                                        <small className = "float-right">
                                            <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'hide')}>
                                                <FontAwesomeIcon icon = {faTimes}/> Close
                                            </a>
                                        </small>
                                    </div>
                                    <div className="card-body">
                                        {this.state.cardActive == "create" ?
                                            <form onSubmit = {this.formCreateSubject} id = "createSubjectForm">
                                            <div className="form-group">
                                                <label for="name">Subject Name</label>
                                                <input type="text" className="form-control" placeholder="Enter subject name" name = "subjectName" value = {this.state.subjectName} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                            </div>
                                            <div className="form-group">
                                                <label for="code">Subject Code</label>
                                                <input type="text" className="form-control" placeholder="Enter subject code" name = "subjectCode"  value = {this.state.subjectCode} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                            </div>
                                            <div className="form-group">
                                                <label for="description">Description </label>
                                                <textarea placeholder = "Enter description" className="form-control" name = "subjectDescription" value = {this.state.subjectDescription} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                            </div>
                                            <div className="form-group">
                                                <label for="icon">Icon</label>
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
                                        
                                        {this.state.cardActive == "view" ?
                                            <div>
                                                { this.props.subjectInfoProps ? 
                                                    <div className="row">
                                                        <div className="col-md-12 post">
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <h5><strong className = "subject-title">{this.props.subjectInfoProps.data.name}</strong></h5>
                                                                    <h6>Code: <small>{this.props.subjectInfoProps.data.code}HHH</small></h6>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col">
                                                                    <p>{this.props.subjectInfoProps.data.description}</p>
                                                                    <div className = " d-flex align-items-center flex-column"> 
                                                                        {this.props.subjectInfoProps.data.imageUrl ? 
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


                                        {this.state.cardActive == "edit" ?
                                            <div>
                                                { this.props.subjectInfoProps ? 

                                                    <form onSubmit = {this.formUpdateSubject} id = "updateSubjectForm">
                                                        <div className="form-group">
                                                            <label for="name">Subject Name</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                placeholder="Enter subject name" 
                                                                name = "updateSubjectName" 
                                                                value = {this.state.updateSubjectName} 
                                                                onChange = {this.onChange} 
                                                                required
                                                                disabled = {(this.state.disabled)? "disabled" : ""}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="code">Subject Code</label>
                                                            <input type="text" className="form-control" placeholder="Enter subject code" name = "updateSubjectCode"  value = {this.state.updateSubjectCode} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="description">Description </label>
                                                            <textarea placeholder = "Enter description" className="form-control" name = "updateSubjectDescription" value = {this.state.updateSubjectDescription} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="icon">Update Icon</label>
                                                            <input type="file" name="file" id = "fileSelect" className="form-control-file" onChange={this.onChangeFile} disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                        <hr/>
                                                        {this.state.updateLoad == false ? 
                                                            this.props.subjectInfoProps.data.imageUrl ? 
                                                                <div className = "d-flex align-items-center flex-column">
                                                                    {this.props.getIcon 
                                                                    ? 
                                                                        <div><b>Current icon:</b> <img src = {this.props.getIcon} className = "img-thumb"/> </div>
                                                                    : 
                                                                        <div className="spinner-border text-default" role="status"></div>
                                                                    } 
                                                                </div>
                                                            : <div className = "d-flex align-items-center flex-column"><span className="badge badge-warning">No icon uploaded</span></div>
                                                        : ""}
                                                        
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


                                    </div>
                                </div>
                            </div>
                        : ""}
                    </div>

                    </div>


                    </div>
                    {/* </div> */}
                </div>
            </div>
        )
    }

    toggleState = (id) => {
        // alert(window.location.href)
        if (typeof id === 'undefined') {
            this.setState({ isModalOpen: false});
        }else{
            this.props.subjectInfo(id);
            this.setState({ isModalOpen: !this.state.isModalOpen});
        }
    };
    formCreateSubject(e){
        e.preventDefault();
        let subjectName = this.state.subjectName;
        let subjectCode = this.state.subjectCode;
        let subjectDescription = this.state.subjectDescription;
        let subjectFileName = this.state.subjectFileName;
        if(this.state.fileTargetValue == null){
              notification("error", `<i class = "fa fa-info-circle"></i> Upload subject icon first`)
        }else{
          this.setState( {disabled: !this.state.disabled} )
          this.props.uploadFile(this.state.fileTargetValue).then(data => {
              
            if('file' in data.payload){
                let form = {
                "name":  subjectName,
                "code": subjectCode,
                "description": subjectDescription,
                "imageUrl": data.payload.file.filename
                }
                this.props.newSubject(form);
                notification("success", `<i class = "fa fa-info-circle"></i> Successfully added new subject`)
            }else{
                this.setState({disabled: false});
                notification("error", `<i class = "fa fa-info-circle"></i> ${data.payload.message}`)
            }
            this.props.fetchSubjects();
          });
        }
    }

    formUpdateSubject(e){
        e.preventDefault();
        this.setState({disabled: true});
        this.setState({updateLoad:  false})
        let file = this.state.fileTargetValue;
        let form = {
            code: this.state.updateSubjectCode,
            name: this.state.updateSubjectName,
            description: this.state.updateSubjectDescription,
            imageUrl: this.props.subjectInfoProps.data.imageUrl,
            isArchive: false
        };
        if(file == null || file == ""){
            this.props.subjectUpdate(this.state, this.props.subjectInfoProps.data.id, form).then(sub => {
                let response = sub.payload.data;
                this.props.lists.subjects.forEach( subj => {
                    if(subj.id == response._id){
                        subj.name=response.name
                        subj.code=response.code
                    }
                });
                this.setState({updateSubjectCode: ''});
                this.setState({updateSubjectName: ''});
                this.setState({updateSubjectDescription: ''});
                this.setState({subjectFileName: ''});
                this.setState({fileTargetValue: null});
                

                this.setState({disabled: false});
                notification("success", `<i class = "fa fa-check"></i> ${sub.payload.message}`);
            });
        }else{
            this.props.uploadFile(file).then(data => {
                if('file' in data.payload){
                    form.imageUrl = data.payload.file.filename;
                    this.props.subjectUpdate(this.state, this.props.subjectInfoProps.data.id, form).then(sub => {
                        let response = sub.payload.data;
                        this.props.lists.subjects.forEach( subj => {
                            if(subj.id == response._id){
                                subj.name=response.name
                                subj.code=response.code
                            }
                        });
                        this.setState({updateSubjectCode: ''});
                        this.setState({updateSubjectName: ''});
                        this.setState({updateSubjectDescription: ''});
                        this.setState({subjectFileName: ''});
                        this.setState({fileTargetValue: null});
                        // this.state.fileTargetValue == null ? document.getElementById("fileSelect").value = "" : ""
                        
                        
                        this.setState({disabled: false});
                        
                        notification("success", `<i class = "fa fa-check"></i> ${sub.payload.message}`);
                    });
                }else{
                  this.setState({disabled: false});
                  notification("error", `<i class = "fa fa-info-circle"></i> ${data.payload.message}`)
              }     
            });
        }
        this.setState({updateLoad:  true})
        
        // if(file == null){
            // console.log(">>>>>>>>> " + JSON.stringify(form))
            // this.props.subjectUpdate(this.props.subjectInfoProps.id, form);
            // this.props.subjectUpdate(this.state, this.props.subjectInfoProps.data.id, form).then(sub => {
            //     console.log("hays.>> " + JSON.stringify(sub))
            //     if(sub.payload.result == "success"){
            //         console.log("AASAS")
            //         this.props.lists.subjects.forEach( subj => {
            //             if(subj.id == sub.payload.data._id){
            //                 subj.name=sub.details.name
            //                 subj.code=sub.details.code
            //             }
            //         });
            //         this.setState({disabled: false});
            //         this.setState({updateSubjectCode: ''});
            //         this.setState({updateSubjectName: ''});
            //         this.setState({updateSubjectDescription: ''});
            //         this.setState({subjectFileName: ''});
            //         this.setState({fileTargetValue: null});
            //         notification("success", `<i class = "fa fa-check"></i> ${sub.message}`);
            //     }else if(sub.payload.result == "failed"){
            //         notification("success", `<i class = "fa fa-check"></i> ${sub.message}`);
            //     }
            // });
        // }else{
            // this.props.uploadFile(file).then(data => {
            //     if('file' in data.payload){
            //         form.imageUrl = data.payload.file.filename;
            //         this.props.subjectUpdate(this.props.subjectInfoProps.id, form);
            //   }else{
            //       this.setState({disabled: false});
            //       notification("error", `<i class = "fa fa-info-circle"></i> ${data.payload.message}`)
            //   }
                    
            // });
        // }
        // console.log(file)
    }

    showCard(todo, status, id){
        if(status == "show"){
            this.setState({cardStatus: true})
            this.setState({cardActive: todo})
            if(todo == "view"){
                this.setState({disabled: true});
                this.props.subjectInfo(id);
            }else if(todo == "edit"){
                this.setState({disabled: true});
                this.setState({updateLoad: false});
                this.props.subjectInfo(id);
            }
        }else{
            this.setState({cardStatus: false})
        }
    }

    btnActionClick(mode, row){
        console.log(mode + ' - ' + row.id);
    }

    onChange(e){
        // console.log(e.target.name + " : " + e.target.value)
        this.setState({[e.target.name]: e.target.value})
        // console.log(this.state.updateSubjectCode)
    }

    onChangeFile(event){
      let file = event.target.files[0];
      if(file == null || file == ""){
      }else{
        this.setState({fileTargetValue: file})
      }
    }
}

SubjectComponent.propTypes = {
    fetchSubjects: PropTypes.func.isRequired,
    newSubject: PropTypes.func.isRequired,
    subjectUpdate: PropTypes.func.isRequired,
    subjectDelete: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    getFile: PropTypes.func.isRequired,
    subjects:  PropTypes.array.isRequired,
    fileUploaded: PropTypes.object,
    subjectInfo: PropTypes.func.isRequired,
    subjectInfoProps: PropTypes.object,
    addedSubject: PropTypes.object,
    updateSubject: PropTypes.object,
    deleteSubjectProps: PropTypes.object
};

const mapStateToProps = state => ({
    validateToken: state.validateToken.testData,
    lists: state.subjects.items.data,
    addedSubject: state.subjects.subject,
    fileUploaded: state.file.data,
    getIcon: state.file.image,
    subjectInfoProps: state.subjects.subjectInfo,
    updateSubjectProps: state.subjects.subjectUpdate,
    deleteSubjectProps: state.subjects.subjectDelete
})

export default connect(mapStateToProps, { 
    validateToken, 
    fetchSubjects, 
    uploadFile, 
    getFile, 
    subjectInfo, 
    newSubject, 
    subjectUpdate,
    subjectDelete 
})(SubjectComponent);
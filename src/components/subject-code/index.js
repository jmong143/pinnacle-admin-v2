import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';
import NavbarComponent   from '../__layout/Navbar';
import SideNavComponent   from '../__layout/SideNav';
import { validateToken } from '../../actions/module/validateAdminActions';
import { fetchSubjects } from '../../actions/module/subjectActions';
import { 
    fetchSubjectCode, 
    newSubjectCode, 
    fetchSubjectCodeInfo, 
    updateSubjectCode,
    resendSubjectCode
} from '../../actions/module/subjectCodeActions';
import { notification } from '../__plugins/noty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faEnvelope ,faPlus, faTimes, faInfo } from '@fortawesome/free-solid-svg-icons';
import BootstrapTable from 'react-bootstrap-table-next'
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Modal from '../__layout/Modal';
import Moment from 'react-moment';
import 'moment-timezone';
const { SearchBar, ClearSearchButton  } = Search;

class SubjectCodeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "cardStatus": false,
            "isModalOpen": false,
            "cardActive": "",
            "subjectCodeType": "single",
            "subjectCodeEmail": "",
            "subjectOrgName": "",
            "subjectTotalCode": "",
            "selectedSubjects": [],
            "updateSelectedSubjects": []

        };
        this.onChange = this.onChange.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.formSubjectCode = this.formSubjectCode.bind(this);
        this.addSubject = this.addSubject.bind(this);
    }

    componentDidMount(){
        if (localStorage.getItem("pinnacleAdmin") !== null) {
            this.props.validateToken(this.state).then(tokenValidate => {
                if(tokenValidate.payload.status !== 200){
                    this.props.history.push("/login");
                }else{
                    this.props.fetchSubjectCode();
                }
            });
        }else {
            this.props.history.push("/login");
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.subjectCodeInfo){
            this.setState({disabled: false})
            // var selected = this.state.updateSelectedSubjects;
            // nextProps.subjectCodeInfo.data.subjects.forEach(data => {
            //     console.log(data)
            //     var joined = selected.concat(data.subjectId);
            //     console.log("aa>> " + joined)
            //     this.setState({ updateSelectedSubjects: joined })
            // })
            // console.log(">>>> "  + JSON.stringify(this.state.updateSelectedSubjects))
        }
    }

    showCard(todo, status, id){
        if(status == "show"){
            this.setState({cardStatus: true})
            this.setState({cardActive: todo})
            this.props.fetchSubjects();
            if(todo == "view"){
                this.setState({disabled: true});
                this.props.fetchSubjectCodeInfo(id);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }else if(todo == "edit"){
                this.setState({ updateSelectedSubjects: new Array() })
                this.setState({disabled: true});
                this.setState({updateLoad: false});
                this.props.fetchSubjectCodeInfo(id);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }else{
            this.setState({cardStatus: false})
        }
    }

    onChangeType(e){
        console.log(e.target.value)
        this.setState({subjectCodeType: e.target.value})
    }
    
    onChange(e){
        console.log(e.target.name + " " + e.target.value)
        this.setState({[e.target.name]: e.target.value})
    }

    btnSelectSubject(subject){
        var selected = this.state.selectedSubjects;
        var joined = selected.concat(subject.id);
        if(selected.includes(subject.id)){
            console.log("IS HERE")
            var index = selected.indexOf(subject.id);
            if (index > -1) {
                selected.splice(index, 1);
                this.setState({ selectedSubjects: selected })
            }
        }else{
            this.setState({ selectedSubjects: joined })
        }
    }

    btnUpdateSelectSubject(subject){
        const arr = [{ subjectId: 1, name: 'fred' }, { subjectId: 2, name: 'bill' }];
        this.checkSubject(this.props.subjectCodeInfo.data.subjects, subject.id, subject.name);
    }
    checkSubject(arr, subjectId, name) {
        var selected = this.state.updateSelectedSubjects;
        var joined = selected.concat(subjectId);
        const found = arr.some(el => el.subjectId === subjectId);
        if (!found){
            // arr.push({ subjectId: subjectId, name: name });
            this.setState({ updateSelectedSubjects: joined })
        } else{ 
            notification("error", `<i class = "fa fa-warning"></i> User currently enrolled to this subject - ${name}`)
        }
        return arr;
    }

    addSubject(){
        let addSubject = new Array()
        if(this.state.updateSelectedSubjects.length > 0){
            // let currentSelected = this.state.updateSelectedSubjects;
            console.log(this.props.subjects.subjects.length + " > " + this.props.subjectCodeInfo.data.subjects.length)
            this.props.subjectCodeInfo.data.subjects.map( list => {
                addSubject.push(list.subjectId);
            });
            let final = addSubject.concat(this.state.updateSelectedSubjects)
            // this.setState({disabled: true})
            let formData = {
                "subjectCode": this.props.subjectCodeInfo.data.subjectCode,
                "userId": this.props.subjectCodeInfo.data.userId,
                "email": this.props.subjectCodeInfo.data.email,
                "organizationName": this.props.subjectCodeInfo.data.organizationName,
                "subjects": final
            }
            this.props.updateSubjectCode(this.props.subjectCodeInfo.data.id, formData).then(res => {
                console.log(">>>  " + JSON.stringify(res))
            })
            // console.log("updateSelectedSubjects>> " + JSON.stringify(formData))
        }else{
            notification("error", `<i class = "fa fa-warning"></i> Select subject to add`)
        }
    }

    toggleState = (id) => {
        // alert(window.location.href)
        if (typeof id === 'undefined') {
            this.setState({ isModalOpen: false});
        }else{
            this.props.fetchSubjectCodeInfo(id);
            this.setState({ isModalOpen: !this.state.isModalOpen});
        }
    };

    formSubjectCode(e){
        e.preventDefault();
        if(this.state.selectedSubjects.length > 0){
            this.setState({disabled: true});
            let formData = {
                "email": this.state.subjectCodeEmail,
                "subjects": this.state.selectedSubjects
            }
            if(this.state.subjectCodeType === 'multiple'){
                formData.count = this.state.subjectTotalCode;
                formData.organizationName = this.state.subjectOrgName;
            }
            console.log(formData)
            this.props.newSubjectCode(formData).then(data => {
                console.log(">>> "  + JSON.stringify(data))
                if(data.payload.result === "success"){
                    this.props.fetchSubjectCode();
                    notification("success", `<i class = "fa fa-check"></i> ${data.payload.message}`)
                    this.setState({disabled: false});
                    this.setState({cardStatus: false});
                }else if(data.payload.result === "failed"){
                    notification("error", `<i class = "fa fa-warning"></i> ${data.payload.message}`)
                }else{
                    notification("error", `<i class = "fa fa-warning"></i> Something went wrong please try agin`)
                }
            });
        }else{
            notification("error", `<i class = "fa fa-warning"></i> Select subject/s first`)
        }
    }

    render() {
        let subCodeListsArr = new Array();
        if(this.props.subjectCode){
            console.log(this.props.subjectCode)
            if(this.props.subjectCode.items.length > 0){
                this.props.subjectCode.items.forEach( subCode => {
                    subCodeListsArr.push({
                        subjectCode: subCode.subjectCode,
                        isActivated: subCode.userId === "" ? <small className = "text text-danger">Not activated</small> : <small>Activated</small>,
                        email: subCode.email,
                        orgName: subCode.organizationName === "" ? <small className = "text text-primary">not an organization</small> : subCode.organizationName,
                        action: <div className = "">
                                    {subCode.userId === "" ? <button type="button"  className="btn btn-secondary btn-sm" onClick={() =>  this.toggleState(subCode.id)}> <FontAwesomeIcon icon = {faEnvelope}/></button> : ""}
                                    &nbsp;<button type="button"  className="btn btn-primary btn-sm" onClick={() =>  this.showCard('view', 'show', subCode.id)}> <FontAwesomeIcon icon = {faEye}/></button>
                                    &nbsp;<button type="button"  className="btn btn-success btn-sm" onClick={() =>  this.showCard('edit', 'show', subCode.id)}> <FontAwesomeIcon icon = {faEdit}/></button> &nbsp;
                                </div>
                    })
                })
            }
        }else{
            subCodeListsArr = [];
        }
        let columns = [
            { dataField: 'subjectCode', text: 'Subject Code',   style: { width: '100px' }, searchable: true},
            { dataField: 'isActivated', text: 'Is Activated',   style: { width: '200px' }, searchable: true},
            { dataField: 'email', text: 'Email',   style: { width: '200px' }, searchable: true},
            { dataField: 'orgName', text: 'Organiztion Name',   style: { width: '400px' }, searchable: true},
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
                            <h2>Subject Codes</h2>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                                <li className="breadcrumb-item">Subject Code</li>
                            </ol>
                            <div className = "row">
                                <div className = {this.state.cardStatus == true ? "col-md-7" : "col"}>
                                    <div className="card card-custom-border">
                                        <div className="card-header">
                                            Content box
                                            <small className = "float-right">
                                                {
                                                    this.state.cardStatus == true ?  "" :  <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'show', '')}><FontAwesomeIcon icon = {faPlus}/> Add new subject code</a>
                                                }
                                            </small>
                                        </div>
                                        <div className="card-body">

                                            <div>
                                                {this.state.isModalOpen && (
                                                <Modal id="modal" isOpen={this.state.isModalOpen} onClose={this.toggleState} title = "Resend Subject Code" type = "resend-subject-code" data = {this.props.subjectCodeInfo}>
                                                    <div className="box-body">Are you sure you want to resend subject code to this email? <b> {this.props.subjectCodeInfo ? this.props.subjectCodeInfo.data.email : ""} </b>?</div>
                                                </Modal>
                                                )}
                                            </div>

                                            <ToolkitProvider
                                                keyField="id"
                                                data={ subCodeListsArr }
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



                                { this.state.cardStatus == true ?
                                <div className = "col-md-5">
                                    <div className="card border-primary">
                                        <div className="card-header">
                                            {this.state.cardActive == "view" ? "Subject Information" : ""}
                                            {this.state.cardActive == "create" ? "Create new subject code": ""}
                                            {this.state.cardActive == "edit" ? "Edit subject code": ""}
                                            <small className = "float-right">
                                                <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'hide')}>
                                                    <FontAwesomeIcon icon = {faTimes}/> Close
                                                </a>
                                            </small>
                                        </div>
                                        <div className="card-body">
                                            {this.state.cardActive == "create" ?
                                                <form onSubmit = {this.formSubjectCode} id = "createSubjectForm">
                                                    <div className="form-group">
                                                        <label for="code">Select mode</label>
                                                        <select className = "form-control" onChange = {this.onChangeType} disabled = {(this.state.disabled)? "disabled" : ""}> 
                                                            <option value = "single">Single</option>
                                                            <option value = "multiple">Multiple</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label for="code">Email</label>
                                                        <input type="email" className="form-control" placeholder="Enter email" name = "subjectCodeEmail"  value = {this.state.subjectCodeEmail} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div>
                                                    {this.state.subjectCodeType == "multiple" ? 
                                                        <div><div className="form-group">
                                                            <label for="code">Organization Name</label>
                                                            <input type="text" className="form-control" placeholder="Enter organization name" name = "subjectOrgName"  value = {this.state.subjectOrgName} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="code">Total Code</label>
                                                            <input type="number" className="form-control" placeholder="Enter number" name = "subjectTotalCode"  value = {this.state.subjectTotalCode} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div></div> 
                                                        : ""
                                                    }
                                                    
                                                    <div className="form-group">
                                                        <label for="code">Select subject to enroll</label>
                                                        {this.props.subjects ? 
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <div>
                                                                    {this.props.subjects.subjects.map( subj => 
                                                                        <button 
                                                                            type = "button" 
                                                                            class= {this.state.selectedSubjects.length > 0 ? 
                                                                                        this.state.selectedSubjects.includes(subj.id) ? 
                                                                                            "btn btn-success btn-block" : 
                                                                                            "btn btn-secondary btn-block" 
                                                                                        : "btn btn-secondary btn-block"
                                                                                    }
                                                                            key = {subj.id} 
                                                                            onClick = {this.btnSelectSubject.bind(this, subj)}
                                                                            disabled = {(this.state.disabled)? "disabled" : ""}
                                                                        >
                                                                            {this.state.selectedSubjects.length > 0 ? this.state.selectedSubjects.includes(subj.id) ? <i class="fa fa-check"></i> : "" : ""} {subj.code}
                                                                        </button>

                                                                    )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        : <div><i class="fa fa-spinner fa-spin"></i> Loading subjects... </div>}
                                                    </div>
                                                    <hr/>
                                                    <div className="form-group">
                                                        <button type="submit" className="btn btn-primary btn-block" disabled = {(this.state.disabled)? "disabled" : ""}>
                                                        {this.state.disabled ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Submit'}
                                                        </button>
                                                    </div>
                                                </form>
                                            : ""}

                                            {this.state.cardActive == "view" ? 
                                                <div>
                                                    {this.props.subjectCodeInfo ? 
                                                        <div key = {this.props.subjectCodeInfo.data.id}>
                                                            <p>Code: <b>{this.props.subjectCodeInfo.data.subjectCode}</b></p>
                                                            <p>Email: <b>{this.props.subjectCodeInfo.data.email}</b></p>
                                                            <p>User: <b>{this.props.subjectCodeInfo.data.userId === "" ?  <label className = "text text-danger">Not Activated</label> : this.props.subjectCodeInfo.data.userId}</b></p>
                                                            <p>Activated At: <b>{this.props.subjectCodeInfo.data.expiresAt}</b></p>
                                                            <p>Expires At: <b>{this.props.subjectCodeInfo.data.expiresAt}</b></p>
                                                            <p>Subject/s Enrolled: <hr/><b><ul>{this.props.subjectCodeInfo.data.subjects.map( subEn => <li> {subEn.name} </li>)}</ul></b></p>
                                                        </div>
                                                        
                                                    : ""}
                                                </div>
                                            : ""}

                                            {this.state.cardActive == "edit" ? 
                                                <div>
                                                    {/* {this.props.subjectCodeInfo.data.subjects.length === this.props.subjects.subjects.length ? "ALL SUBJECT ENROLLED" :  */}
                                                    {this.props.subjectCodeInfo && this.props.subjects ? 
                                                        this.props.subjectCodeInfo.data.subjects.length === this.props.subjects.subjects.length ? <div className="alert alert-dismissible alert-danger"> <span className = "fa fa-warning"></span> Unable to update - all subjects are enrolled to this user</div>: 
                                                     <div>
                                                     <b>Subjects enrolled:</b> <hr/>
                                                     {this.props.subjectCodeInfo 
                                                         ? 
                                                         <ul>
                                                             {this.props.subjectCodeInfo.data.subjects.map( list => 
                                                                 <li>{list.name}</li>
                                                             )}
                                                         </ul>
                                                         : <div><i class="fa fa-spinner fa-spin"></i> Loading enrolled subject/s... </div>}
                                                     <hr/>
                                                     <b>Add subject to enroll:</b> <hr/>
                                                     {this.props.subjects ? 
                                                         this.props.subjects.subjects.map( subj => 
                                                             <button 
                                                                 type = "button" 
                                                                 class= {this.state.updateSelectedSubjects.length > 0 ? 
                                                                             this.state.updateSelectedSubjects.includes(subj.id) ? 
                                                                                 "btn btn-success btn-block" : 
                                                                                 "btn btn-secondary btn-block" 
                                                                             : "btn btn-secondary btn-block"
                                                                         }
                                                                 key = {subj.id} 
                                                                 onClick = {this.btnUpdateSelectSubject.bind(this, subj)}
                                                                 disabled = {(this.state.disabled)? "disabled" : ""}
                                                             >
                                                                 {this.state.updateSelectedSubjects.length > 0 ? this.state.updateSelectedSubjects.includes(subj.id) ? <i class="fa fa-check"></i> : "" : ""} {subj.code}
                                                             </button>
                                                         )
                                                     : ""}
                                                     <hr/>
                                                     <button type="button" className="btn btn-primary btn-block" disabled = {(this.state.disabled)? "disabled" : ""} onClick = {this.addSubject}>
                                                         {this.state.disabled ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Add Subject'}
                                                     </button>
                                                     </div>
                                                    : <div><i class="fa fa-spinner fa-spin"></i> Loading content... </div>}
                                                   

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
}


const mapStateToProps = state => ({
    validateToken: state.validateToken.testData,
    subjects: state.subjects.items.data,
    subjectCode: state.subjectCode.items.data,
    subjectCodeInfo: state.subjectCode.info
})

export default connect(mapStateToProps, { 
    validateToken,
    fetchSubjects,
    fetchSubjectCode,
    newSubjectCode,
    fetchSubjectCodeInfo,
    updateSubjectCode,
    resendSubjectCode
})(SubjectCodeComponent);
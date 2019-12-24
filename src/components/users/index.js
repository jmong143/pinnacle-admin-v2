import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';
import NavbarComponent   from '../__layout/Navbar';
import SideNavComponent   from '../__layout/SideNav';
import { validateToken } from '../../actions/module/validateAdminActions';
import { fetchUsers, newUser, userInfo, userDelete, userUpdate } from '../../actions/module/userActions';
import { notification } from '../__plugins/noty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../__layout/Modal';
import { faEye, faEdit, faTrash, faTrashAlt, faPlus, faTimes, faInfo } from '@fortawesome/free-solid-svg-icons';
import BootstrapTable from 'react-bootstrap-table-next'
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';

import Moment from 'react-moment';
import 'moment-timezone';

import { create } from 'domain';
const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;
class UsersComponent extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            "cardStatus": false,
            "cardActive": "",
            "disabled": false,
            "newUser": {},
            "newUserEmail": "",
            "newUserPassword": "",
            "newUserFirstName": "",
            "newUserMiddleName": "",
            "newUserLastName": "",
            "newUserBirthdate": "",
            "newUserGender": "",
            "newUserSchool": "male",
            "newUserType": "user",
            "updateUserEmail": "",
            "updateFirstName": "",
            "updateUserLastName":"",
            "isModalOpen": false
        };
        this.onChange = this.onChange.bind(this);
        this.formCreateUser = this.formCreateUser.bind(this);
        this.formUpdateUser = this.formUpdateUser.bind(this);
    }

    componentDidMount(){
        if (localStorage.getItem("pinnacleAdmin") !== null) {
            this.props.validateToken(this.state).then(tokenValidate => {
                if(tokenValidate.payload.status !== 200){
                    this.props.history.push("/login");
                }else{
                    this.props.fetchUsers();
                }
            });
        }else {
            this.props.history.push("/login");
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.users){
            if(nextProps.users.result === "success"){

            }else if(nextProps.users.result === "failed"){
                notification("error", `<i class = "fa fa-info-circle"></i> ${nextProps.users.message}`)
            }
            else{
                notification("error", `<i class = "fa fa-info-circle"></i> Something went wrong, Please try again`)
            }
        }
        if(nextProps.user){
            this.setState({disabled: false});

            console.log(nextProps.user)
            if(nextProps.user.result === "success"){
                this.setState({updateUserFirstName: nextProps.user.data.firstName})
                this.setState({updateUserLastName: nextProps.user.data.lastName})
            }else if(nextProps.user.result === "failed"){
                notification("error", `<i class = "fa fa-info-circle"></i> ${nextProps.users.message}`)
            }else{
                notification("error", `<i class = "fa fa-info-circle"></i> Something went wrong, Please try again`)
            }
        }
        if(nextProps.userDeleted){
            console.log(nextProps.userDeleted)
        }
    }

    render() {
        let users = new Array();
        if(this.props.users){
            this.props.users.data.items.forEach( user => {
                users.push({
                    role: user.isAdmin === true ? <span className="badge badge-info">admin</span> : <span className="badge badge-success">user</span>,
                    subjectCode: user.subjectCode == null || user.subjectCode == "" ? <span className="badge badge-danger">{user.isAdmin ? "admin" : "not enrolled"}</span> : user.subjectCode,
                    fullName: user.firstName + " " + user.lastName,
                    email: user.email,
                    action: <div className = "">
                                <button type="button"  className="btn btn-primary btn-sm" onClick={() =>  this.showCard('view', 'show', user.id)}> <FontAwesomeIcon icon = {faEye}/></button> &nbsp;
                                <button type="button"  className="btn btn-success btn-sm" onClick={() =>  this.showCard('edit', 'show', user.id)}> <FontAwesomeIcon icon = {faEdit}/></button> &nbsp;
                                <button type="button"  className="btn btn-danger btn-sm" onClick={() =>  this.toggleState(user.id)}> <FontAwesomeIcon icon = {faTrash}/></button>
                            </div>
                })
            });
        }
        let columns = [
            { dataField: 'role', text: 'Role', width: 1 },
            { dataField: 'subjectCode', text: 'Code', width: 2 },
            { dataField: 'fullName', text: 'Fullname',   style: { width: '400px' }, searchable: true},
            { dataField: 'email', text: 'Email',   style: { width: '350px' }, searchable: true},
            { dataField: 'action', text: 'Action', style: { width: '200px' } }
        ]
        var bTableOptions = {
            noDataText: 'Your_custom_text'
        };
        return (
            <div>
                 {this.state.isModalOpen && (
                    <Modal id="modal" isOpen={this.state.isModalOpen} onClose={this.toggleState} title = "Delete" type = "delete-user" data = {this.props.user}>
                        {/* data = {this.props.subjectInfoProps} */}
                        <div className="box-body">Are you sure you want to delete this <b> {this.props.user ? this.props.user.data.lastName + ", " + this.props.user.data.firstName : ""} </b>?</div>
                    </Modal>
                )}
                <SideNavComponent/>
                <div className="main">
                    <NavbarComponent/>
                    <div className="container">
                        <div className = "col">
                            <br/>
                            <h2>Users</h2>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                                <li className="breadcrumb-item">Users</li>
                            </ol>
                            <div className = "row">
                                <div className = {this.state.cardStatus == true ? "col-md-7" : "col"}>
                                    <div className="card card-custom-border">
                                        <div className="card-header">
                                            Content box
                                            <small className = "float-right">
                                                {
                                                    this.state.cardStatus == true ?  "" :  <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'show', '')}><FontAwesomeIcon icon = {faPlus}/> Add new user</a>
                                                }
                                            </small>
                                        </div>

                                        <div className="card-body">
                                       
                                            <ToolkitProvider
                                            keyField="id"
                                            data={ users }
                                            columns={ columns }
                                            options = {bTableOptions}
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
                                        </div>
                                    </div>



                                </div>

                                { this.state.cardStatus == true ?
                                <div className = "col-md-5">
                                    <div className="card border-primary">
                                        <div className="card-header">
                                            {this.state.cardActive == "view" ? "User Information" : ""}
                                            {this.state.cardActive == "create" ? "Create New Admin User": ""}
                                            {this.state.cardActive == "edit" ? "Edit User Information": ""}
                                            <small className = "float-right">
                                                <a className = "card-link" onClick = {this.showCard.bind(this, 'create', 'hide')}>
                                                    <FontAwesomeIcon icon = {faTimes}/> Close
                                                </a>
                                            </small>
                                        </div>
                                        <div className="card-body">
                                            {this.state.cardActive == "create" ?  
                                                <form onSubmit = {this.formCreateUser} id = "createUserForm">
                                                    {/* <div className="form-group">
                                                        <label for="name">Type</label>
                                                        <select className = "form-control" name = "newUserType" onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}> 
                                                            <option value = "user">User</option>
                                                            <option value = "admin">Admin</option>
                                                        </select>
                                                    </div> */}
                                                    <div className="form-group">
                                                        <label for="name">Email</label>
                                                        <input type="email" className="form-control" placeholder="e.g juandelacruz@mail.com" name = "newUserEmail" value = {this.state.newUserEmail} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label for="name">Password</label>
                                                        <input type="password" className="form-control" placeholder="Enter password" name = "newUserPassword" value = {this.state.newUserPassword} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label for="code">First Name</label>
                                                        <input type="text" className="form-control" placeholder="Enter first name" name = "newUserFirstName"  value = {this.state.newUserFirstName} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label for="code">Last Name</label>
                                                        <input type="text" className="form-control" placeholder="Enter last name" name = "newUserLastName"  value = {this.state.newUserLastName} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div>
                                                    {/* {this.state.newUserType === "admin" ? "" : 
                                                    <div>
                                                        <div className="form-group">
                                                            <label for="code">Birthdate</label>
                                                            <input type="date" className="form-control" placeholder="Enter birthdate" name = "newUserBirthdate"  value = {this.state.newUserBirthdate} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="code">Gender</label>
                                                            <select className = "form-control" name = "newUserGender" onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}> 
                                                                <option value = "male">Male</option>
                                                                <option value = "female">Female</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="code">School</label>
                                                            <input type="text" className="form-control" placeholder="Enter school" name = "newUserSchool"  value = {this.state.subjectCode} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                    </div>
                                                    } */}
                                                    <div className="form-group">
                                                        <button type="submit" className="btn btn-primary btn-block" disabled = {(this.state.disabled)? "disabled" : ""}>
                                                        {this.state.disabled ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Submit'}
                                                        </button>
                                                    </div>
                                                </form>
                                            : ""}

                                            {this.state.cardActive == "edit" ?  
                                                <form onSubmit = {this.formUpdateUser} id = "updateUserForm">
                                                    {/* <div className="form-group">
                                                        <label for="name">Type</label>
                                                        <select className = "form-control" name = "newUserType" onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}> 
                                                            <option value = "user">User</option>
                                                            <option value = "admin">Admin</option>
                                                        </select>
                                                    </div> */}
                                                    {/* <div className="form-group">
                                                        <label for="name">Email</label>
                                                        <input type="email" className="form-control" placeholder="e.g juandelacruz@mail.com" name = "updateUserEmail" value = {this.state.updateUserEmail} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div> */}
                                                    {/* <div className="form-group">
                                                        <label for="name">Password</label>
                                                        <input type="password" className="form-control" placeholder="Enter password" name = "updateUserPassword" value = {this.state.updateUserPassword} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div> */}
                                                    <div className="form-group">
                                                        <label for="code">First Name</label>
                                                        <input type="text" className="form-control" placeholder="Enter first name" name = "updateUserFirstName"  value = {this.state.updateUserFirstName} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div>
                                                    {/* <div className="form-group">
                                                        <label for="code">Middle Name</label>
                                                        <input type="text" className="form-control" placeholder="Enter middle name (optional)" name = "newUserMiddleName"  value = {this.state.subjectCode} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div> */}
                                                    <div className="form-group">
                                                        <label for="code">Last Name</label>
                                                        <input type="text" className="form-control" placeholder="Enter last name" name = "updateUserLastName"  value = {this.state.updateUserLastName} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                    </div>
                                                    {/* {this.state.newUserType === "admin" ? "" : 
                                                    <div>
                                                        <div className="form-group">
                                                            <label for="code">Birthdate</label>
                                                            <input type="date" className="form-control" placeholder="Enter birthdate" name = "newUserBirthdate"  value = {this.state.subjectCode} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="code">Gender</label>
                                                            <select className = "form-control" name = "newUserGender" onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}> 
                                                                <option value = "male">Male</option>
                                                                <option value = "female">Female</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="code">School</label>
                                                            <input type="text" className="form-control" placeholder="Enter school" name = "newUserSchool"  value = {this.state.newUserSchool} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                                                        </div>
                                                    </div>
                                                    } */}
                                                    <div className="form-group">
                                                        <button type="submit" className="btn btn-primary btn-block" disabled = {(this.state.disabled)? "disabled" : ""}>
                                                        {this.state.disabled ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Submit'}
                                                        </button>
                                                    </div>
                                                </form>
                                            : ""}


                                            {this.state.cardActive == "view" ?
                                                <div>
                                                { this.props.user ? 
                                                    <div className="row">
                                                        <div className="col-md-12 post">
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    {this.props.user.data.subjectCode === "" ? 
                                                                        <div className="alert-danger center"> <p>{this.props.user.data.isAdmin ? "This user is admin" : "This student not enrolled"} </p> </div> : 
                                                                        <h6>Subject Code: <small>{this.props.user.data.subjectCode}</small></h6>
                                                                    }
                                                                    <hr/>
                                                                    <h6>Fullname: <small>{this.props.user.data.lastName}, {this.props.user.data.firstName} {this.props.user.data.middleName}</small></h6>
                                                                    <h6>Email: <small>{this.props.user.data.email}</small></h6>
                                                                    {this.props.user.data.gender !== "" ?  <h6>Gender: <small>{this.props.user.data.gender}</small></h6> : "" }
                                                                    {this.props.user.data.school !== "" ?  <h6>School: <small>{this.props.user.data.school}</small></h6> : "" }
                                                                    <h6>Member Since: <small><Moment format="MMMM D YYYY">{this.props.user.data.createdAt}</Moment></small></h6>
                                                                    
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
                                : ""}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    showCard(todo, status, id){
        if(status == "show"){
            this.setState({cardStatus: true})
            this.setState({cardActive: todo})
            if(todo == "view"){
                this.setState({disabled: true});
                this.props.userInfo(id);
            }else if(todo == "edit"){
                this.setState({disabled: true});
                this.props.userInfo(id);
            }
        }else{
            this.setState({cardStatus: false})
        }
    }

    onChange(e){
        console.log(e.target.name + " : " + e.target.value)
        this.setState({[e.target.name]: e.target.value})
        // console.log(this.state.newUserEmail)
    }

    formCreateUser(e){
        e.preventDefault();
        this.setState( {disabled: !this.state.disabled} )
        let formNewUser = {
            "email": this.state.newUserEmail,
            "password": this.state.newUserPassword,
            "firstName": this.state.newUserFirstName,
            "middleName": this.state.newUserMiddleName,
            "lastName": this.state.newUserLastName,
        }
        // if(this.state.newUserType === "admin"){
        //     formNewUser.isAdmin = true;

        // }else if(this.state.newUserType === "user"){
        //     formNewUser.isAdmin = false;
        //     formNewUser.birthDate = this.state.newUserBirthdate;
        //     formNewUser.gender = this.state.newUserGender;
        //     formNewUser.school = this.state.newUserSchool;
        // }else{
        //     notification("error", `<i class = "fa fa-info-circle"></i> Input user type`)
        // }
        // console.log(formNewUser)
        this.props.newUser(formNewUser).then(data => {
            notification("success", `<i class = "fa fa-checked"></i> ${data.payload.message}`)
            this.setState({newUserEmail: ""})
            this.setState({newUserPassword: ""})
            this.setState({newUserFirstName: ""})
            this.setState({newUserMiddleName: ""})
            this.setState({newUserLastName: ""})
            this.setState({disabled: false});
            this.props.fetchUsers();
            // if(data.payload.result === "success"){
            //     notification("error", `<i class = "fa fa-checked"></i> ${data.payload.message}`)
            // }else if(data.payload.result === "failed"){
            //     notification("error", `<i class = "fa fa-info-circle"></i> ${data.payload.message}`)
            // }else{
            //     notification("error", `<i class = "fa fa-info-circle"></i> Something went wrong, Please try again`)
            // }
        });
    }
    
    formUpdateUser(e){
        e.preventDefault();
        this.setState( {disabled: !this.state.disabled} )
        let formUpdateUser = {
            "firstName": this.state.updateUserFirstName,
            "lastName": this.state.updateUserLastName
        }
        this.props.userUpdate(this.props.user.data.id, formUpdateUser).then(data => {
            
            this.setState({disabled: false});
            if(data.payload.result === "success"){
                this.setState({updateUserFirstName: ""})
                this.setState({updateUserLastName: ""})
                this.setState({cardStatus: false})
                this.props.fetchUsers();
                notification("success", `<i class = "fa fa-checked"></i> ${data.payload.message}`)
            }else if(data.payload.result === "failed"){
                notification("error", `<i class = "fa fa-info-circle"></i> ${data.payload.message}`)
            }else{
                notification("error", `<i class = "fa fa-info-circle"></i> Something went wrong, Please try again`)
            }
        })
    }

    toggleState = (id) => {
        // alert(window.location.href)
        if (typeof id === 'undefined') {
            this.setState({ isModalOpen: false});
        }else{
            this.props.userInfo(id);
            this.setState({ isModalOpen: !this.state.isModalOpen});
        }
        // this.state.isModalOpen ? document.body.style.overflow = "" : document.body.style.overflow = "hidden";
    };

}

UsersComponent.propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    users:  PropTypes.array,
    newUser: PropTypes.func.isRequired,
    addedUser: PropTypes.object,
    userInfo: PropTypes.func.isRequired,
    user: PropTypes.object,
    userDelete: PropTypes.func.isRequired,
    userDeleted: PropTypes.object,

};

const mapStateToProps = state => ({
    validateToken: state.validateToken.testData,
    users: state.users.lists,
    addedUser: state.users.list,
    user: state.users.info,
    userDeleted: state.users.delete

})

export default connect(mapStateToProps, { 
    validateToken,
    fetchUsers,
    newUser,
    userInfo,
    userDelete,
    userUpdate
})(UsersComponent);

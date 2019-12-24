import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';
import { loginPost } from '../../actions/module/loginActions';
import { validateToken } from '../../actions/module/validateAdminActions';
import { notification } from '../__plugins/noty';

class LoginComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            disabled: false
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmitLogin = this.onSubmitLogin.bind(this);
    }

    componentDidMount(){
          if (localStorage.getItem("pinnacleAdmin") == null) {
          }else{
            this.props.validateToken(this.state).then(tokenValidate => {
              if(tokenValidate.payload.status === 200) this.props.history.push("/");
            });
          }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.loginData){
            if(nextProps.loginData.status === 200){
                localStorage.setItem('pinnacleAdmin', JSON.stringify(nextProps.loginData));
                notification("success", `<i class = "fa fa-check"></i> Successfully Logged In..`)
                this.props.history.push("/");
            }else{
                this.setState({disabled: false})
                notification("error", `<i class = "fa fa-info-circle"></i> ${nextProps.loginData.message}`)
            }
        }

    }

    render() {
        return (
            <div className = "main-content ">
                <div className="wrapper fadeInDown">
                    <div class="form-content">
                        <div className="fadeIn first">
                            <br/>
                            <img src="../../img/logo_old.png" className = "logo" id="icon" alt="User Icon" />
                            <h5>Admin</h5>
                        </div>
                        <div className = "container">
                            <form onSubmit = {this.onSubmitLogin}>
                                <div className = "form-group">
                                    <input type="email" id="login" className="form-control fadeIn" name="email" value = {this.state.email} placeholder="Email" onChange = {this.onChange} disabled = {(this.state.disabled)? "disabled" : ""} required/>
                                </div>
                                <div className = "form-group">
                                    <input type="password" id="password" className="form-control fadeIn" name="password" value = {this.state.password} placeholder="Password" onChange = {this.onChange} disabled = {(this.state.disabled)? "disabled" : ""} required/>
                                </div>
                                <div className = "form-group">
                                    <button className="btn btn-primary btn-lg" type = "submit">
                                        { (this.state.disabled) ? <div className="spinner-border" role="status"> <span className="sr-only">Loading...</span> </div> : 'Login '}
                                    </button> &nbsp;
                                    <button className="btn btn-warning btn-lg" type = "button">Clear</button>
                                </div>
                            </form>
                        </div>
                        <div className="form-footer">
                            <a className="underline-hover" href="https://www.pinnaclecpareview.ph/" target = "_blank">Go to the Site</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmitLogin(e){
        e.preventDefault();
        this.setState( {disabled: !this.state.disabled} )
        const formData = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.loginPost(formData);
    }
}

LoginComponent.propTypes = {
    loginPost: PropTypes.func.isRequired,
    validateToken: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    loginData: state.login.data,
    validateToken: state.validateToken.testData
})

export default connect(mapStateToProps, { validateToken, loginPost })(LoginComponent);

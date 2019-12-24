import React, { Component } from "react";
import ReactDom from "react-dom";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { validatePassword } from '../../actions/module/validateAdminActions';
import { subjectDelete, fetchSubjects } from '../../actions/module/subjectActions';
import { newsDelete, fetchNews } from '../../actions/module/newsActions';
import { fetchUsers, userDelete } from '../../actions/module/userActions';
import { fetchTopic, deleteTopic } from '../../actions/module/topicActions';
import { fetchLesson, deleteLesson } from '../../actions/module/lessonActions';
import { fetchQuestions, deleteQuestion } from '../../actions/module/questionsActions';
import { fetchSubjectCode, resendSubjectCode } from '../../actions/module/subjectCodeActions';

import { notification } from '../__plugins/noty';
// styled
import StyledModal from "./Modal.css";

const modalRoot = document.getElementById("modal-root");

class Modal extends Component {
  static defaultProps = {
    id: "",
    modalClass: "",
    modalSize: "md"
  };

  constructor(props){
    super(props)
    this.state =  {
      userPassword: '',
      validate: false,
      disabled: false,
      showNotif: false
    }
    this.handleOperation = this.handleOperation.bind(this);
    this.onChange = this.onChange.bind(this);
    this.formValidatePassword = this.formValidatePassword.bind(this);
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    modalClass: PropTypes.string,
    modalSize: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string
  };

  state = { fadeType: null };

  background = React.createRef();

  componentDidMount() {
    window.addEventListener("keydown", this.onEscKeyDown, false);
    setTimeout(() => this.setState({ fadeType: "in" }), 0);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isOpen && prevProps.isOpen) {
      this.setState({ fadeType: "out" });
    }
  }

  componentWillUnmount() {
    this.setState({validate: false});
    this.setState({disabled: false});
    this.setState({showNotif: false});
    window.removeEventListener("keydown", this.onEscKeyDown, false);
  }

  transitionEnd = e => {
    if (e.propertyName !== "opacity" || this.state.fadeType === "in") return;

    if (this.state.fadeType === "out") {
      this.setState({validate: false});
      this.setState({disabled: false});
      this.setState({showNotif: false});
      this.props.onClose();
    }
  };

  onEscKeyDown = e => {
    if (e.key !== "Escape") return;
    this.setState({validate: false});
    this.setState({disabled: false});
    this.setState({showNotif: false});
    this.setState({ fadeType: "out" });
  };

  handleClick = e => {
    e.preventDefault();
    this.setState({validate: false});
    this.setState({disabled: false});
    this.setState({showNotif: false});
    this.setState({ fadeType: "out" });
  };

  handleOperation = (e) => {
    if(this.props.type === "delete-subject"){
      let subject = this.props.data;
      this.props.subjectDelete(subject.data.id).then(deletedSubj =>{
        if(deletedSubj.payload.result === "success"){
          this.setState({ fadeType: "out" });
          notification("success", `<i class = "fa fa-check"></i> ${deletedSubj.payload.message}`)
        }else{
            notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please try again`)
        }
        this.props.fetchSubjects();
      });
    }else if(this.props.type === "delete-news"){
      let news = this.props.data;
      this.props.newsDelete(news.data.id).then(deletedData => {
            if(deletedData.payload.result === "success"){
              this.props.fetchNews();
              this.setState({ fadeType: "out" });
              notification("success", `<i class = "fa fa-check"></i> ${deletedData.payload.message}`)
            }else{
                notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please try again`)
            }
      })
    }else if(this.props.type === "delete-user"){
      let user = this.props.data;
      this.props.userDelete(user.data.id).then(deletedData => {
            if(deletedData.payload.result === "success"){
              this.props.fetchUsers();
              this.setState({ fadeType: "out" });
              notification("success", `<i class = "fa fa-check"></i> ${deletedData.payload.message}`)
            }else{
                notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please try again`)
            }
      })
    }else if(this.props.type === "delete-topic"){
      let topic = this.props.data;
      console.log(topic)
      this.props.deleteTopic(topic.subjectId, topic.topicId).then(deletedData => {
            if(deletedData.payload.result === "success"){
              this.props.fetchTopic(topic.subjectId);
              this.setState({ fadeType: "out" });
              notification("success", `<i class = "fa fa-check"></i> ${deletedData.payload.message}`)
            }else{
                notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please try again`)
            }
      })
    }else if(this.props.type === "delete-lesson"){
      let lesson = this.props.data;
      console.log(lesson)
      this.props.deleteLesson(lesson.topicId, lesson._id).then(deletedData => {
            if(deletedData.payload.result === "success"){
              this.props.fetchLesson(lesson.topicId);
              this.setState({ fadeType: "out" });
              notification("success", `<i class = "fa fa-check"></i> ${deletedData.payload.message}`)
            }else{
                notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please try again`)
            }
      })
    }else if(this.props.type === "delete-question"){
      let question = this.props.data;
      console.log(question)
      this.props.deleteQuestion(question._id).then(deletedData => {
            if(deletedData.payload.result === "success"){
              this.props.fetchQuestions(question.subjectId, question.topicId);
              this.setState({ fadeType: "out" });
              notification("success", `<i class = "fa fa-check"></i> ${deletedData.payload.message}`)
            }else{
                notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please try again`)
            }
      })
    }else if(this.props.type === "resend-subject-code"){
      let subjectCodeInfo = this.props.data;
      let formData = {
        "email": subjectCodeInfo.data.email,
        "id": subjectCodeInfo.data.id      
      }
      this.props.resendSubjectCode(formData).then(resendData => {
        console.log(resendData)
        if(resendData.payload.result === "success"){
          this.props.fetchSubjectCode();
          this.setState({ fadeType: "out" });
          notification("success", `<i class = "fa fa-check"></i> ${resendData.payload.message}`)
        }else{
            notification("error", `<i class = "fa fa-remove"></i> Something went wrong, Please try again`)
        }
      })
    }
    
  }

  componentWillReceiveProps(nextProps){
    // if(nextProps.validate){
    //   console.log(nextProps.validate)
    //   if(nextProps.validate.result === "success"){
    //     this.setState({validate: true})
    //     this.setState({showNotif: false})
        
    //   }else{
    //     this.setState({showNotif: true})
    //     this.setState({disabled: false})
    //     // this.setState({ fadeType: "out" });
    //     // notification("error", `<i class = "fa fa-remove"></i> Invalid Password.`)
    //   }
    // }
  }

  onChange(e){
    this.setState({[e.target.name]: e.target.value})
  }

  formValidatePassword(e){
    e.preventDefault();
    this.setState({disabled: true})
    let form = {
      password: this.state.userPassword
    }
    this.props.validatePassword(form).then(res => {
      console.log("RESSS>> " + JSON.stringify(res))
      if(res.payload.result === "success"){
        this.setState({validate: true})
        this.setState({showNotif: false})
      }else{
        this.setState({showNotif: true})
        this.setState({disabled: false})
      }
    })

  }

  render() {
    return ReactDom.createPortal(
      <StyledModal
        id={this.props.id}
        className={`wrapper ${"size-" + this.props.modalSize} fade-${
          this.state.fadeType
        } ${this.props.modalClass}`}
        role="dialog"
        modalSize={this.props.modalSize}
        onTransitionEnd={this.transitionEnd}
      >
        <div className="box-dialog">
          <div className="box-header">
            <h5 className="box-title">{this.props.title}</h5>
            <button onClick={this.handleClick} className="close">
              ×
            </button>
          </div>
          <div className="box-content">{this.props.children}</div>
          {this.props.type === "resend-subject-code" ? "" : 
            <div>
              <hr/>
              {this.state.validate === true 
                ? 
                  <div class = "container">
                    <div class=" alert alert-success">
                      <i className = "fa fa-check"></i> Password successfully validated, Click confirm to delete
                    </div>
                  </div>
                : 
                <div className = "container">
                  <div class=" card">
                    <div class="card-body card-validate">
                      {this.state.showNotif === true ? <div class="alert alert-dismissible alert-danger"> <i className = "fa fa-info-circle"></i> Invalid Password</div> : ""}
                      <small><i>Enter password here in able to proceed in deletion</i></small>
                      <form onSubmit = {this.formValidatePassword}>
                        <div className="form-group">
                            <input type="password" className="form-control" name = "userPassword" value = {this.state.userPassword} onChange = {this.onChange} required disabled = {(this.state.disabled)? "disabled" : ""}/>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary" disabled = {(this.state.disabled)? "disabled" : ""}>
                            {this.state.disabled ? <div className="spinner-border" role="status"></div> : 'Submit'}
                            </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div> 
              }
              <br/> 
            </div>
          }
          
          <div className="box-footer">
            {this.props.type === "resend-subject-code" ? <button onClick = {this.handleOperation} class="btn btn-outline-primary">Confirm</button> : ""}
            {this.state.validate === true ? <button onClick = {this.handleOperation} class="btn btn-outline-primary">Confirm</button> : ""} &nbsp;
            <button onClick={this.handleClick} className="btn btn-outline-danger">Cancel</button>
          </div>
        </div>
        <div
          className={`background`}
          onMouseDown={this.handleClick}
          ref={this.background}
        />
      </StyledModal>,
      modalRoot
    );
  }
}


Modal.propTypes = {
  subjectDelete: PropTypes.func.isRequired,
  deleteSubjectProps: PropTypes.object
};
const mapStateToProps = state => ({
  validate: state.validateToken.validatePassword,
  deleteSubjectProps: state.subjects.subjectDelete,
  deleteNewsProps: state.news.newsUpdate,
})


// export default Modal;
export default connect(mapStateToProps, { 
  validatePassword,
  subjectDelete,
  newsDelete,
  fetchNews,
  fetchSubjects,
  fetchUsers,
  userDelete,
  fetchTopic,
  deleteTopic,
  fetchLesson,
  deleteLesson,
  fetchQuestions,
  deleteQuestion,
  fetchSubjectCode,
  resendSubjectCode
})(Modal);
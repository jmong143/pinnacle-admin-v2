import React, { Component } from 'react'
import { connect } from 'react-redux';
import './styles/navbar.css';
import { notification } from '../__plugins/noty';
import { validateToken } from '../../actions/module/validateAdminActions';

class NavbarComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isOpen: false
        };
        this.btnAdminLogout = this.btnAdminLogout.bind(this);
      }

    
    render() {
      let _this = this;
        return (
            <div>
              <nav class="navbar navbar-icon-top navbar-expand-lg navbar-dark bg-dark">
                
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav ml-auto">
                    {/* <li class="nav-item">
                      <a class="nav-link" href="#">
                        <i class="fa fa-bell">
                          <span class="badge badge-info">0</span>
                        </i>
                        Notification
                      </a>
                    </li> */}
                    <li class="nav-item">
                      <a class="nav-link" href="#">
                        <i class="fa fa-user"></i> Profile
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href = "#" onClick = {_this.btnAdminLogout}>
                        <i class="fa fa-cog"></i> Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          );
    }

    
    btnAdminLogout(){      
      // this.props.history.push("/login");
      // notification("success", `<i class = "fa fa-check"></i> Successfully Logged Out..`)
      // alert(this.state.isOpen)

    }
}


const mapStateToProps = state => ({
  validateToken: state.validateToken.testData
})
export default connect(mapStateToProps, { validateToken })(NavbarComponent);

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import './styles.css';
import NavbarComponent   from '../__layout/Navbar';
import SideNavComponent   from '../__layout/SideNav';
import { validateToken } from '../../actions/module/validateAdminActions';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';



class DashboardComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "data": "",
            "isModalOpen": false
        };
    }

    


    componentDidMount(){
        if (localStorage.getItem("pinnacleAdmin") == null) {
          this.props.history.push("/login");
        }else {
          this.props.validateToken(this.state).then(tokenValidate => {
            if(tokenValidate.payload.status !== 200) this.props.history.push("/login");
          });
        }

    }

    render() {
        const myData = {"aaaa": "aa"}
        return (
            <div>
                <SideNavComponent/>
                <div class="main">
                    <NavbarComponent/>
                    <br/>
                    <div class="container">
                    <div className="row col-md-12">
                    <div className = "col">
                        <div class="container bootstrap snippet">
                            <div class="row">
                                <div class="col-lg-3 col-sm-6">
                                <div class="circle-tile ">
                                    <a href="#"><div class="circle-tile-heading dark-blue"><i class="fa fa-users fa-fw fa-3x"></i></div></a>
                                    <div class="circle-tile-content dark-blue">
                                    <div class="circle-tile-description text-faded"> Users</div>
                                    <div class="circle-tile-number text-faded ">62</div>
                                    <Link to = "/users" className="circle-tile-footer">More Info <i class="fa fa-chevron-circle-right"></i></Link>
                                    </div>
                                </div>
                                </div>
                                
                                <div class="col-lg-3 col-sm-6">
                                    <div class="circle-tile ">
                                        <a href="#"><div class="circle-tile-heading red"><i class="fa fa-book fa-fw fa-3x"></i></div></a>
                                        <div class="circle-tile-content red">
                                        <div class="circle-tile-description text-faded"> Subjects </div>
                                        <div class="circle-tile-number text-faded ">8</div>
                                        <Link to = "/subjects" className="circle-tile-footer">More Info <i class="fa fa-chevron-circle-right"></i></Link>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-3 col-sm-6">
                                    <div class="circle-tile ">
                                        <a href="#"><div class="circle-tile-heading blue"><i class="fa fa-list fa-fw fa-3x"></i></div></a>
                                        <div class="circle-tile-content blue">
                                        <div class="circle-tile-description text-faded"> Topics </div>
                                        <div class="circle-tile-number text-faded ">19</div>
                                        <Link to = "/subjects" className="circle-tile-footer">More Info <i class="fa fa-chevron-circle-right"></i></Link>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-3 col-sm-6">
                                    <div class="circle-tile ">
                                        <a href="#"><div class="circle-tile-heading purple"><i class="fa fa-calendar fa-fw fa-3x"></i></div></a>
                                        <div class="circle-tile-content purple">
                                        <div class="circle-tile-description text-faded"> News </div>
                                        <div class="circle-tile-number text-faded ">3</div>
                                        <Link to = "/news" className="circle-tile-footer">More Info <i class="fa fa-chevron-circle-right"></i></Link>
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

DashboardComponent.propTypes = {
    loginPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    validateToken: state.validateToken.testData
})

export default connect(mapStateToProps, { validateToken })(DashboardComponent);

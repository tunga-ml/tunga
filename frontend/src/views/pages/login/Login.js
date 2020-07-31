import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { inject, observer } from 'mobx-react';

import APIService from '../../../services/APIService'
import AlertService from '../../../services/AlertService'

@inject("AuthStore")

@observer
class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email:"",
      password: ""
    }

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    //alert(this.state.email + this.state.password);
    APIService.requests
    .post('auth/login', {
      email: this.state.email,
      password: this.state.password,
    })
    .then(data => {
      this.props.AuthStore.setLoginProps(data.auth_token, data.message);
      this.props.history.push('/');
    })
    .catch(data => {
      alert("incorrect credentials")
      AlertService.Add({
        type: 'alert',
        //message: translate.getText('error.' + data.response.body.error.code),
        level: 'error',
        autoDismiss: 5
      });
    });
}

  handleEmailChange(event){
    this.setState({email: event.target.value});

  }

  handlePasswordChange(event){
    this.setState({password: event.target.value});

  }

  render() {
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="8">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Giriş Yap</h1>
                      <p className="text-muted">Hesabınıza Giriş Yapın...</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" onChange={this.handleEmailChange} value={this.state.email} placeholder="Email" autoComplete="email" />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="password" onChange={this.handlePasswordChange} value={this.state.password} placeholder="Password" autoComplete="current-password" />
                      </CInputGroup>
                      <CRow>
                        <CCol xs="6">
                          <CButton onClick={this.handleClick} color="primary" className="px-4">Giriş Yap</CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Kayıt Ol</h2>
                      <p>Hesabınız yoksa hemen ücretsiz bir şekilde kayıt olabilirsiniz.</p>
                      <Link to="/register">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>Hemen Kaydol!</CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  
  }
}

export default Login

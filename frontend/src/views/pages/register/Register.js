import React from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCol,
    CContainer,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow,
    CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import APIService from '../../../services/APIService'
import AlertService from '../../../services/AlertService'
import { inject, observer } from 'mobx-react';

@inject("AuthStore")

@observer

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            password_repeat: "",
            email: ""
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordRepeatChange = this.handlePasswordRepeatChange.bind(this);

        this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);

        this.isPasswordMatch = this.isPasswordMatch.bind(this);
        this.isFormReady = this.isFormReady.bind(this);
        this.isPasswordStrongEnough = this.isPasswordStrongEnough.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handlePasswordRepeatChange(event) {
        this.setState({password_repeat: event.target.value});
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }


    isPasswordMatch(password,password_repeat) {
        return password === password_repeat
    }

    isPasswordStrongEnough(password){
        if (password.length < 5){
            return false;
        }
        return true;
        // TODO: Buraya yeni birkac kural ekleyebiliriz.
    }

    isFormReady() {
        return (this.isPasswordMatch(this.state.password,this.state.password_repeat) &&
            this.isPasswordStrongEnough(this.state.password))

    }
    handleSubmitButtonClick(event) {
        if (this.isFormReady()) {
            APIService.requests
            .post('auth/register', {
              username: this.state.username,
              email: this.state.email,
              password: this.state.password
            })
            .then(data => {
              this.props.AuthStore.setLoginProps(data.auth_token, data.message);
              this.props.history.push('/');
            })
            .catch(data => {
              alert(data)

              AlertService.Add({
                type: 'alert',
                //message: translate.getText('error.' + data.response.body.error.code),
                level: 'error',
                autoDismiss: 5
              });
            });
        
        }else{
            alert("hazir degil")
        }
    }
    render() {
        return (
            <div className="c-app c-default-layout flex-row align-items-center">
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md="9" lg="7" xl="6">
                            <CCard className="mx-4">
                                <CCardBody className="p-4">
                                    <CForm>
                                        <h1>Yeni Hesap Oluşturma</h1>
                                        <p className="text-muted">Aşağıdaki alanları doldurarak hemen ücretsiz hesabınızı oluşturabilirsiniz.</p>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                                <CInputGroupText>
                                                    <CIcon name="cil-user"/>
                                                </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="text" onChange={this.handleUsernameChange}
                                                    value={this.state.username} placeholder="Kullanıcı Adı"
                                                    autoComplete="username"/>
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                                <CInputGroupText>@</CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="text" onChange={this.handleEmailChange}
                                                    value={this.state.email} placeholder="Email" autoComplete="email"/>
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                                <CInputGroupText>
                                                    <CIcon name="cil-lock-locked"/>
                                                </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="password" onChange={this.handlePasswordChange} 
                                                    value={this.state.password} placeholder="Parola" autoComplete="new-password"/>
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupPrepend>
                                                <CInputGroupText>
                                                    <CIcon name="cil-lock-locked"/>
                                                </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="password" onChange={this.handlePasswordRepeatChange}
                                                    value = {this.state.password_repeat} placeholder="Parolayı Tekrarlayın"
                                                    autoComplete="new-password"/>
                                        </CInputGroup>
                                        <CButton color="success" onClick={this.handleSubmitButtonClick} block>Kayıt Ol</CButton>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        )
    }


}

export default Register

/**
 * 
 * 
 * 
 *                                 <CCardFooter className="p-4">
                                    <CRow>
                                        <CCol xs="12" sm="6">
                                            <CButton className="btn-facebook mb-1" block><span>facebook</span></CButton>
                                        </CCol>
                                        <CCol xs="12" sm="6">
                                            <CButton className="btn-twitter mb-1" block><span>twitter</span></CButton>
                                        </CCol>
                                    </CRow>
                                </CCardFooter>

 */
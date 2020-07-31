import React, { useEffect, useState, createRef } from 'react'
import {
  CCol, CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CButton,
  CRow,
  CFormGroup,
  CLabel,
  CInput,
  CFormText
} from '@coreui/react'

//import usersData from '../users/UsersData'
import APIService from '../../services/APIService'
import AlertService from '../../services/AlertService'

import translate from '../../services/i18n/Translate';
const fields = ['config_key', "config_value"]

class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configurations: [],
      configKey: "",
      configValue: ""
    }

    this.handleConfigKeyChange = this.handleConfigKeyChange.bind(this);
    this.handleConfigValueChange = this.handleConfigValueChange.bind(this);
    this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
  }

  handleConfigKeyChange(event) {
    this.setState({ configKey: event.target.value });

  }

  handleConfigValueChange(event) {
    this.setState({ configValue: event.target.value });

  }

  handleSubmitButtonClick() {
    if (this.state.configKey === "" || this.state.configValue===""){
      alert("Lütfen anahtar ve değer ikilisini eksiksiz girin")
      return 
    }
    APIService.requests
      .post('configuration',{ 
        config_key:this.state.configKey,
        config_value:this.state.configValue
      })
      .then(data => {
        window.location.reload(false);
      })
      .catch(data => {
        console.log(data)
        AlertService.Add({
          type: 'alert',
          //message: translate.getText('error.' + data.response.body.error.code),
          level: 'error',
          autoDismiss: 5
        });
      });

  }

  componentDidMount() {
    this.fetchConfigurations();
  }


  async fetchConfigurations() {
    await APIService.requests
      .get('configuration')
      .then(data => {
        console.log(data)
        this.setState({ configurations: data.configs })
      })
      .catch(data => {
        console.log(data)
        AlertService.Add({
          type: 'alert',
          //message: translate.getText('error.' + data.response.body.error.code),
          level: 'error',
          autoDismiss: 5
        });
      });
  }


  render() {
    return (
      <>
        <div className="card">
          <div className="card-header">
            {translate.translate("configuration.configuration_header")}
          </div>
          <div className="card-body">
            <CCol xs="12" lg="12">
              <CCard>
                <CCardHeader>
                  {translate.translate("configuration.add_new_configuration")}

                </CCardHeader>
                <CCardBody>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="config-key">{translate.translate("configuration.key")}</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput id="config-key" onChange={this.handleConfigKeyChange} name="text-input" placeholder={translate.translate("configuration.key_placeholder")} />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="config-value">{translate.translate("configuration.value")}</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput id="config-value" onChange={this.handleConfigValueChange} name="text-input" placeholder={translate.translate("configuration.value_placeholder")} />
                    </CCol>
                  </CFormGroup>

                  <CButton onClick={this.handleSubmitButtonClick} color="success">{translate.translate("configuration.add_config")}</CButton>
                </CCardBody>
              </CCard>
              <CCard>
                <CCardHeader>
                  {translate.translate("configuration.my_configurations")}
                </CCardHeader>
                <CCardBody>
                  <CDataTable
                    items={this.state.configurations}
                    fields={fields}
                    striped
                    itemsPerPage={10}
                    pagination
                  />

                </CCardBody>
              </CCard>

            </CCol>
          </div>
        </div>
      </>
    )
  }
}

export default Configuration

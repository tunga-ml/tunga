import React, { } from 'react'
import {
  CCol, CCard,
  CCardBody,
  CCardHeader,
  CWidgetProgressIcon,
  CButton,
  CFormGroup,
  CInput,
  CInputFile,
  CLabel,
  CRow,
  CAlert
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import translate from '../../services/i18n/Translate';

import APIService from '../../services/APIService'
import AlertService from '../../services/AlertService'

class ImportFromURL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset_name: "",
      dataset_description: "",
      dataset_url: "",
      is_show_result_alert: false,
      is_upload_successful: false,
    }

    this.handleDatasetNameChange = this.handleDatasetNameChange.bind(this);
    this.handleDatasetDescriptionChange = this.handleDatasetDescriptionChange.bind(this);
    this.handleDatasetURLChange = this.handleDatasetURLChange.bind(this);

    this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);

  }

  handleDatasetNameChange(event) {
    this.setState({ dataset_name: event.target.value });
  }

  handleDatasetDescriptionChange(event) {
    this.setState({ dataset_description: event.target.value });
  }

  handleDatasetURLChange(event) {
    this.setState({ dataset_url: event.target.value });
  }

  handleRefreshClick(event) {
    this.setState({
      dataset_name: "",
      dataset_description: "",
      is_show_result_alert: false,
      is_upload_successful: false,
      file: null,
      upload_file_name: translate.translate("retrieval.import_from_local.choose_file")
    })
  }

  handleSubmitButtonClick(e) {
    console.log(this.state);
    e.preventDefault();
    APIService.requests
      .post('dataset/remote', {
        dataset_name: this.state.dataset_name,
        dataset_description: this.state.dataset_description,
        dataset_url: this.state.dataset_url
      })
      .then(data => {
        console.log(data);
        this.setState({ is_show_result_alert: true })
        this.setState({ is_upload_successful: true })

      })
      .catch(data => {
        alert("hata")
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
            {translate.translate("datasets.import_from_url")}
          </div>
          <div className="card-body">
            <CCol xs="12" lg="12">
              <CCard>
                <CCardHeader>
                  {translate.translate("retrieval.import_from_url.enter_fıle_remote_path")}
                </CCardHeader>
                <CCardBody>
                  <CFormGroup>
                    <CLabel htmlFor="datasetName">{translate.translate("retrieval.import_from_url.dataset_name")}</CLabel>
                    <CInput onChange={this.handleDatasetNameChange} id="datasetName" placeholder={translate.translate("retrieval.import_from_url.dataset_name")} />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="datasetDescription">{translate.translate("retrieval.import_from_local.dataset_description")}</CLabel>
                    <CInput onChange={this.handleDatasetDescriptionChange} id="datasetDescription" placeholder={translate.translate("retrieval.import_from_local.dataset_description_placeholder")} />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="fetchAddress">{translate.translate("retrieval.import_from_url.remote_path")}</CLabel>
                    <CInput onChange={this.handleDatasetURLChange} id="fetchAddress" placeholder={translate.translate("retrieval.import_from_url.remote_path_placeholder")} />
                  </CFormGroup>
                  <CButton onClick={this.handleSubmitButtonClick} color="success">{translate.translate("retrieval.import_from_url.fetch_data")}</CButton>
                </CCardBody>
              </CCard>
              <CCol hidden={!this.state.is_show_result_alert}>
                <CAlert hidden={!this.state.is_upload_successful} color="success">
                  {translate.translate("retrieval.import_from_local.file_upload_success")}
                </CAlert>
                <CAlert hidden={this.state.is_upload_successful} color="danger">
                  {translate.translate("retrieval.import_from_local.file_upload_fail")}
                </CAlert>
                <CButton onClick={this.handleRefreshClick} color="primary">{translate.translate("retrieval.import_from_local.upload_new_file")}</CButton>
              </CCol>

            </CCol>
          </div>
        </div>
      </>
    )
  }
}

export default ImportFromURL

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

class ImportFromLocal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset_name: "",
      dataset_description: "",
      is_show_result_alert: false,
      is_upload_successful: false,
      file: null,
      upload_file_name: translate.translate("retrieval.import_from_local.choose_file"),
      analytics: {
        nrows:"0",
        ncols:"0",
        nmissing:"0"
      }
    }
    this.handleDatasetNameChange = this.handleDatasetNameChange.bind(this);
    this.handleDatasetDescriptionChange = this.handleDatasetDescriptionChange.bind(this);
    this.handleFileUploadChange = this.handleFileUploadChange.bind(this);

    this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);

  }

  handleDatasetNameChange(event) {
    this.setState({ dataset_name: event.target.value });
  }

  handleDatasetDescriptionChange(event) {
    this.setState({ dataset_description: event.target.value });
  }

  handleFileUploadChange(event) {
    this.setState({ file: event.target.files[0] });
    this.setState({ upload_file_name: event.target.files[0].name })
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
    let formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("dataset_name", this.state.dataset_name);
    formData.append("dataset_description", this.state.dataset_description);

    e.preventDefault();
    APIService.requests
      .post('dataset/local', formData)
      .then(data => {
        console.log(data);
        this.setState({ is_show_result_alert: true })
        this.setState({ is_upload_successful: true })
        this.setState({analytics:
          {
            nrows:data.analytics.nrows,
            ncols:data.analytics.ncols
          }})
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
            {translate.translate("datasets.import_from_local")}
          </div>
          <div className="card-body">
            <CCol xs="12" lg="12">
              <CCard>
                <CCardHeader>
                  {translate.translate("retrieval.import_from_local.file_metadata")}
                </CCardHeader>
                <CCardBody>
                  <CFormGroup>
                    <CLabel htmlFor="datasetName">{translate.translate("retrieval.import_from_local.dataset_name")}</CLabel>
                    <CInput onChange={this.handleDatasetNameChange} id="datasetName" placeholder={translate.translate("retrieval.import_from_local.dataset_name_placeholder")} />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="datasetDescription">{translate.translate("retrieval.import_from_local.dataset_description")}</CLabel>
                    <CInput onChange={this.handleDatasetDescriptionChange} id="datasetDescription" placeholder={translate.translate("retrieval.import_from_local.dataset_description_placeholder")} />
                  </CFormGroup>

                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader>
                  {translate.translate("retrieval.import_from_local.file_upload")}
                </CCardHeader>
                <CCardBody>
                  <CFormGroup row>
                    <CLabel col md={3}>{translate.translate("retrieval.import_from_local.choose_dataset_file")}</CLabel>
                    <CCol xs="12" md="9">
                      <CInputFile onChange={this.handleFileUploadChange} custom id="custom-file-input" />
                      <CLabel htmlFor="custom-file-input" variant="custom-file">
                        {this.state.upload_file_name}
                      </CLabel>
                    </CCol>
                    <CCol xs="12" md="12">
                      <CButton onClick={this.handleSubmitButtonClick} color="success">{translate.translate("retrieval.import_from_local.upload")}</CButton>
                    </CCol>
                  </CFormGroup>
                </CCardBody>
                <CCol hidden={!this.state.is_show_result_alert}>
                  <CAlert hidden={!this.state.is_upload_successful} color="success">
                    {translate.translate("retrieval.import_from_local.file_upload_success")}
                  </CAlert>
                  <CAlert hidden={this.state.is_upload_successful} color="danger">
                    {translate.translate("retrieval.import_from_local.file_upload_fail")}
                  </CAlert>
                  <CButton onClick={this.handleRefreshClick} color="primary">{translate.translate("retrieval.import_from_local.upload_new_file")}</CButton>
                </CCol>
              </CCard>

              <CCard hidden={!this.state.is_show_result_alert}>
                <CCardHeader>
                  {translate.translate("retrieval.import_from_local.analysis")}
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol sm="6" md="2">
                      <CWidgetProgressIcon
                        header={String(this.state.analytics.nrows)}
                        text={translate.translate("retrieval.import_from_local.total_row_count")}
                        color="gradient-info"
                        inverse
                      >
                        <CIcon name="cil-people" height="36" />
                      </CWidgetProgressIcon>
                    </CCol>
                    <CCol sm="6" md="2">
                      <CWidgetProgressIcon
                        header={String(this.state.analytics.ncols)}
                        text={translate.translate("retrieval.import_from_local.total_field_count")}
                        color="gradient-success"
                        inverse
                      >
                        <CIcon name="cil-userFollow" height="36" />
                      </CWidgetProgressIcon>
                    </CCol>
                    <CCol sm="6" md="2">
                      <CWidgetProgressIcon
                        header="1238"
                        text={translate.translate("retrieval.import_from_local.total_word_count")}
                        color="gradient-warning"
                        inverse
                      >
                        <CIcon name="cil-basket" height="36" />
                      </CWidgetProgressIcon>
                    </CCol>
                    <CCol sm="6" md="2">
                      <CWidgetProgressIcon
                        header="28%"
                        text={translate.translate("retrieval.import_from_local.total_distinct_word_count")}
                        color="gradient-primary"
                        inverse
                      >
                        <CIcon name="cil-chartPie" height="36" />
                      </CWidgetProgressIcon>
                    </CCol>
                    <CCol sm="6" md="2">
                      <CWidgetProgressIcon
                        header="0"
                        text={translate.translate("retrieval.import_from_local.total_missing_values")}
                        color="gradient-danger"
                        inverse
                      >
                        <CIcon name="cil-speedometer" height="36" />
                      </CWidgetProgressIcon>
                    </CCol>
                    <CCol sm="6" md="2">
                      <CWidgetProgressIcon
                        header="0"
                        text="comments"
                        color="gradient-info"
                        inverse
                      >
                        <CIcon name="cil-speech" height="36" />
                      </CWidgetProgressIcon>
                    </CCol>
                  </CRow>

                </CCardBody>
              </CCard>

            </CCol>
          </div>
        </div>
      </>
    )
  }
}

export default ImportFromLocal

/**
 *
 *
 *             <CCard>
            <CCardHeader>
              Yukleme
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CInputGroup className="mb-3">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput type="text" placeholder="Email" autoComplete="email" />
                  <CFormGroup row>
                  <CLabel col md={3}>Custom file input</CLabel>
                  <CCol xs="12" md="9">
                    <CInputFile custom id="custom-file-input"/>
                    <CLabel htmlFor="custom-file-input" variant="custom-file">
                      Choose file...
                    </CLabel>
                  </CCol>
                </CFormGroup>
                </CInputGroup>

              </CForm>
            </CCardBody>
          </CCard>

 */
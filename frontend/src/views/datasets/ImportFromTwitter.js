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
import Loader from 'react-loader-spinner'

import translate from '../../services/i18n/Translate';

import APIService from '../../services/APIService'

class ImportFromTwitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_configured: true,
      dataset_name: "",
      dataset_description: "",
      username: "",
      hashtag: "",
      is_configured:false,
      is_show_result_alert: false,
      is_upload_successful: false,
      is_waiting: false,
      file: null,
      upload_file_name: translate.translate("retrieval.import_from_local.choose_file")
    }
    this.handleDatasetNameChange = this.handleDatasetNameChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleHashtagChange = this.handleHashtagChange.bind(this);

    this.handleDatasetDescriptionChange = this.handleDatasetDescriptionChange.bind(this);
    this.handleUsernameSubmitButtonClick = this.handleUsernameSubmitButtonClick.bind(this);
    this.handleHashtagSubmitButtonClick = this.handleHashtagSubmitButtonClick.bind(this);

  }

  componentDidMount(){
    this.checkAPIKeys()
  }

  handleDatasetNameChange(event) {
    this.setState({ dataset_name: event.target.value });
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handleHashtagChange(event) {
    this.setState({ hashtag: event.target.value });
  }

  handleDatasetDescriptionChange(event) {
    this.setState({ dataset_description: event.target.value });
  }


  handleUsernameSubmitButtonClick(e) {
    if (this.state.dataset_description === "" || this.state.dataset_name === ""){
      alert("Verseti bilgilerini eksiksiz giriniz.")
      return
    }
    if (this.state.username.startsWith("@")){
      let m_user = this.state.username
      this.setState({username:m_user.replace("@","")})
    }
    this.setState({is_waiting: true})
    APIService.requests
      .post('dataset/twitter/username', {
        dataset_name: this.state.dataset_name,
        dataset_description: this.state.dataset_description,
        username: this.state.username
      })
      .then(data => {
        console.log(data);
        this.setState({ is_show_result_alert: true })
        this.setState({ is_upload_successful: true })
        this.setState({is_waiting: false})
      })
      .catch(data => {
        this.setState({is_waiting: false})
        alert("hata")
      });

  }

  handleHashtagSubmitButtonClick(e) {
    if (this.state.dataset_description === "" || this.state.dataset_name === ""){
      alert("Verseti bilgilerini eksiksiz giriniz.")
      return
    }
    if (this.state.username.startsWith("#")){
      let m_hash = this.state.hashtag
      this.setState({hashtag:m_hash.replace("#","")})
    }
    this.setState({is_waiting: true})
    APIService.requests
      .post('dataset/twitter/hashtag', {
        dataset_name: this.state.dataset_name,
        dataset_description: this.state.dataset_description,
        hashtag: this.state.hashtag
      })
      .then(data => {
        console.log(data);
        this.setState({ is_show_result_alert: true })
        this.setState({ is_upload_successful: true })
        this.setState({is_waiting: false})


      })
      .catch(data => {
        this.setState({is_waiting: false})
        alert("hata")
      });

  }

  async checkAPIKeys(){
    await APIService.requests
    .post('dataset/twitter/check')
    .then(data => {
      if (data.status === "success"){
        this.setState({is_configured:true})
      } else{
        this.setState({is_configured:false})

      }
    })
    .catch(data => {
      alert("hata")
    });


  }

  render() {
    if (this.state.is_configured === false) {
      return (
        <>
          <CAlert color="danger">{translate.translate("retrieval.import_from_twitter.apikey_not_found")}</CAlert>
        </>
      )
    }
    else {
      return (
        <>
          <div className="card">
            <div className="card-header">
              {translate.translate("datasets.import_from_twitter")}
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
                    {translate.translate("retrieval.import_from_twitter.fetch_data_from_user")}
                  </CCardHeader>
                  <CCardBody>
                    <CFormGroup>
                      <CLabel htmlFor="twitterUsername">{translate.translate("retrieval.import_from_twitter.twitter_username")}</CLabel>
                      <CInput onChange={this.handleUsernameChange} id="twitterUsername" placeholder={translate.translate("retrieval.import_from_twitter.twitter_username_placeholder")} />
                    </CFormGroup>

                    <CFormGroup row>

                      <CCol xs="12" md="12">
                        <CButton hidden={this.state.is_waiting} onClick={this.handleUsernameSubmitButtonClick} color="success">{translate.translate("retrieval.import_from_twitter.fetch_from_user")}</CButton>
                        <CButton disabled="true" hidden={!this.state.is_waiting} style={{ marginTop: 23 }} color="secondary">
                          <Loader
                            type="Bars"
                            color="#00BFFF"
                            height={20}
                            width={20}
                            timeout={300000}
                          />
                          {translate.translate("machine_learning.keyword_extraction.waiting")}
                        </CButton>
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
                  </CCol>
                </CCard>

                <CCard>
                  <CCardHeader>
                    {translate.translate("retrieval.import_from_twitter.fetch_data_from_hashtag")}
                  </CCardHeader>
                  <CCardBody>
                    <CFormGroup>
                      <CLabel htmlFor="hashtag">{translate.translate("retrieval.import_from_twitter.fetch_data_from_hashtag")}</CLabel>
                      <CInput onChange={this.handleHashtagChange} id="hashtag" placeholder={translate.translate("retrieval.import_from_twitter.fetch_data_from_hashtag_placeholder")} />
                    </CFormGroup>

                    <CFormGroup row>

                      <CCol xs="12" md="12">
                        <CButton hidden={this.state.is_waiting} onClick={this.handleHashtagSubmitButtonClick} color="success">{translate.translate("retrieval.import_from_twitter.fetch_data_from_hashtag")}</CButton>
                        <CButton disabled="true" hidden={!this.state.is_waiting} style={{ marginTop: 23 }} color="secondary">
                          <Loader
                            type="Bars"
                            color="#00BFFF"
                            height={20}
                            width={20}
                            timeout={300000}
                          />
                          {translate.translate("machine_learning.keyword_extraction.waiting")}
                        </CButton>

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
                  </CCol>
                </CCard>
              </CCol>
            </div>
          </div>
        </>
      )

    }
  }
}

export default ImportFromTwitter

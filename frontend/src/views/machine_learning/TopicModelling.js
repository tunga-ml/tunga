import React, { useEffect, useState, createRef } from 'react'
import {
  CCol, CBadge, CInput,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CButton,
  CRow,
  CSelect,
  CInputCheckbox,
  CLabel,
  CFormGroup
} from '@coreui/react'
import Loader from 'react-loader-spinner'

//import usersData from '../users/UsersData'
import APIService from '../../services/APIService'
import AlertService from '../../services/AlertService'

import translate from '../../services/i18n/Translate';

class TopicModelling extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      columns: [],
      selectedDatasetId: -1,
      selectedColumnId: -1,
      isShowResult: false,
      numTopics: "",
      isWaiting:false,
      topics: [],
    }
    this.handleDatasetNameChange = this.handleDatasetNameChange.bind(this);
    this.handleColumnChange = this.handleColumnChange.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleNumTopicsChange = this.handleNumTopicsChange.bind(this);
    this.handleNumKeywordsChange = this.handleNumKeywordsChange.bind(this);
    this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
    this.handleInspectDatasetButtonClick = this.handleInspectDatasetButtonClick.bind(this);

  }

  componentDidMount() {
    this.fetchDatasets();
  }

  handleInspectDatasetButtonClick(event) {
    this.props.history.push("/inspect-dataset/" + this.state.selectedDatasetId)
  }

  handleDatasetNameChange(event) {
    let datasetId = event.target.value;
    this.setState({ selectedDatasetId: datasetId });
    this.fetchColumns(datasetId);
  }

  handleNumTopicsChange(event) {
    this.setState({ numTopics: event.target.value });
  }

  handleNumKeywordsChange(event) {
    this.setState({ numKeywords: event.target.value });
  }

  handleColumnChange(event) {
    let columndId = event.target.value;
    this.setState({ selectedColumnId: columndId });
  }

  handleCheckboxClick(event) {
    let cname = event.target.name;
    let isChecked = event.target.checked;
    let actualSelected = this.state.selectedSteps;
    actualSelected[cname] = isChecked;
    this.setState({ selectedSteps: actualSelected });
  }

  handleSubmitButtonClick(event) {
    this.setState({ isWaiting: true })

    console.log(this.state)
    APIService.requests
      .post('ml/topic_modelling', {
        numTopics: parseInt(this.state.numTopics),
        numKeywords: parseInt(this.state.numKeywords),
        datasetId: this.state.selectedDatasetId,
        column: this.state.selectedColumnId

      })
      .then(data => {
        console.log(data);
        this.setState({ isWaiting: false })

        this.setState({ isShowResult: true })
        this.setState({ topics: data })
      })
      .catch(data => {
        alert("hata")
        this.setState({ isWaiting: false })

        AlertService.Add({
          type: 'alert',
          //message: translate.getText('error.' + data.response.body.error.code),
          level: 'error',
          autoDismiss: 5
        });
      });
  }

  async fetchDatasets() {
    await APIService.requests
      .get('dataset/all')
      .then(data => {
        console.log(data.datasets)
        this.setState({ datasets: data.datasets })
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

  async fetchColumns(datasetId) {
    await APIService.requests
      .get('dataset/' + datasetId + '/columns')
      .then(data => {
        console.log(data.columns)
        this.setState({ columns: data.columns })

      })
      .catch(data => {
        this.setState({ columns: [] })
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
            {translate.translate("machine_learning.topic_modelling.header")}
          </div>
          <div className="card-body">
            <CCol xs="12" lg="12">
              <CCard>
                <CCardHeader>
                  {translate.translate("machine_learning.topic_modelling.choose_dataset")}
                </CCardHeader>
                <CCardBody>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="select">{translate.translate("machine_learning.topic_modelling.dataset")}</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CSelect onChange={this.handleDatasetNameChange} custom name="select" id="select">
                        <option value="0">{translate.translate("machine_learning.topic_modelling.please_choose")}</option>

                        {this.state.datasets.map((ds, i) =>
                          <option key={i} value={ds.id}>{ds.filename}</option>

                        )}
                      </CSelect>
                    </CCol>
                  </CFormGroup>

                </CCardBody>
              </CCard>
              <CCard>
                <CCardHeader>
                  {translate.translate("machine_learning.topic_modelling.choose_column")}
                </CCardHeader>
                <CCardBody>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="select">{translate.translate("machine_learning.topic_modelling.column")}</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CSelect onChange={this.handleColumnChange} custom name="select" id="select">
                        <option value="0">{translate.translate("machine_learning.topic_modelling.choose_column")}</option>

                        {this.state.columns.map((col, i) =>
                          <option key={i} value={col}>{col}</option>

                        )}
                      </CSelect>
                    </CCol>
                  </CFormGroup>

                </CCardBody>
              </CCard>
              <CCard>
                <CCardHeader>
                  {translate.translate("machine_learning.topic_modelling.hyperparameters")}
                </CCardHeader>
                <CCardBody>
                  <CCol md="4">
                    <CFormGroup>
                      <CLabel htmlFor="numTopics">{translate.translate("machine_learning.topic_modelling.num_topics_label")}</CLabel>
                      <CInput onChange={this.handleNumTopicsChange} id="numTopics" placeholder={translate.translate("machine_learning.topic_modelling.num_topics_placeholder")} />
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor="numKeywords">{translate.translate("machine_learning.topic_modelling.num_keywords_label")}</CLabel>
                      <CInput onChange={this.handleNumKeywordsChange} id="numKeywords" placeholder={translate.translate("machine_learning.topic_modelling.num_keywords_placeholder")} />
                    </CFormGroup>
                  </CCol>

                  <CButton hidden={this.state.isWaiting} onClick={this.handleSubmitButtonClick} style={{ marginTop: 23 }} color="success">
                      {translate.translate("machine_learning.topic_modelling.get_result")}
                    </CButton>
                    <CButton disabled="true" hidden={!this.state.isWaiting} onClick={this.handleSubmitButtonClick} style={{ marginTop: 23 }} color="secondary">
                      <Loader
                        type="Bars"
                        color="#00BFFF"
                        height={20}
                        width={20}
                        timeout={300000}
                      />
                      {translate.translate("machine_learning.topic_modelling.waiting")}
                    </CButton>

                </CCardBody>
              </CCard>
              <CCard hidden={!this.state.isShowResult}>
                <CCardHeader>
                  {translate.translate("machine_learning.topic_modelling.result")}
                </CCardHeader>
                <CCardBody>
                  {this.state.topics.map((topic, i) =>
                    <>
                      <CRow>
                        <CCol>
                          <CLabel style={{ fontSize: 18, marginRight: 12 }} key={i}><strong>Topic #{topic.id}:  </strong></CLabel>
                          {topic.keywords.map((keyword, i) =>
                            <CBadge style={{ fontSize: 16, marginRight: 12 }} color="success">{keyword}</CBadge>
                          )}
                        </CCol>
                      </CRow>
                    </>
                  )}
                  <CButton onClick={this.handleInspectDatasetButtonClick} style={{ marginLeft: 20 }} color="primary">
                    {translate.translate("preprocessing.inspect_dataset")}
                  </CButton>


                </CCardBody>
              </CCard>

            </CCol>
          </div>
        </div>
      </>
    )
  }
}

export default TopicModelling

/**
 * 
 * 
 *                   <CButton onClick={this.handleSubmitButtonClick} style={{ marginTop: 23 }} color="success">{translate.translate("machine_learning.topic_modelling.get_result")}</CButton>

 */
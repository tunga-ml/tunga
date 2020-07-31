import React, { useEffect, useState, createRef } from 'react'
import {
  CCol, CBadge,
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

//import usersData from '../users/UsersData'
import APIService from '../../services/APIService'
import AlertService from '../../services/AlertService'
import Loader from 'react-loader-spinner'

import translate from '../../services/i18n/Translate';

class NamedEntityRecognition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      columns: [],
      selectedDatasetId: -1,
      selectedColumnId: -1,
      isShowResult: false,
    }
    this.handleDatasetNameChange = this.handleDatasetNameChange.bind(this);
    this.handleColumnChange = this.handleColumnChange.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
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

  handleColumnChange(event) {
    let columndId = event.target.value;
    this.setState({ selectedColumnId: columndId });
    this.setState({ selectedColumn: event.target.value })
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
    if (this.state.selectedColumnId === -1 && this.state.selectedDatasetId == -1) {
      alert("İşleme başlamadan önce lütfen verisetini ve ilgili kolonu seçin !")
      this.setState({ isWaiting: false })
      return
    }
    APIService.requests
      .post('ml/named_entity_recognition', {
        datasetId: this.state.selectedDatasetId,
        column: this.state.selectedColumn
      })
      .then(data => {
        console.log(data);
        this.setState({ isShowResult: true })
        this.setState({ isWaiting: false })
      })
      .catch(data => {
        this.setState({ isWaiting: false })
        console.log(data)
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
            {translate.translate("machine_learning.ner.header")}
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
                  {translate.translate("machine_learning.topic_modelling.choose_model")}
                </CCardHeader>
                <CCardBody>
                  <CCol md="12">
                  </CCol>

                  <CButton hidden={this.state.isWaiting} onClick={this.handleSubmitButtonClick} style={{ marginTop: 23 }} color="success">
                    {translate.translate("machine_learning.sentiment.get_result")}
                  </CButton>
                  <CButton disabled="true" hidden={!this.state.isWaiting} onClick={this.handleSubmitButtonClick} style={{ marginTop: 23 }} color="secondary">
                    <Loader
                      type="Bars"
                      color="#00BFFF"
                      height={20}
                      width={20}
                      timeout={300000}
                    />
                    {translate.translate("machine_learning.sentiment.waiting")}
                  </CButton>


                </CCardBody>
              </CCard>
              <CCard hidden={!this.state.isShowResult}>
                <CCardHeader>
                  {translate.translate("machine_learning.topic_modelling.result")}
                </CCardHeader>
                <CCardBody>


                </CCardBody>
              </CCard>

            </CCol>
          </div>
        </div>
      </>
    )
  }
}

export default NamedEntityRecognition

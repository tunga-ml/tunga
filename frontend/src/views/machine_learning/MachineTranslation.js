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

import translate from '../../services/i18n/Translate';

class MachineTranslation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      columns: [],
      selectedDatasetId: -1,
      selectedColumnId: -1,
      isShowResult: false,
      steps: [
        "lowercase",
        "uppercase",
        "remove_stopwords",
        "remove_digits",
        "remove_emails",
        "remove_urls",
        "remove_emojis",
        "remove_hashtags",
        "remove_mentions",
        "remove_non_turkish_words",
        "correct_typos",
        "lemmatize",
        "stem",
        "asciify",
        "deasciify"
      ],
      selectedSteps: {
        lowercase: false,
        uppercase: false,
        remove_stopwords: false,
        remove_digits: false,
        remove_emails: false,
        remove_urls: false,
        remove_emojis: false,
        remove_hashtags: false,
        remove_mentions: false,
        remove_non_turkish_words: false,
        correct_typos: false,
        lemmatize: false,
        stem: false,
        asciify: false,
        deasciify: false
      }
    }
    this.handleDatasetNameChange = this.handleDatasetNameChange.bind(this);
    this.handleColumnChange = this.handleColumnChange.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }

  componentDidMount() {
    this.fetchDatasets();
  }

  handleDatasetNameChange(event) {
    let datasetId = event.target.value;
    this.setState({ selectedDatasetId: datasetId });
    this.fetchColumns(datasetId);
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

  handleSubmitButtonClick(event){
    alert("datayi sunucuya gonder")
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
            {translate.translate("machine_learning.machine_translation.header")}
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
                          <option key={i} value={i}>{ds.filename}</option>

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
                          <option key={i} value={i}>{col}</option>

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

                  <CButton onClick={this.handleSubmitButtonClick} style={{ marginTop: 23 }} color="success">{translate.translate("machine_learning.topic_modelling.get_result")}</CButton>
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

export default MachineTranslation

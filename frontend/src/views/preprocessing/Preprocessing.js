import React, { useEffect, useState, createRef } from 'react'
import {
  CCol, CBadge,
  CAlert,
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
const fields = ['filename', 'description', 'row_count', 'filetype', 'created_at']

class Preprocessing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      columns: [],
      selectedDatasetId: -1,
      selectedColumnId: -1,
      selectedColumn: "",
      isShowResult: false,
      isWaiting: false,
      steps: [
        "lowercase",
        "uppercase",
        "remove_punctuations",
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
        remove_punctuations:false,
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
    this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
    this.handleInspectDatasetButtonClick = this.handleInspectDatasetButtonClick.bind(this);
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
    this.setState({ selectedColumn: event.target.value })
  }

  handleCheckboxClick(event) {
    let cname = event.target.name;
    let isChecked = event.target.checked;
    let actualSelected = this.state.selectedSteps;
    actualSelected[cname] = isChecked;
    this.setState({ selectedSteps: actualSelected });
  }

  handleInspectDatasetButtonClick(event){
    this.props.history.push("inspect-dataset/"+this.state.selectedDatasetId)
  }

  handleSubmitButtonClick(event) {
    this.setState({ isWaiting: true })
    if (this.state.selectedColumnId === -1 && this.state.selectedDatasetId == -1) {
      alert("İşleme başlamadan önce lütfen verisetini ve ilgili kolonu seçin !")
      this.setState({ isWaiting: false })
      return
    }
    APIService.requests
      .post('preprocessing', {
        selectedSteps: this.state.selectedSteps,
        datasetId: this.state.selectedDatasetId,
        column: this.state.selectedColumn

      })
      .then(data => {
        console.log(data);
        this.setState({ isShowResult: true })
        this.setState({ isWaiting: false })
        this.setState({ is_upload_successful: true })
      })
      .catch(data => {
        this.setState({ is_upload_successful: true })
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
            {translate.translate("preprocessing.preprocessing_header")}
          </div>
          <div className="card-body">
            <CCol xs="12" lg="12">
              <CCard>
                <CCardHeader>
                  {translate.translate("preprocessing.choose_dataset")}
                </CCardHeader>
                <CCardBody>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="select">{translate.translate("preprocessing.dataset")}</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CSelect onChange={this.handleDatasetNameChange} custom name="select" id="select">
                        <option value="0">{translate.translate("preprocessing.please_choose")}</option>

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
                  {translate.translate("preprocessing.choose_column")}
                </CCardHeader>
                <CCardBody>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="select">{translate.translate("preprocessing.column")}</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CSelect onChange={this.handleColumnChange} custom name="select" id="select">
                        <option value="0">{translate.translate("preprocessing.choose_column")}</option>

                        {this.state.columns.map((col, i) =>
                          <option key={i} name={col} value={col}>{col}</option>

                        )}
                      </CSelect>
                    </CCol>
                  </CFormGroup>

                </CCardBody>
              </CCard>
              <CCard>
                <CCardHeader>
                  {translate.translate("preprocessing.choose_operations")}
                </CCardHeader>
                <CCardBody>
                  <CCol md="12">
                    {this.state.steps.map((k, v) =>
                      <CRow>
                        <CFormGroup style={{ paddingRight: 150 }} variant="custom-checkbox" inline>
                          <CInputCheckbox onChange={this.handleCheckboxClick} custom id={v} name={k} value={v} />
                          <CLabel variant="custom-checkbox" htmlFor={v}>{translate.translate("preprocessing." + k)}</CLabel>
                        </CFormGroup>
                      </CRow>
                    )}
                  </CCol>
                  <CRow>
                    <CButton hidden={this.state.isWaiting} onClick={this.handleSubmitButtonClick} style={{ marginTop: 23 }} color="success">
                      {translate.translate("preprocessing.start_preprocessing")}
                    </CButton>
                    <CButton disabled="true" hidden={!this.state.isWaiting} onClick={this.handleSubmitButtonClick} style={{ marginTop: 23 }} color="secondary">
                      <Loader
                        type="Bars"
                        color="#00BFFF"
                        height={20}
                        width={20}
                        timeout={300000}
                      />
                      {translate.translate("preprocessing.waiting")}
                    </CButton>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CAlert hidden={!this.state.isShowResult} color="success">
                        {translate.translate("preprocessing.successful")}
                        <CButton onClick={this.handleInspectDatasetButtonClick} style={{marginLeft:20}} color="primary">
                          {translate.translate("preprocessing.inspect_dataset")}
                        </CButton>
                      </CAlert>

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

export default Preprocessing

/**
 *
 *
 *                       <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox1" name="inline-checkbox1" value="option1" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1">{translate.translate("preprocessing.lowercase")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox2" name="inline-checkbox2" value="option2" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox2">{translate.translate("preprocessing.uppercase")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox3" name="inline-checkbox3" value="option3" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox3">{translate.translate("preprocessing.remove_stopwords")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox4" name="inline-checkbox4" value="option2" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox4">{translate.translate("preprocessing.remove_punctuations")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox1" name="inline-checkbox1" value="option1" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1">{translate.translate("preprocessing.lowercase")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox2" name="inline-checkbox2" value="option2" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox2">{translate.translate("preprocessing.uppercase")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox3" name="inline-checkbox3" value="option3" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox3">{translate.translate("preprocessing.remove_stopwords")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox4" name="inline-checkbox4" value="option2" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox4">{translate.translate("preprocessing.remove_punctuations")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox3" name="inline-checkbox3" value="option3" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox3">{translate.translate("preprocessing.remove_digits")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox4" name="inline-checkbox4" value="option4" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox4">{translate.translate("preprocessing.remove_emojis")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox5" name="inline-checkbox5" value="option5" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox5">{translate.translate("preprocessing.remove_hashtags")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox5" name="inline-checkbox5" value="option5" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox5">{translate.translate("preprocessing.remove_mentions")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.remove_urls")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.remove_emails")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.remove_non_turkish_words")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.correct_typos")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.lemmatize")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.stem")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.deasciify")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.asciify")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.remove_person_names")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox4" name="inline-checkbox4" value="option4" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox4">{translate.translate("preprocessing.remove_emojis")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox5" name="inline-checkbox5" value="option5" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox5">{translate.translate("preprocessing.remove_hashtags")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox5" name="inline-checkbox5" value="option5" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox5">{translate.translate("preprocessing.remove_mentions")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.remove_urls")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.remove_emails")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.remove_non_turkish_words")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.correct_typos")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.lemmatize")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.stem")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.deasciify")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.asciify")}</CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox custom id="inline-checkbox6" name="inline-checkbox6" value="option6" />
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox6">{translate.translate("preprocessing.remove_person_names")}</CLabel>
                      </CFormGroup>

 */
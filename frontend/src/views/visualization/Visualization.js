import React, { useEffect, useState, createRef } from 'react'
import {
  CCol, CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
  CDataTable,
  CButton,
  CRow,
  CSelect,
  CInputCheckbox,
  CLabel,
  CFormGroup
} from '@coreui/react'
import {
  CChartBar,
  CChartLine,
  CChartDoughnut,
  CChartRadar,
  CChartPie,
  CChartPolarArea
} from '@coreui/react-chartjs'
//import usersData from '../users/UsersData'
import APIService from '../../services/APIService'
import AlertService from '../../services/AlertService'
import ReactWordcloud from 'react-wordcloud';

import translate from '../../services/i18n/Translate';
const options = {
  colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
  enableTooltip: true,
  deterministic: false,
  fontFamily: 'impact',
  fontSizes: [25, 90],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 2,
  rotationAngles: [0, 90],
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 100,
};

class Visualization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      columns: [],
      selectedDatasetId: -1,
      selectedColumnId: -1,
      isShowResult: false,
      visualizationData: {
        sentiment: {
          data: [],
          labels: []
        },
        most_common_words: {
          data: [],
          labels: []
        },
        most_common_topics: {
          data: [],
          labels: []
        },
        word_cloud: [

        ]
      }
    }
    this.handleDatasetNameChange = this.handleDatasetNameChange.bind(this);

  }

  componentDidMount() {
    this.fetchDatasets();
  }

  handleDatasetNameChange(event) {
    let datasetId = event.target.value;
    this.setState({ selectedDatasetId: datasetId });
    this.fetchVisualizationData(datasetId);
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

  fetchVisualizationData(datasetId) {
    APIService.requests
      .post('visualization', {
        datasetId: datasetId
      })
      .then(data => {
        let visData = this.state.visualizationData
        visData.sentiment = data.sentiment
        visData.most_common_words = data.most_common_words
        visData.most_common_topics = data.most_common_topics
        visData.word_cloud = data.word_cloud
        this.setState({ visualizationData: visData })
        this.setState({ isShowResult: true });
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
            {translate.translate("visualization.header")}
          </div>
          <div className="card-body">
            <CCol xs="12" lg="12">
              <CCard>
                <CCardHeader>
                  {translate.translate("visualization.choose_dataset")}
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
              <CRow>
                <CCol>
                  <CCard>
                    <CCardHeader>
                      {translate.translate("visualization.sentiment")}
                    </CCardHeader>
                    <CCardBody>
                      <CAlert hidden={this.state.isShowResult} color="secondary">{translate.translate("visualization.choose_dataset")}</CAlert>
                      <CChartPie hidden={!this.state.isShowResult}
                        type="pie"
                        datasets={[
                          {
                            backgroundColor: [
                              '#41B883',
                              '#E46651',
                              '#00D8FF',
                              '#DD1B16'
                            ],
                            data: this.state.visualizationData.sentiment.data
                          }
                        ]}
                        labels={this.state.visualizationData.sentiment.labels}
                        options={{
                          tooltips: {
                            enabled: true
                          }
                        }}
                      />
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol>
                  <CCard>
                    <CCardHeader>
                      {translate.translate("visualization.most_common_header")}
                    </CCardHeader>
                    <CCardBody>
                      <CAlert hidden={this.state.isShowResult} color="secondary">{translate.translate("visualization.choose_dataset")}</CAlert>
                      <CChartBar hidden={!this.state.isShowResult}
                        type="bar"
                        datasets={[
                          {
                            label: translate.translate("visualization.word_count"),
                            backgroundColor: '#f87979',
                            data: this.state.visualizationData.most_common_words.data
                          }
                        ]}
                        labels={this.state.visualizationData.most_common_words.labels}
                        options={{
                          tooltips: {
                            enabled: true,

                          }
                        }}
                      />
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CCard>
                    <CCardHeader>
                      {translate.translate("visualization.topic_modelling_header")}
                    </CCardHeader>
                    <CCardBody>
                      <CAlert hidden={this.state.isShowResult} color="secondary">{translate.translate("visualization.choose_dataset")}</CAlert>
                      <CChartRadar hidden={!this.state.isShowResult}
                        type="radar"
                        datasets={[
                          {
                            label: 'Konular',
                            backgroundColor: 'rgba(255,99,132,0.2)',
                            borderColor: 'rgba(255,99,132,1)',
                            pointBackgroundColor: 'rgba(255,99,132,1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(255,99,132,1)',
                            tooltipLabelColor: 'rgba(255,99,132,1)',
                            data: this.state.visualizationData.most_common_topics.data
                          }
                        ]}
                        options={{
                          aspectRatio: 2,
                          tooltips: {
                            enabled: true
                          }
                        }}
                        labels={this.state.visualizationData.most_common_topics.labels}
                      />
                    </CCardBody>
                  </CCard>

                </CCol>
                <CCol>

                  <CCard>
                    <CCardHeader>
                      {translate.translate("visualization.word_cloud")}
                    </CCardHeader>
                    <CCardBody>
                      <CAlert hidden={this.state.isShowResult} color="secondary">{translate.translate("visualization.choose_dataset")}</CAlert>
                      <div hidden={!this.state.isShowResult} style={{ width: '100%', height: '100%' }}>
                        <ReactWordcloud options={options} words={this.state.visualizationData.word_cloud} />
                      </div>

                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCol>
          </div>
        </div>
      </>
    )
  }
}

export default Visualization

/**
 *
 *
 *

 */
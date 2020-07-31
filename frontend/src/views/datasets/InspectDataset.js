import React, { useEffect, useState, createRef } from 'react'
import {
  CCol, CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CButton,
  CLabel,
  CRow
} from '@coreui/react'

//import usersData from '../users/UsersData'
import APIService from '../../services/APIService'
import AlertService from '../../services/AlertService'

import translate from '../../services/i18n/Translate';
const fields = ['filename', 'description', 'row_count', 'filetype', 'created_at']

class InspectDataset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      fields: [],
      selectedDatasetId: -1
    }

    this.handleDownloadDatasetButton = this.handleDownloadDatasetButton.bind(this)
  }

  componentDidMount() {
    this.makeAPIcall();
  }

  goTo(address) {
    this.props.history.push(address);
  }

  async makeAPIcall() {
    await APIService.requests
      .get('dataset/' + this.props.match.params.id + "/inspect")
      .then(fetchedData => {
        console.log(fetchedData)
        this.setState({ tableData: fetchedData.data })
        this.setState({ fields: fetchedData.columns })
        this.setState({ datasetName: fetchedData.dataset_name })
        this.setState({ datasetDescription: fetchedData.dataset_description })

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

  handleDownloadDatasetButton(){
    APIService.requests
    .download('dataset/' + this.props.match.params.id  + "/download")
    .then(response => {
      const element = document.createElement("a");
      console.log(response)
      const file = new Blob([response.text],    
          {type: 'text/csv;charset=utf-8'});
      element.href = URL.createObjectURL(file);
      element.download = "tunga_dataset"+this.props.match.params.id+".csv";
      document.body.appendChild(element);
      element.click();


    })
    .catch(data => {
      console.log(data)
    });

  }


  render() {
    return (
      <>
        <div className="card">
          <div className="card-header">
            {translate.translate("datasets.inspect_dataset.header")}
          </div>
          <div className="card-body">
            <CCol xs="12" lg="12">
              <CCard>
                <CCardHeader>
                  {translate.translate("datasets.inspect_dataset.metadata")}
                </CCardHeader>
                <CCardBody>
                  <CLabel>{translate.translate("datasets.inspect_dataset.dataset_name")}: <b>{this.state.datasetName}</b>  </CLabel>
                  <br />
                  <CLabel>{translate.translate("datasets.inspect_dataset.dataset_description")}: <b>{this.state.datasetDescription}</b></CLabel>
                  <br />
                  <CButton onClick={this.handleDownloadDatasetButton} color="primary">{translate.translate("datasets.inspect_dataset.download_dataset")}</CButton>

                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader>
                  {translate.translate("datasets.inspect_dataset.data")}
                </CCardHeader>
                <CCardBody>
                  <CDataTable
                    items={this.state.tableData}
                    fields={this.state.fields}
                    striped
                    sorter
                    hover
                    columnFilter
                    tableFilter
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

export default InspectDataset

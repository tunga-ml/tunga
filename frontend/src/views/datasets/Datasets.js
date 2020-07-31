import React, { useEffect, useState, createRef } from 'react'
import {
  CCol, CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CButton,
  CRow
} from '@coreui/react'

//import usersData from '../users/UsersData'
import APIService from '../../services/APIService'
import AlertService from '../../services/AlertService'

import translate from '../../services/i18n/Translate';
const fields = ['filename', 'description', 'row_count', 'filetype', 'created_at']

class Datasets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: []
    }
    this.goTo = this.goTo.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    this.makeAPIcall();
  }

  goTo(address) {
    alert('/#' + address);
    this.props.history.push("/");
  }

  async makeAPIcall() {
    await APIService.requests
      .get('dataset/all')
      .then(data => {
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

  handleRowClick(event) {
    //console.log(event.id)
    this.props.history.push("/inspect-dataset/" + event.id);
  }

  handleButtonClick(event) {
    this.props.history.push("/retrieval/" + event.target.name)
  }
  
  render() {
    return (
      <>
        <div className="card">
          <div className="card-header">
            {translate.translate("datasets.my_datasets")}
          </div>
          <div className="card-body">
            <CCol xs="12" lg="12">
              <CCard>
                <CCardHeader>
                  <CButton onClick={this.handleButtonClick} name="local" color="success">{translate.translate("datasets.import_from_local")}</CButton>
                  <CButton onClick={this.handleButtonClick} name="url" style={{ marginLeft: 10 }} color="warning">{translate.translate("datasets.import_from_url")}</CButton>
                  <CButton onClick={this.handleButtonClick} name="twitter" style={{ marginLeft: 10 }} color="primary">{translate.translate("datasets.import_from_twitter")}</CButton>

                </CCardHeader>
                <CCardBody>
                  <CDataTable
                    items={this.state.datasets}
                    fields={fields}
                    striped
                    sorter
                    hover
                    columnFilter
                    tableFilter
                    itemsPerPage={10}
                    pagination
                    onRowClick={this.handleRowClick}
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

export default Datasets

/*

                  <CButton color="success">{translate.translate("datasets.import_from_local")}</CButton>
                  <CButton style={{ marginLeft: 10 }} color="warning">{translate.translate("datasets.import_from_url")}</CButton>
                  <CButton style={{ marginLeft: 10 }} color="primary">{translate.translate("datasets.import_from_twitter")}</CButton>
                  <CButton style={{ marginLeft: 10 }} color="danger">{translate.translate("datasets.import_from_api")}</CButton>

                  <CButton onClick={this.handleButtonClick} name="api" style={{ marginLeft: 10 }} color="danger">{translate.translate("datasets.import_from_api")}</CButton>

*/
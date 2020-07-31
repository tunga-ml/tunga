import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import { CCol,  CBadge,
    CCard,
    CCardBody,
    CCardHeader,
    CDataTable,
    CButton,
    CRow } from '@coreui/react'
import { rgbToHex } from '@coreui/utils/src'
import usersData from '../users/UsersData'

const ThemeView = () => {
  const [color, setColor] = useState('rgb(255, 255, 255)')
  const ref = createRef()

  useEffect(() => {
    const el = ref.current.parentNode.firstChild
    const varColor = window.getComputedStyle(el).getPropertyValue('background-color')
    setColor(varColor)
  }, [ref])

  return (
    <table className="table w-100" ref={ref}>
      <tbody>
      <tr>
        <td className="text-muted">HEX:</td>
        <td className="font-weight-bold">{ rgbToHex(color) }</td>
      </tr>
      <tr>
        <td className="text-muted">RGB:</td>
        <td className="font-weight-bold">{ color }</td>
      </tr>
      </tbody>
    </table>
  )
}

const ThemeColor = ({className, children}) => {
  const classes = classNames(className, 'theme-color w-75 rounded mb-3')
  return (
    <CCol xl="2" md="4" sm="6" xs="12" className="mb-4">
      <div className={classes} style={{paddingTop: '75%'}}></div>
      {children}
      <ThemeView/>
    </CCol>
  )
}

const fields = ['name','registered', 'role', 'status']

const getBadge = status => {
    switch (status) {
      case 'Active': return 'success'
      case 'Inactive': return 'secondary'
      case 'Pending': return 'warning'
      case 'Banned': return 'danger'
      default: return 'primary'
    }
  }

class Projects extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        return (
        <>
        <div className="card">
            <div className="card-header">
            Projects
            </div>
            <div className="card-body">
            <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
                <CButton color="success">New Project</CButton>
                <CButton color="success">New Project2</CButton>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={usersData}
              fields={fields}
              striped
              itemsPerPage={5}
              pagination
              scopedSlots = {{
                'status':
                  (item)=>(
                    <td>
                      <CBadge color={getBadge(item.status)}>
                        {item.status}
                      </CBadge>
                    </td>
                  )

              }}
            />
            </CCardBody>
          </CCard>
        </CCol>
            </div>
        </div>
        </>
  )}
}

export default Projects

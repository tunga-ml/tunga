import React from 'react'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

// routes config
import routes from '../routes'

import { 
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks
}  from './index'

const TheHeader = () => {
  return (
    <CHeader withSubheader>
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">

      </CHeaderNav>

      <CHeaderNav className="px-3">
        <TheHeaderDropdown/>
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter 
          className="border-0 c-subheader-nav m-0 px-0 px-md-3" 
          routes={routes} 
        />
          <div className="d-md-down-none mfe-2 c-subheader-nav">
            <CLink className="c-subheader-nav-link"href="https://github.com/tahtaciburak/tunga">
              <CIcon name="cil-speech" alt="Documentation" />&nbsp;Dokümantasyon
            </CLink>

          </div>
      </CSubheader>
    </CHeader>
  )
}

export default TheHeader

/**
 * 
 * 
 * 
 *         
 *      <TheHeaderDropdownNotif/>
        <TheHeaderDropdownTasks/>
        <TheHeaderDropdownMssg/>

 */
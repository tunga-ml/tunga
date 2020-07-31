import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { inject, observer } from 'mobx-react';

import translate from '../services/i18n/Translate';

@inject("AuthStore")

@observer
class TheHeaderDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout(){
    this.props.AuthStore.clearLoginProps();
  }
  render() {
    return (
      <CDropdown
        inNav
        className="c-header-nav-items mx-2"
        direction="down"
      >
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div className="c-avatar" style={{backgroundColor:"gray",color:"white",fontSize:23}}>
            {this.props.AuthStore.userData[0].toUpperCase()}
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem
            header
            tag="div"
            color="light"
            className="text-center"
          >
            <strong>{translate.translate("header_dropdown.account")}</strong>
          </CDropdownItem>
          <CDropdownItem divider />
          <CDropdownItem onClick={this.handleLogout}>
            <CIcon name="cil-lock-locked" className="mfe-2" />
            {translate.translate("header_dropdown.logout")}
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    )

  }
}

export default TheHeaderDropdown

/**
 * 
 * 
 *           <CDropdownItem>
            <CIcon name="cil-user" className="mfe-2" />Profile
          </CDropdownItem>

 */
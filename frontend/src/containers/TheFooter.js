import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://github.com/tahtaciburak/tunga" target="_blank" rel="noopener noreferrer">TUNGA</a>
        <span className="ml-1">&copy; 2020 Made with LOVE </span>
      </div>
      <div className="mfs-auto">
        <a href="https://github.com/tahtaciburak/tunga" target="_blank" rel="noopener noreferrer">Version X.X.X</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)

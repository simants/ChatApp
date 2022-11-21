import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)

  return (
    <div className='navbar'>
      <span className="logo">Secure Chat</span>
      <div className="user">
        <span>{currentUser.displayName}</span>
      </div>
    </div>
  )
}

export default Navbar
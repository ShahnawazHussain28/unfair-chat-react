import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import ChatPage from './ChatPage'

export default function Dashboard(){
  return (
    <div className='d-flex p-0' style={{height: "100vh"}}>
        <Sidebar />
        <ChatPage />
    </div>
  )
}

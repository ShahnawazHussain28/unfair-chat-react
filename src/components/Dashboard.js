import React from 'react'
import Sidebar from './Sidebar'
import ChatPage from './ChatPage'
import { useConversation } from './ConversationProvider'

export default function Dashboard() {
  const { activeConversation } = useConversation();
  const width = window.innerWidth;
  const isMobile = width <= 768;
  return (
    <div className='d-flex p-0' style={{ height: "100vh" }}>
      {isMobile && (activeConversation ? <ChatPage /> : <Sidebar/> )}
      {!isMobile && <><Sidebar /> <ChatPage/></>}
      
    </div>
  )
}

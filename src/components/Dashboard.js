import React from 'react'
import Sidebar from './Sidebar'
import ChatPage from './ChatPage'
import { useConversation } from './ConversationProvider'

export default function Dashboard() {
  const { activeConversation } = useConversation();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width <= 768;
  return (
    <div className='d-flex p-0' style={{ height: height }}>
      {isMobile && (activeConversation ? <ChatPage /> : <Sidebar/> )}
      {!isMobile && <><Sidebar /> <ChatPage/></>}
      
    </div>
  )
}

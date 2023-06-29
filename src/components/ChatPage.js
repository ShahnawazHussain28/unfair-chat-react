import React, { useRef } from 'react'
import ChatHeader from './ChatHeader'
import { useConversation } from './ConversationProvider'
import { Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';

export default function ChatPage() {
  const { activeConversation: conversation, setMessage, selectConversation } = useConversation();
  const msgRef = useRef();

  function sendMessage() {
    const id = conversation.id;
    const text = msgRef.current.value;
    if(text === '') return;
    const msg = {
      text: msgRef.current.value,
      time: new Date().toString(),
      fromMe: true,
      status: 'sent'
    }
    msgRef.current.value = '';
    setMessage(id, conversation.name, msg);
    selectConversation(0);
  }
  return (
    <div className='flex-grow-1 d-flex flex-column'>
      {conversation !== undefined &&
        <>
          <ChatHeader conversation={conversation} />
          <Container className='flex-grow-1 d-flex flex-column-reverse chat-container' style={{ overflowY: 'auto' }}>
            {conversation.msg.map((msg, i) => (
              <div className={`bg-dark text-white p-2 m-1 rounded msg ${msg.fromMe? 'from-me' : ''}`} key={i}>{msg.text}</div>
            ))}
          </Container>
          <Container className='d-flex align-items-center p-2'>
            <textarea ref={msgRef} className='flex-grow-1 rounded-5 fs-5 p-2' rows={1}></textarea>
            <Button className='h-100 ms-3' style={{ aspectRatio: '1 / 1' }} onClick={sendMessage}>
              <FontAwesomeIcon icon={faShare} />
            </Button>
          </Container>
        </>
      }
    </div>
  )
}

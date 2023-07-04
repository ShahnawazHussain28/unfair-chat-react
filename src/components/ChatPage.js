import React, { useEffect, useRef, useState } from 'react'
import ChatHeader from './ChatHeader'
import { useConversation } from './ConversationProvider'
import { Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { useSocket } from './SocketProvider';

export default function ChatPage() {
  const { activeConversation: conversation, sendMsg, updateBlueTick } = useConversation();
  const [ghostText, setGhostText] = useState('');
  const [msgText, setMsgText] = useState('');
  const [typing, setTyping] = useState(false);
  const { socket } = useSocket();
  const msgRef = useRef();
  const ghostRef = useRef();

  function handleSubmit() {
    const id = conversation.id;
    const text = msgRef.current.value;
    if (text === '') return;
    const msg = {
      text: msgRef.current.value,
      time: new Date().toString(),
      fromMe: true
    }
    msgRef.current.value = '';
    sendMsg(id, msg);
  }
  function emitTypingStatus() {
    socket.emit('typing', { recipient: conversation.id, text: msgRef.current.value });
  }
  function emitStopTypingStatus() {
    socket.emit('stop-typing', { recipient: conversation.id });
  }


  useEffect(() => {
    if (!conversation) return () => { };
    emitTypingStatus();
    const timeoutIndex = setTimeout(() => {
      emitStopTypingStatus();
    }, 2000)
    return () => clearTimeout(timeoutIndex)
  }, [msgText])

  useEffect(() => {
    if (socket == null) return () => { };
    socket.on('receive-typing', ({ sender, text }) => {
      if (conversation?.id === sender) {
        ghostRef.current.style.display = 'block';
        setTyping(true);
        setGhostText(text);
      }
    })
    socket.on('receive-stop-typing', ({ sender }) => {
      if (conversation?.id === sender) {
        ghostRef.current.style.display = 'none';
        setTyping(false);
        setGhostText('');
      }
    })
    socket.on('blue-tick-update', ({sender}) => {
      updateBlueTick(sender)
    })
    return () => {
      socket.off('receive-typing');
      socket.off('receive-stop-typing');
      socket.off('blue-tick-update');
    }
  }, [socket, conversation, ghostRef])


  return (
    <div className='flex-grow-1 d-flex flex-column'>
      {conversation &&
        <>
          <ChatHeader typing={typing} />
          <Container className='flex-grow-1 d-flex flex-column-reverse chat-container' style={{ overflowY: 'auto' }}>
            <div id='ghost-msg' ref={ghostRef} className='bg-dark text-white p-2 m-1 rounded msg' style={{ display: 'none', opacity: 0.6 }}>{ghostText}</div>
            {conversation.msg.map((msg, i) => (
              <div className={`bg-dark text-white p-2 m-1 rounded msg ${msg.fromMe ? 'from-me' : ''}`} key={i}>
                <div className='msg-text mx-2'>{msg.text}</div>
                <span className={`m-0 p-0 msg-time ${msg.fromMe ? 'from-me' : ''}`} key={i}>{new Date(msg.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' })}</span>
                {msg.fromMe && <FontAwesomeIcon className='msg-tick' icon={i < conversation.seen? faCheck : faCheckDouble} />}
              </div>
            ))}
          </Container>
          <Container className='d-flex align-items-center p-2'>
            <textarea ref={msgRef} className='flex-grow-1 rounded-5 fs-5 p-2' rows={1} onInput={e => setMsgText(e.target.value)}></textarea>
            <Button className='h-100 ms-3' style={{ aspectRatio: '1 / 1' }} onClick={handleSubmit}>
              <FontAwesomeIcon icon={faShare} />
            </Button>
          </Container>
        </>
      }
    </div>
  )
}

import { faArrowLeft, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Container, Dropdown, Modal } from 'react-bootstrap'
import { useConversation } from './ConversationProvider';
import { URL } from './config';
import { useSocket } from './SocketProvider';

export default function ChatHeader({ typing, stopTyping }) {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const { activeConversation: conversation, setConversations, selectConversation, setContacts, myProfile } = useConversation();
    const { socket } = useSocket();
    function closeModal() {
        setShowDetailsModal(false);
    }
    function exitChat() {
        stopTyping();
        selectConversation(null);
    }
    function clearChat() {
        if (!window.confirm("Are you sure you want to clear the chat. You cannot get them back !")) return;
        setConversations(prev => {
            let newConversations = prev.map(conv => {
                if (conv.id === conversation.id) return { ...conv, msg: [] }
                return conv;
            })
            return newConversations;
        })
    }
    async function fetchAndShowDetails() {
        setShowDetailsModal(true);
        let res = await fetch(URL + 'get-dp/' + conversation.id);
        let { dp } = await res.json();
        res = await fetch(URL + 'get-talking-to/' + conversation.id);
        let talkingTo = await res.json();
        setConversations(prev => {
            let newConversations = prev.map(conv => {
                if (conv.id === conversation.id) return { ...conv, dp, talkingTo }
                return conv;
            })
            return newConversations;
        })
    }

    function deleteContact() {
        if (!window.confirm("This contact along with this chat will be deleted permanently. You cannot get them back !")) return;
        selectConversation(null);
        setContacts(prev => prev.filter(c => c !== conversation.id));
        setConversations(prev => prev.filter(conv => conv.id !== conversation.id));
    }

    function getDisplayStatus() {
        let status = conversation.status;
        if(status === 'Online') return 'Online';
        let time = new Date(conversation.status).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' });
        let date = new Date(conversation.status);
        return date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? date.toLocaleDateString("en-GB") : time;
    }
    let status = getDisplayStatus();

    return (
        <>
            {conversation &&
                <>
                    <div className='shadow py-3 d-flex w-100 px-4 align-items-center' style={{ width: "100%" }}>
                        <FontAwesomeIcon onClick={exitChat} icon={faArrowLeft} className='p-2 me-2 rounded-circle' style={{ background: '#ddd', cursor: 'pointer' }} />
                        <div className='me-3' style={{ fontSize: '40px' }}>{conversation.dp}</div>
                        <div onClick={fetchAndShowDetails} className='flex-grow-1' style={{ cursor: 'pointer' }}>
                            <div className='fs-4' style={{ fontWeight: 500 }}>{conversation.name}</div>
                            <div style={{ fontSize: '0.9rem' }}>{typing ? "Typing..." : status}</div>
                        </div>
                        <Dropdown align={"end"}>
                            <Dropdown.Toggle variant='light'>
                                <FontAwesomeIcon icon={faEllipsisV} size='lg' />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={clearChat}>Clear Chat</Dropdown.Item>
                                <Dropdown.Item onClick={deleteContact}>Delete Contact</Dropdown.Item>
                                <Dropdown.Item>Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <Modal show={showDetailsModal} onHide={closeModal}>
                        <Container className='py-4 d-flex flex-column align-items-center justify-content-center'>
                            <div style={{ fontSize: 120, textShadow: '0 0 10px black' }}>{conversation.dp}</div>
                            <h3>{conversation.name}</h3>
                            <h3 className='fs-5 p-2 rounded' style={{ background: '#aaa' }}>{conversation.id}</h3>
                            <p className='fs-4'>{conversation.status === 'Online' ? 'Online' : `Last seen: ${conversation.status}`}</p>
                            <div className='bg-dark text-white d-flex flex-column align-items-center p-3 rounded-4'>
                                <p className='border-bottom'>Talking to</p>
                                <h3>{conversation.talkingTo.id === myProfile.id ? "You" : conversation.talkingTo.id}</h3>
                                <h3 className='fs-5 p-2 rounded' style={{ background: '#555' }}>{conversation.talkingTo.name}</h3>
                            </div>
                        </Container>
                    </Modal>
                </>
            }
        </>
    )
}

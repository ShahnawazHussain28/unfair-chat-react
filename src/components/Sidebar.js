import React, { useEffect, useRef, useState } from 'react'
import { Button, Container, Form, ListGroup } from 'react-bootstrap'
import Header from './Header';
import { Modal } from 'react-bootstrap';
import { useConversation } from './ConversationProvider';
import { useSocket } from './SocketProvider';

export default function Sidebar() {
    const [showNewContactModal, setShowNewContactModal] = useState(false);
    const [filtered, setFiltered] = useState('');
    const [filteredContacts, setFilteredContacts] = useState();
    const { createContact, conversations, activeConversation, selectConversation, myProfile } = useConversation();
    const { socket } = useSocket();
    function closeModal() { setShowNewContactModal(false) }
    function openModal() { setShowNewContactModal(true) }
    const idRef = useRef()
    function handleSubmit(e) {
        e.preventDefault();
        createContact(idRef.current.value);
        closeModal();
    }
    function changeConversation(idx, id) {
        if (activeConversation) socket.emit('stop-typing', { recipient: activeConversation.id });
        socket.emit('blue-tick', { recipient: id, sender: myProfile.id });
        selectConversation(idx);
    }
    useEffect(() => {
        if(filtered === '') return () => {};
        let filteredConv = conversations.filter(c => c.id.toLowerCase().includes(filtered) || c.name.toLowerCase().includes(filtered));
        setFilteredContacts(filteredConv);
    }, [filtered])

    return (
        <>
            <div className='d-flex flex-column h-100 border shadow-sm' style={{ width: '400px' }}>
                <Header openModal={openModal} setFiltered={setFiltered} />
                <ListGroup className='flex-grow-1'>
                    {filtered !== '' && filteredContacts ? filteredContacts.map((conversation, idx) => (
                        <ListGroup.Item className='py-2 d-flex align-items-center' style={{ cursor: 'pointer', background: conversation === activeConversation ? 'rgba(200, 200, 255)' : '' }} onClick={() => changeConversation(idx, conversation.id)} key={idx}>
                            <div className='fs-2'>{conversation.dp}</div>
                            <div className='ps-3'>{conversation.name}</div>
                        </ListGroup.Item>
                    )):
                    conversations && conversations.map((conversation, idx) => (
                        <ListGroup.Item className='py-2 d-flex align-items-center' style={{ cursor: 'pointer', background: conversation === activeConversation ? 'rgba(200, 200, 255)' : '' }} onClick={() => changeConversation(idx, conversation.id)} key={idx}>
                            <div className='fs-2'>{conversation.dp}</div>
                            <div className='ps-3'>{conversation.name}</div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <div className='w-100 text-center p-3 fs-6 border-top'>Your Number: {myProfile.id}</div>
            </div>
            <Modal show={showNewContactModal} onHide={closeModal} className='p-3'>
                <Container>
                    <Modal.Title>Create New Contact</Modal.Title>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control type='tel' maxLength={10} ref={idRef} />
                            </Form.Group>
                            <Button type='submit' className='my-4'>Create</Button>
                        </Form>
                    </Modal.Body>
                </Container>
            </Modal>
        </>
    )
}

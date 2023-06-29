import React, { useRef, useState } from 'react'
import { Button, Container, Form, ListGroup } from 'react-bootstrap'
import Header from './Header';
import { Modal } from 'react-bootstrap';
import { useConversation } from './ConversationProvider';

export default function Sidebar() {
    const [showNewContactModal, setShowNewContactModal] = useState(false);
    const { createContact, conversations, activeConversation, selectConversation } = useConversation();
    function closeModal() { setShowNewContactModal(false) }
    function openModal() { setShowNewContactModal(true) }
    const idRef = useRef()
    const nameRef = useRef()
    function handleSubmit(e) {
        e.preventDefault();
        createContact(idRef.current.value, nameRef.current.value);
        closeModal();
    }
    function setActiveConversation(id) {
        for (let i = 0; i < conversations.length; i++) {
            if (conversations[i].id === id) {
                selectConversation(i);
                break;
            }
        }
    }
    return (
        <>
            <div className='d-flex flex-column h-100 border shadow-sm' style={{ width: '400px' }}>
                <Header openModal={openModal} closeModal={closeModal} />
                <ListGroup className='flex-grow-1'>
                    {activeConversation !== undefined && conversations.map((conversation, idx) => (
                        <ListGroup.Item className='py-2 d-flex align-items-center' style={{background: conversation === activeConversation ? 'rgba(200, 200, 255)' : ''}} onClick={() => setActiveConversation(conversation.id)} key={conversation.id}>
                            <div className='fs-2'>😊</div>
                            <div className='ps-3'>{conversation.name}</div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
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
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type='text' ref={nameRef} />
                            </Form.Group>
                            <Button type='submit' className='my-4'>Create</Button>
                        </Form>
                    </Modal.Body>
                </Container>
            </Modal>
        </>
    )
}

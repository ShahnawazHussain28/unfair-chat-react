import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Container, Dropdown, Modal } from 'react-bootstrap'
import { useConversation } from './ConversationProvider';

export default function ChatHeader() {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const {activeConversation: conversation} = useConversation();
    function closeModal(){
        setShowDetailsModal(false);
    }

    return (
        <>
        {conversation !== undefined && 
            <>
            <div className='shadow py-3 d-flex w-100 px-4 align-items-center' style={{ width: "100%" }}>
                <div className='me-3' style={{fontSize: '40px'}}>😊</div>
                <div onClick={() => setShowDetailsModal(p => !p)} className='flex-grow-1' style={{ cursor: 'pointer' }}>
                    <div className='fs-4' style={{ fontWeight: 500 }}>{conversation.name}</div>
                    <div style={{ fontSize: '0.9rem' }}>11:59 pm</div>
                </div>
                <Dropdown align={"end"}>
                    <Dropdown.Toggle variant='light'>
                        <FontAwesomeIcon icon={faEllipsisV} size='lg' />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>Action 1</Dropdown.Item>
                        <Dropdown.Item>Another Action 2</Dropdown.Item>
                        <Dropdown.Item>Something else</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <Modal show={showDetailsModal} onHide={closeModal}>
                <Container className='py-4 d-flex flex-column align-items-center justify-content-center'>
                    <div style={{fontSize: 120, textShadow: '0 0 10px black'}}>😒</div>
                    <h3>{conversation.name}</h3>
                    <h3 className='fs-5 p-2 rounded' style={{background: '#aaa'}}>{conversation.id}</h3>
                    <p className='fs-4'>Online</p>
                    <div className='bg-dark text-white d-flex flex-column align-items-center p-3 rounded-4'>
                        <p className='border-bottom'>Talking to</p>
                        <h3>Someone</h3>
                        <h3 className='fs-5 p-2 rounded' style={{background: '#555'}}>9929294524</h3>
                    </div>
                </Container>
            </Modal>
            </>
        }
        </>
    )
}

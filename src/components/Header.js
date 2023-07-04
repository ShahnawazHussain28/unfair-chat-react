import { Container, Dropdown, Modal, NavbarBrand } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faSearch, faAddressBook, faTimes, faExpand } from '@fortawesome/free-solid-svg-icons';
import React, { useRef, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { useConversation } from './ConversationProvider';
import { POST } from './config';


const emojis = [..."😀😁😂🤣😄😅😉😊😋😎😍🥰😘🥲🤗☺️🙄🤐😌😕😔😓🙃🫠😤😭😧😦😨😩🤯😱🥵😡🥴😵‍💫🤬🥸😇🤓🤥🤫🤭💀🤡🙊🙉🙈🧟‍♂️🫦👀👍👎🤙🤘👌✍️🤲"]

export default function Header({ openModal }) {
  const [showSearch, setShowSearch] = useState(false);
  const { logOut, deleteAccount, myProfile, setMyProfile } = useConversation();
  const [showModal, setShowModal] = useState(false);

  function closeSearch() {
    searchRef.current.value = '';
    setShowSearch(false);
  }
  async function setDP(emoji) {
    let data = await POST('set-dp', { id: myProfile.id, dp: emoji });
    setMyProfile(prev => {
      let profile = {...prev};
      profile.dp = emoji;
      return profile;
    })
    setShowModal(false);
    alert(data.message);
  }
  const searchRef = useRef();
  return (
    <>
      <Navbar className='d-flex flex-column' style={{ zIndex: 1 }}>
        <div className='shadow py-3 d-flex w-100 px-4 align-items-center'>
          <NavbarBrand style={{ flexGrow: 1, fontWeight: 500 }}>Unfair Chat</NavbarBrand>
          <FontAwesomeIcon icon={faExpand} className='p-2 rounded-5 fs-5' />
          <FontAwesomeIcon onClick={openModal} icon={faAddressBook} className='p-2 rounded-5 fs-5' />
          <FontAwesomeIcon onClick={() => setShowSearch(true)} icon={faSearch} className='p-2 rounded-5' id='searchIcon' />
          <Dropdown align={"end"}>
            <Dropdown.Toggle variant='light'>
              <FontAwesomeIcon icon={faEllipsisV} size='lg' />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowModal(true)}>Change DP</Dropdown.Item>
              <Dropdown.Item onClick={logOut}>Log Out</Dropdown.Item>
              <Dropdown.Item onClick={deleteAccount}>Delete Account</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Container className={`d-flex w-100 ${showSearch ? 'search-expanded' : 'search-collapsed'}`} style={{ boxSizing: 'border-box', transition: '0.5s' }}>
          <input ref={searchRef} type={'text'} className={`flex-grow-1 rounded w-100 mx-4 fs-5`} style={{ height: "100%", border: `${showSearch ? '1px solid gray' : 'none'}` }} />
          <span onClick={closeSearch} style={{ marginLeft: -50, position: 'relative', left: -20, cursor: 'pointer' }} className={`${showSearch ? '' : 'd-none'} p-3`}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </Container>
      </Navbar>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title> Set DP </Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-wrap' style={{ justifyContent: 'space-evenly' }}>
          <div className='rounded-5 shadow' style={{fontSize: '7em', marginTop: '-10px'}}>
            {myProfile.dp}
          </div>
          <div>
          {emojis.map((emoji, i) =>
            <span key={i} role='button' className='emoji rounded-3 fs-2' onClick={() => setDP(emoji)}>{emoji}</span>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

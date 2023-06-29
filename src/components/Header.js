import { Container, Dropdown, NavbarBrand } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faSearch, faAddressBook, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useRef, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';

export default function Header({openModal, closeModal}) {
  const [showSearch, setShowSearch] = useState(false);
  function closeSearch(){
    searchRef.current.value = '';
    setShowSearch(false);
  }
  const searchRef = useRef();
  return (
    <Navbar className='d-flex flex-column' style={{zIndex: 1}}>
      <div className='shadow py-3 d-flex w-100 px-4 align-items-center'>
          <NavbarBrand style={{flexGrow: 1, fontWeight: 500}}>Unfair Chat</NavbarBrand>
          <FontAwesomeIcon onClick={openModal} icon={faAddressBook} className='p-3 rounded-5 fs-5' id='searchIcon' />
          <FontAwesomeIcon onClick={()=>setShowSearch(true)} icon={faSearch} className='p-3 rounded-5' id='searchIcon' />
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
      <Container className={`d-flex w-100 ${showSearch ? 'search-expanded' : 'search-collapsed'}`} style={{boxSizing: 'border-box', transition: '0.5s'}}>
        <input ref={searchRef} type={'text'} className={`flex-grow-1 rounded w-100 mx-4 fs-5`} style={{height: "100%", border: `${showSearch? '1px solid gray': 'none'}`}}/>
        <span onClick={closeSearch} style={{marginLeft: -50, position: 'relative', left: -20, cursor: 'pointer'}} className={`${showSearch ? '' : 'd-none'} p-3`}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </Container>
    </Navbar>
  )
}

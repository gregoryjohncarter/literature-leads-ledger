import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';

const NavbarApp = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/' style={{
            fontFamily: 'Baskerville',
            fontWeight: 'bold',
            fontSize: '25px'
          }}>
            <span style={{textDecoration: 'underline', textDecorationColor: 'darkseagreen'}}>Literature</span> <span style={{textDecoration: 'underline', textDecorationColor: 'cadetblue'}}>Leads</span> <span style={{textDecoration: 'underline', textDecorationColor: 'cornflowerblue'}}>Ledger</span> 📖
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar'>
            <Nav className='ml-auto'>
              {/* if user is logged in show logout link*/}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link style={{fontStyle: 'Lucida Console', fontSize: '20px', fontWeight: 'bold'}} onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link style={{fontStyle: 'Lucida Console', fontSize: '20px', fontWeight: 'bold'}} onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default NavbarApp;
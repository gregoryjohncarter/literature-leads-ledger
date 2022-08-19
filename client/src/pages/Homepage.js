import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { QUERY_BOOKS, QUERY_ME } from '../utils/queries';
import { Container, Col, Form, Button, Card, CardColumns, Modal } from 'react-bootstrap';
import Search from '../components/Search';
import auth from '../utils/auth';

const Homepage = () => {
  const { data: savedBooks } = useQuery(QUERY_BOOKS);
  const { data: user } = useQuery(QUERY_ME);
  const books = savedBooks || { books: [] };
  const [savedBookIds, setSavedBookIds] = useState();
  console.log(books);
  console.log(user);

  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoSelection, setInfoSelection] = useState('');

  console.log(infoSelection);

  const handleSelectModal = (book) => {
    setInfoSelection(book);
    setShowInfoModal(true)
  }

  const updateIds = useEffect(() => {
    setSavedBookIds(books.books.map((books) => {
      return books.bookId;
    }))
  }, [savedBooks])

  const checkRemoveButton = (bookToSave) => {
    for (let i = 0; i < savedBookIds.length; i++) {
        if (bookToSave.user === user.me.username) {
            return true; 
        }
    }
    return false;
  }

  return (
    <>
      <div style={{backgroundColor: '#b5b5b5', borderTop: '6px solid lightgray'}}>
        <Search savedBookIds={savedBookIds}></Search>
      </div>
      <div className='displayGrid' style={{borderTop: '8px dotted darkslategray'}}>
        {books.books.map((book) => {
          return (
            <Col key={book.bookId} className='gridItem'>
              <Card className='border-0' border='dark' style={{fontFamily: 'Baskerville', color: 'whitesmoke'}}>
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' style={{height: '250px', width: '170px'}}/>
                ) : null}
                <Card.Body style={{border:'3px solid black', backgroundColor: 'black', marginTop: '20px'}}>
                  <Card.Title className='titleTrim'>{book.title}</Card.Title>
                  <Card.Text><p className='authorTrim'><span style={{fontStyle:'italic', fontSize: '22px'}}>Authors: </span>{book.authors}</p></Card.Text>
                  <Button variant='success' size='lg' onClick={() => handleSelectModal(book)}>More info</Button> 
                  {/* {auth.loggedIn() && checkRemoveButton(book) && 
                    <Button variant='danger' size='lg' onClick={() => removeBook(book.bookId)}>Remove this recommendation</Button> 
                  } */}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </div>
      <Modal
        size='lg'
        show={showInfoModal}
        onHide={() => setShowInfoModal(false)}
        aria-labelledby='info-modal'
      >
        <Modal.Header closeButton style={{backgroundColor: 'grey'}}>
          <Modal.Title id='info-modal' style={{backgroundColor: 'grey', color: 'lightgrey'}}>
            <h2 style={{fontFamily: 'Times New Roman'}}>
              {infoSelection.title}
            </h2>
          </Modal.Title>
        </Modal.Header>
      </Modal>
    </>
  )
}

export default Homepage;
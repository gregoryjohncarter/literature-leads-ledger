import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_BOOK, ADD_LIKE, REMOVE_LIKE } from '../utils/mutations';
import { QUERY_BOOKS, QUERY_ME } from '../utils/queries';
import { Container, Col, Button, Card, Modal } from 'react-bootstrap';
import Search from '../components/Search';
import auth from '../utils/auth';

const Homepage = () => {
  const { data: savedBooks, refetch } = useQuery(QUERY_BOOKS);
  const { data: user } = useQuery(QUERY_ME); 
  const books = savedBooks || { books: [] };
  const [savedBookIds, setSavedBookIds] = useState([]);
  
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoSelection, setInfoSelection] = useState('');

  const [addLike] = useMutation(ADD_LIKE);
  const [removeLike] = useMutation(REMOVE_LIKE);

  const handleSelectModal = (book) => {
    setInfoSelection(book);
    setShowInfoModal(true)
  };

  const updateIds = useEffect(() => {
    setSavedBookIds(books.books.map((books) => {
      return books.bookId;
    }))
  }, [savedBooks]);

  const updateQuery = useEffect(() => { refetch() }, [showInfoModal])

  const handleLikeUnlike = async (selection, id) => {
    const token = auth.loggedIn() ? auth.getToken() : null;

    if (!token) {
        return false;
    }

    if (selection === 'like') {
      try {
        const liked = await addLike({
          variables: { bookId: id },
          headers: {
              authorization: `Bearer ${token}`
          }
        });
        refetch();
      } catch (err) {
        console.error(err);
      }
    } else if (selection === 'unLike') { 
      try {
        const unLiked = await removeLike({
          variables: { bookId: id },
          headers: {
              authorization: `Bearer ${token}`
          }
        });
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  }

  const checkLikeStatus = (book) => {
    if (user) {
      for (let x = 0; x < book.likes.length; x++) {
        if (book.likes[x] === user.me.username) {
          return false; 
        }
      }
    }
    return true;
  }

  // check if book was user's own submission
  const checkUserCreator = (book) => {
    if (user) {
      if (book.user === user.me.username) {
        return true;
      }
    }
    return false
  }

  const handleRemoveBook = async (id) => {
    const token = auth.loggedIn() ? auth.getToken() : null;

    if (!token) {
        return false;
    }

    try {
      const removed = await removeBook({
        variables: { bookId: id },
        headers: {
            authorization: `Bearer ${token}`
        }
      });
      setShowInfoModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div style={{backgroundColor: '#b5b5b5', borderTop: '6px solid lightgray'}}>
        <Search savedBookIds={savedBookIds} refetch={refetch}></Search>
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
                  <Card.Text className='authorTrim'><span style={{fontStyle:'italic', fontSize: '22px'}}>Authors: </span>{book.authors}</Card.Text>
                  <Button style={{display:'inline-block'}} variant='success' size='md' onClick={() => handleSelectModal(book)}>Details</Button>
                  {!auth.loggedIn() || checkUserCreator(book) ? <div style={{display:'inline', marginLeft: '18px'}}>
                    ⬆ <p style={{display:'inline', fontFamily: 'Verdana'}}>{book.likeCount}</p>
                  </div> : auth.loggedIn() && !checkUserCreator(book) && checkLikeStatus(book) ? <div style={{display:'inline', marginLeft: '18px'}}><Button style={{display:'inline', backgroundColor:'grey', marginRight: '8px'}} onClick={() => handleLikeUnlike('like', book.bookId)} size='sm'>⬆</Button>
                  <p style={{display:'inline', fontFamily: 'Verdana'}}>{book.likeCount}</p>
                  </div> : <div style={{display:'inline', marginLeft: '18px'}}><Button style={{display:'inline', marginRight: '8px'}} onClick={() => handleLikeUnlike('unLike', book.bookId)} size='sm'>⬆</Button>
                  <p style={{display:'inline', fontFamily: 'Verdana'}}>{book.likeCount}</p>
                  </div>}
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
        <Modal.Header closeButton style={{backgroundColor: '#333333'}}>
          <Modal.Title id='info-modal' style={{backgroundColor: '#333333', color: 'lightgrey'}}>
            <h2 style={{fontFamily: 'Times New Roman'}}>
              {infoSelection.title}
            </h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor:'black'}}>
          <Container>
            <div className='bookImg'>
              <img className='mobileBook' src={infoSelection.image} alt={`The cover for ${infoSelection.title}`} style={{height: '500px', width: '350px', margin: 'auto', display: 'block'}}/>
            </div>
            <div className='infoFlex'>
              <div className='infoItem'>
                <p><span style={{borderTop: '5px solid grey'}}>Score: </span>{infoSelection.averageRating}</p>
              </div>
              <div className='infoItem'>
                <p><span style={{borderTop: '5px solid grey'}}>Published: </span>{infoSelection.publishedDate}</p>
              </div>
              <div className='infoItem'>
                <p><span style={{borderTop: '5px solid grey'}}>Pages: </span>{infoSelection.pageCount}</p>
              </div>
              <div className='infoItem'>
                <p style={{color: 'gainsboro'}}><span style={{fontStyle: 'italic', color: 'darkgrey'}}>Authors:</span> {infoSelection.authors}</p>
              </div>
              <div className='infoItem'>
                <p style={{color: 'gainsboro'}}><span style={{fontStyle: 'italic', color: 'darkgrey'}}>Category:</span> {infoSelection.categories}</p>
              </div>
              <div className='infoItem description'>
                <p>{infoSelection.description}</p>
                <Button disabled size='md'>Added by: [{infoSelection.user}]</Button>
              </div>
            </div>
            {auth.loggedIn() && checkUserCreator(infoSelection) && 
              <Button variant='danger' size='lg' onClick={() => handleRemoveBook(infoSelection.bookId)}>Delete my recommendation</Button> 
            }
          </Container>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Homepage;
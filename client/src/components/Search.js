import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK } from '../utils/mutations';
import { Container, Col, Form, Button, Card, CardColumns, Modal } from 'react-bootstrap';
import auth from '../utils/auth';

const Search = (props) => {
  const [addBook, { error }] = useMutation(ADD_BOOK);
  const [searchedBooks, setSearchedBooks] = useState([]); // keep track of returned google api data
  const [searchInput, setSearchInput] = useState('');
  const [showResultsModal, setShowResultsModal] = useState(false);

  const searchGoogleBooks = (query) => {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors ? book.volumeInfo.authors : ['No author to display'],
        title: book.volumeInfo.title ? book.volumeInfo.title : '',
        description: book.volumeInfo.description ? book.volumeInfo.description : '',
        pageCount: book.volumeInfo.pageCount ? book.volumeInfo.pageCount : '',
        averageRating: book.volumeInfo.averageRating ? book.volumeInfo.averageRating : '',
        publishedDate: book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate : '',
        categories: book.volumeInfo.categories ? book.volumeInfo.categories : '',
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink ? book.volumeInfo.infoLink : ''
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
      setShowResultsModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
      var newBookId = bookToSave.bookId;
      var newAuthors = bookToSave.authors ? bookToSave.authors : [''];
      var newTitle = bookToSave.title;
      var newDescription = bookToSave.description;
      var newPageCount = bookToSave.pageCount;
      var newAverageRating = bookToSave.averageRating;
      var newPublishedDate = bookToSave.publishedDate;
      var newCategories = bookToSave.categories[0] ? bookToSave.categories[0] : '';
      var newLink = bookToSave.link;
      var newImage = bookToSave.image;
    
    // get token
    const token = auth.loggedIn() ? auth.getToken() : null;

    if (!token) {
      return false;
    }
  
    try {
      await addBook({
        variables: { bookId: newBookId, authors: newAuthors, title: newTitle, description: newDescription, pageCount: String(newPageCount), averageRating: String(newAverageRating), publishedDate: newPublishedDate, categories: newCategories, link: newLink, image: newImage },
      });
      setShowResultsModal(false);
    } catch (e) {
        console.error(e);
    }
  };

  const checkButton = (bookToSave) => {
    for (let i = 0; i < props.savedBookIds.length; i++) {
        if (bookToSave.bookId === props.savedBookIds[i]) {
            return false; 
        }
    }
    return true;
  };

  const updateQuery = useEffect(() => { props.refetch() }, [showResultsModal])

  return (
    <>
      <Container>
        <h1 style={{fontFamily: 'Lucida Console', fontSize: '30px', marginTop: '15px', fontStyle: 'italic'}}>Find your book</h1>
        <Form onSubmit={handleFormSubmit}>
          <Form.Row>
            <Col xs={12} md={8}>
              <Form.Control
                name='searchInput'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type='text'
                size='lg'
                placeholder='Search by title'
                style={{fontFamily: 'Verdana'}}
              />
            </Col>
            <Col xs={12} md={4}>
              <Button style={{fontFamily: 'Baskerville'}} type='submit' variant='success' size='lg'>
                Submit
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </Container>
      <Modal
        size='lg'
        show={showResultsModal}
        onHide={() => setShowResultsModal(false)}
        aria-labelledby='results-modal'
      >
        <Modal.Header closeButton style={{backgroundColor: '#333333'}}>
          <Modal.Title id='results-modal' style={{backgroundColor: '#333333', color: 'lightsteelblue'}}>
            <h2 style={{fontFamily: 'Times New Roman'}}>
              {searchedBooks.length
                ? `Viewing ${searchedBooks.length} results:`
                : 'Search for a book to begin'}
            </h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor:'black'}}>
          <Container>
            <CardColumns>
              {searchedBooks.map((book) => {
                return (
                  <Card className='border-0' key={book.bookId} border='dark' style={{fontFamily: 'Trebuchet MS', backgroundColor: 'black', color: 'whitesmoke', background: 'repeating-linear-gradient(-55deg,#222,#222 10px,#333 10px,#333 20px)'}}>
                    {book.image ? (
                      <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' style={{height: '500px', width: '350px', margin: 'auto', display: 'block', backgroundColor: 'black'}}/>
                    ) : null}
                    <Card.Body style={{border:'3px solid black', backgroundColor: 'black'}}>
                      <Card.Title style={{marginTop: '15px', fontWeight:'bold', color: 'lightsteelblue'}}>{book.title}</Card.Title>
                      <Card.Text style={{color: 'gainsboro'}}><span style={{fontStyle: 'italic', color: 'darkgrey'}}>Authors:</span> {book.authors}</Card.Text>
                      <Card.Text style={{maxHeight: '17ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', display: 'inline-block', color:'lightgray'}}>{book.description}</Card.Text>
                      <Card.Text>{book.description.length > 400 && '...'}</Card.Text>
                      {!checkButton(book) && auth.loggedIn() ? ( <Button disabled variant='secondary' size='lg'>Already recommended</Button> ) : auth.loggedIn() && checkButton(book) ? (
                        <Button style={{color:'#FFFAFA'}} variant='success' size='lg' onClick={() => handleSaveBook(book.bookId)}>Recommend this</Button> ) : ( <Button disabled variant='secondary' size='lg'>Login to recommend</Button>
                      )}
                    </Card.Body>
                  </Card>
                );
              })}
            </CardColumns>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Search;
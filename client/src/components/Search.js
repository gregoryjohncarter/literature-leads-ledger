import React, { useState } from 'react';
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

      console.log(items);

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title || '',
        description: book.volumeInfo.description || '',
        pageCount: book.volumeInfo.pageCount || '',
        averageRating: book.volumeInfo.averageRating || '',
        publishedDate: book.volumeInfo.publishedDate || '',
        categories: book.volumeInfo.categories[0] || '',
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || ''
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
      setShowResultsModal(true);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
      var newBookId = bookToSave.bookId || "";
      var newAuthors = bookToSave.authors || "";
      var newTitle = bookToSave.title || "";
      var newDescription = bookToSave.description || "";
      var newPageCount = bookToSave.pageCount || '';
      var newAverageRating = bookToSave.averageRating || '';
      var newPublishedDate = bookToSave.publishedDate || '';
      var newCategories = bookToSave.categories || '';
      var newLink = bookToSave.link || "";
      var newImage = bookToSave.image || "";
    
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
      // setSavedBookIds([...savedBookIds, bookToSave.bookId]);
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
}

  return (
    <>
    {/* {auth.loggedIn() && (
    <> */}
      <Container>
        <h1>Find your book</h1>
        <Form onSubmit={handleFormSubmit}>
          <Form.Row>
            <Col xs={12} md={8}>
              <Form.Control
                name='searchInput'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type='text'
                size='lg'
                placeholder='Search for a book'
              />
            </Col>
            <Col xs={12} md={4}>
              <Button type='submit' variant='success' size='lg'>
                Submit Search
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
        <Modal.Header closeButton style={{backgroundColor: 'grey'}}>
          <Modal.Title id='results-modal' style={{backgroundColor: 'grey', color: 'whitesmoke'}}>
            <h2 style={{fontFamily: 'Palatino'}}>
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
                  <Card className='border-0' key={book.bookId} border='dark' style={{fontFamily: 'Monaco', backgroundColor: 'black', color: 'whitesmoke', background: 'repeating-linear-gradient(-55deg,#222,#222 10px,#333 10px,#333 20px)'}}>
                    {book.image ? (
                      <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' style={{height: '500px', width: '350px', margin: 'auto', display: 'block', backgroundColor: 'black'}}/>
                    ) : null}
                    <Card.Body style={{border:'3px solid black', backgroundColor: 'black'}}>
                      <Card.Title style={{marginTop: '15px', fontWeight:'bold'}}>{book.title}</Card.Title>
                      <p className='small'>Authors: {book.authors}</p>
                      <Card.Text style={{maxHeight: '15ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', display: 'inline-block'}}>{book.description}</Card.Text>
                      <Card.Text>{book.description.length > 400 && <p>...</p>}</Card.Text>
                      {!checkButton(book) && auth.loggedIn() ? ( <Button disabled variant='secondary' size='lg'>Book already recommended</Button> ) : auth.loggedIn() && checkButton(book) ? (
                        <Button variant='success' size='lg' onClick={() => handleSaveBook(book.bookId)}>Recommend this book</Button> ) : ( <Button disabled variant='secondary' size='lg'>Login to recommend</Button>
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
    // )}
    // </>
  )
}

export default Search;
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK } from '../utils/mutations';
import { Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import auth from '../utils/auth';

const Search = (props) => {
  const [addBook, { error }] = useMutation(ADD_BOOK);
  const [searchedBooks, setSearchedBooks] = useState([]); // keep track of returned google api data
  const [searchInput, setSearchInput] = useState('');

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
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || ''
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
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
      var newLink = bookToSave.link || "";
      var newImage = bookToSave.image || "";
    
    // get token
    const token = auth.loggedIn() ? auth.getToken() : null;

    if (!token) {
      return false;
    }
  
    try {
      await addBook({
        variables: { bookId: newBookId, authors: newAuthors, title: newTitle, description: newDescription, pageCount: newPageCount, averageRating: newAverageRating, publishedDate: newPublishedDate, link: newLink, image: newImage },
      });

      // setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (e) {
        console.error(e);
    }
  };

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
      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <CardColumns>
          {searchedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top'/>
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    disabled={props.savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                    className='btn-block btn-info'
                    onClick={() => handleSaveBook(book.bookId)}
                  >
                    {props.savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                      ? 'Already recommended!'
                      : 'Save this Book!'}
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
    // )}
    // </>
  )
}

export default Search;
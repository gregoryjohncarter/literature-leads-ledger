import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { QUERY_BOOKS } from '../utils/queries';
import Search from '../components/Search';

const Homepage = () => {
  const { data: savedBooks } = useQuery(QUERY_BOOKS);
  const books = savedBooks || { books: [] };
  const [savedBookIds, setSavedBookIds] = useState();

  const updateIds = useEffect(() => {
    setSavedBookIds(books.books.map((books) => {
      return books.bookId;
    }))
  }, [savedBooks])

  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  return (
    <>
      <Search savedBookIds={savedBookIds}></Search>
    </>
  )
}

export default Homepage;
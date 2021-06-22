import React, { useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

// import hooks, query and mutation to comm with apollo server
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

const SavedBooks = () => {
  // on load, get userData (this includes savedBooks array)
  const { loading, error, data, refetch } = useQuery(GET_ME);

  // force refetch of data each time component loads 
  useEffect(() => {
    refetch();
  },[refetch]);

  // if exists, assign returned data to userData
  const userData = data?.me;

  // get function to removeBook using apollo server
  const [removeBook] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      /** SEND REMOVE BOOK TO APOLLO SERVER **/
      await removeBook({variables: { bookId }});

      // upon success, remove book's id from localStorage
      removeBookId(bookId);

      // force refetch of user data so that page updates instantly
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

    // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // added error from useQuery below if present
  return !userData ? null : (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
          {
              error ? `There is an error with Apollo Client ${error}!` : null
          }
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
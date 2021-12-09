import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const CREATE_BOOK = gql`
  mutation createBook ($title: String!, $author: String!, $numPublished: Int!, $genres:[String!]!) { 
    addBook(
      title: $title,
      author: $author,
      published: $numPublished,
      genres: $genres
    ) {
      title
      published
      author
      id
      genres
    }
  }`

  const ALL_AUTHORS = gql`
    query Query {
      allAuthors {
        name
        born
        booksCount
        id
      }
    }  
  `

  const ALL_BOOKS = gql`
    query Query {
      allBooks {
        title
        published
        author
        id
        genres
      }
    }
  `

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [ {query: ALL_BOOKS}, {query: ALL_AUTHORS}]
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    let numPublished = Number(published)
    
    createBook({variables : {title, author, numPublished, genres}})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook

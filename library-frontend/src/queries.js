import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
    query Query {
      allBooks {
        title
        published
        author {
          name
          born
          booksCount
        }
        id
        genres
      }
    }
`

export const CREATE_BOOK = gql`
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

export const ALL_AUTHORS = gql`
query Query {
  allAuthors {
    name
    born
    booksCount
    id
  }
}  
`

export const EDIT_AUTHOR = gql`
mutation editYear($nameVal: String!, $numYear: Int!) {
  editAuthor(name: $nameVal, setBornTo: $numYear) {
    name
    born
    booksCount
  }
}
`

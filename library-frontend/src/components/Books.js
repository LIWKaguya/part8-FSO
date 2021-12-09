import React from 'react'
import { gql, useQuery } from '@apollo/client'

const Books = (props) => {
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
  const result = useQuery(ALL_BOOKS)
  if (!props.show) {
    return null
  }
  if(result.loading) {
    return (
      <>Wait a bit....</>
    )
  }
  const books = result.data.allBooks
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books
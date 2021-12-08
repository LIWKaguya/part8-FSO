  
import React from 'react'
import { gql, useQuery } from '@apollo/client'

const Authors = (props) => {
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
  const result = useQuery(ALL_AUTHORS)
  if(!props.show) return null 
  if(result.loading) return (
    <>Wait a bit...</>
  )
  const authors = result.data.allAuthors
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.booksCount}</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

export default Authors

import { useQuery } from '@apollo/client'
import React from 'react'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = (props) => {
    const result = useQuery(ALL_BOOKS)
    const user = useQuery(ME)
    if(!props.show) return null
    if(result.loading || user.loading) return (
        <>Wait a bit...</>
    )

    let books = result.data.allBooks 
    const favoriteGenre = user.data.me.favoriteGenre
    books = books.filter(book => book.genres.includes(favoriteGenre))
    
    return (
    <>
        <h2>books in your favorite genre <em>{favoriteGenre}</em></h2>
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
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
    )
}

export default Recommendations
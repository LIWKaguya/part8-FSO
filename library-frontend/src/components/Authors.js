  
import React, {useState} from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
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

  const EDIT_AUTHOR = gql`
  mutation editYear($name: String!, $numYear: Int!) {
    editAuthor(name: $name, setBornTo: $numYear) {
      name
      born
      booksCount
    }
  }
  `
  const [editYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}]
  })
  const result = useQuery(ALL_AUTHORS)
  if(!props.show) return null 
  if(result.loading) return (
    <>Wait a bit...</>
  )
 
  const submit = async (event) => {
    event.preventDefault()
    let numYear = Number(year)
    editYear({ variables: {name, numYear}})
    setName('')
    setYear('')
  }

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
      <form onSubmit={submit}>
      <h2>Set birth year</h2>
      name:<input value={name} onChange={({ target }) => setName(target.value)} /> <br />
      year:<input type='number' value={year} onChange={({ target }) => setYear(target.value)} /> <br />
      <button type='submit'>Update author</button>
      </form>
    </div>
  )
}

export default Authors

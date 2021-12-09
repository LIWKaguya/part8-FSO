const { ApolloServer, gql } = require('apollo-server')

const { v1: uuid } = require('uuid')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
  type Books {
    title: String!,
    published: Int!,
    author: String!,
    id: String!,
    genres: [String!]!
  }

  type Authors {
    name: String!,
    id: String!,
    born: Int,
    booksCount: Int
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks (author: String, genre: String): [Books!]!
    allAuthors: [Authors!]!
  }

  type Mutation {
    addBook(
      title:String!
      author:String!
      published:Int!
      genres: [String!]!
    ): Books
    editAuthor(
      name:String!,
      setBornTo:Int!
    ):Authors
  }
`

const resolvers = {
  Query: {
    authorCount: () => authors.length,
    bookCount: () => books.length,
    allBooks: (root, args) => {
      let filtered = books
      if(args.author) filtered = filtered.filter(book => book.author === args.author)
      if(args.genre) filtered = filtered.filter(book => book.genres.includes(args.genre))
      return filtered
    },
    allAuthors: () => authors
  },
  Authors: {
    booksCount: (root) => {
      const authors = books.map(book => book.author)
      return authors.filter(author => author === root.name).length
    }
  },
  Mutation: {
    addBook: (root, args) => {
      const book = {...args, id: uuid()}
      const author = {
        name: args.author,
        id: uuid()
      }
      books = books.concat(book)
      const check = authors.find(a => a.name === author.name)
      if(!check) authors = authors.concat(author)
      return book 
    },
    editAuthor: (root, args) => {
      const needUpdated = authors.find(author => author.name === args.name)
      if(!needUpdated) return null
      const newInfo = {...needUpdated, born: args.setBornTo}
      authors = authors.map(author => author.name === newInfo.name ? newInfo: author)
      return newInfo
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
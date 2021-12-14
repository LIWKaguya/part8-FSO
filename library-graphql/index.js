const { ApolloServer, gql } = require('apollo-server')
require('dotenv').config()
const mongoose = require('mongoose')
const Author = require('./models/Author')
const Book = require('./models/Book')

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const typeDefs = gql`
  type Books {
    title: String!,
    published: Int!,
    author: Authors!,
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
    authorCount: () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),
    allBooks: (root, args) => {
      return Book.find({}).populate('author', {name: 1, born: 1})
    },
    allAuthors: () => {
      return Author.find({}).clone()
    }
  },
  Authors: {
    booksCount: async (root) => {
      const books = await Book.find({}).clone()
      const authors = books.map(book => book.author)
      return authors.filter(author => author === root.name).length
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({name: args.author})
      if(!author) {
        const newAuthor = new Author({name: args.author})
        await newAuthor.save()
      }
      author = await Author.findOne({name: args.author})
      const book = new Book({
        title: args.title,
        author: author.id,
        published: args.published,
        genres: args.genres
      })
      return book.save()
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name})
      author.phone = args.phone
      return author.save()
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
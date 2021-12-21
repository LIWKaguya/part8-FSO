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
    allBooks: async (root, args) => {
      if(args.author) {
        const needAuthor = await Author.find({name: args.author})
        if(needAuthor) {
          if(args.genres) {
            return await Book.find({
              author: needAuthor,
              genres: {$in : [args.genres]}
            }).populate('author')
          }
          return await Book.find({
            author: needAuthor
          }).populate('author')
        }
      }
      if(args.genres) {
        return await Book.find({
          genres: {$in: [args.genres]}
        }).populate('author')
      }
      return await Book.find({}).populate('author')
    },
    allAuthors: async () => {
      return await Author.find({})
    }
  },
  Authors: {
    booksCount: async (root) => {
      const books = await Book.find({}).populate('author')
      const authors = books.map(book => book.author)
      return authors.filter(author => author.name === root.name).length
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({name: args.author})
      if(!author) {
        const newAuthor = new Author({
          name: args.author
        })
        await newAuthor.save()
        author = newAuthor
      }
      let book = new Book({
        title: args.title,
        published: args.published,
        author: author,
        genres: args.genres
      })
      return await book.save()
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name})
      author.phone = args.phone
      return await author.save()
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
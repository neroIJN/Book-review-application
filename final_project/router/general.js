const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }
    
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json({books:books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book){
    return res.json(book);
  }else{
    return res.status(404).json({message:"Book not found"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
  if (booksByAuthor.length > 0) {
      return res.json(booksByAuthor);
  } else {
      return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  
  if (booksByTitle.length > 0) {
      return res.json(booksByTitle);
  } else {
      return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book && book.reviews) {
      return res.json(book.reviews);
  } else {
      return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;



// Function to get the list of books
async function getBooks() {
  try {
    const response = await axios.get('https://api.example.com/books');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}



// Function to get book details by ISBN
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`https://api.example.com/books/${isbn}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
  }
}




// Function to get books by author
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`https://api.example.com/books?author=${author}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching books by author:', error);
  }
}

// Function to get books by title
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`https://api.example.com/books?title=${title}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching books by title:', error);
  }
}
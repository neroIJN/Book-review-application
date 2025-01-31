const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js"); // Assuming booksdb.js is a file containing your book data
const regd_users = express.Router();

let users = [];

// Check if the username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
}

// Authenticate the user with the given username and password
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// User login route to generate a JWT token
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });
  return res.status(200).json({ message: "Login Successful", token });
});

// Add a book review
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review, token } = req.body; // Expecting the token in the body
  
  console.log("Received Token: ", token); // Log the token to see what was received
  
  if (!token) {
    return res.status(400).json({ message: "Unauthorized access. Token is required" });
  }

  try {
    // Decode the token using the secret key
    const decoded = jwt.verify(token, "secretKey");
    console.log("Decoded Token: ", decoded); // Log the decoded token for debugging
    const username = decoded.username; // Extract the username from the token

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    // Save the review under the username
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully" });
  } catch (error) {
    console.log("Error: ", error); // Log error for better debugging
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});


// Export the routes to use them in other parts of the application
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

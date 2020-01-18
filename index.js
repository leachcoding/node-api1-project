// implement your API here
const express = require('express');

const Users = require('./data/db.js');

const server = express();

server.use(express.json());

// Creates a user using the information sent inside the request body.
server.post('/api/users', (req, res) => {
  // If the request body is missing the name or bio property:
    // respond with HTTP status code 400 (Bad Request).
    // return the following JSON response: { errorMessage: "Please provide name and bio for the user." }.
  const {name,bio} = req.body;

  if (!name || !bio) {
    res.status(400).json({errorMessage: "Please provide name and bio for the user."});
  } else {
    // If the information about the user is valid:
      // save the new user the the database.
      // respond with HTTP status code 201 (Created).
      // return the newly created user document.
    Users.insert(req.body)
      .then(user => {
        res.status(201).json(user);
      })
    // If there's an error while saving the user:
      // respond with HTTP status code 500 (Server Error).
      // return the following JSON object: { errorMessage: "There was an error while saving the user to the database" }.
      .catch(() => {
        res.status(500).json({errorMessage: "There was an error while saving the user to the database"});
      });
  }

});

// Returns an array of all the user objects contained in the database.
server.get('/api/users', (req,res) => {
  // When the client makes a GET request to /api/users:
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      // If there's an error in retrieving the users from the database:
        // respond with HTTP status code 500.
        // return the following JSON object: { errorMessage: "The users information could not be retrieved." }.
      res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    });

});

// Returns the user object with the specified id.
server.get('/api/users/:id', (req,res) => {
  // When the client makes a GET request to /api/users/:id:
  Users.findById(req.params.id)
    .then(users => {
      if (users) {
        res.status(200).json(users);
      } // If the user with the specified id is not found:

        // respond with HTTP status code 404 (Not Found).
        // return the following JSON object: { message: "The user with the specified ID does not exist." }.
      else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(() => {
      // If there's an error in retrieving the user from the database:

        // respond with HTTP status code 500.
        // return the following JSON object: { errorMessage: "The user information could not be retrieved." }.
      res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    });
});

// Removes the user with the specified id and returns the deleted user.
server.delete('/api/users/:id', (req,res) => {
  // When the client makes a DELETE request to /api/users/:id:
  Users.remove(req.params.id)
  // If the user with the specified id is not found:
  // respond with HTTP status code 404 (Not Found).
  // return the following JSON object: { message: "The user with the specified ID does not exist." }.
  .then(count => {
    if (count && count > 0) {
      res.status(200).json({ message: "The user was deleted" });
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
  })
  // If there's an error in removing the user from the database:

    // respond with HTTP status code 500.
    // return the following JSON object: { errorMessage: "The user could not be removed" }.
  .catch(() => {
    res.status(500).json({ errorMessage: "The user could not be removed" });
  });
});

// Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.
server.put('/api/users/:id', (req,res) => {
  const {name, bio} = req.body

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    Users.update(req.params.id, req.body)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res
            .status(404)
            .json({
              message: 'The user with the specified ID does not exist.',
            });
        }
      })
      .catch(() => {
        res.status(500).json({
          errorMessage: 'The user information could not be modified.',
        });
      });
  }
  // If the user with the specified id is not found:

    // respond with HTTP status code 404 (Not Found).
    // return the following JSON object: { message: "The user with the specified ID does not exist." }.
  // If the request body is missing the name or bio property:

    // respond with HTTP status code 400 (Bad Request).
    // return the following JSON response: { errorMessage: "Please provide name and bio for the user." }.
  // If there's an error when updating the user:

    // respond with HTTP status code 500.
    // return the following JSON object: { errorMessage: "The user information could not be modified." }.
  // If the user is found and the new information is valid:

    // update the user document in the database using the new information sent in the request body.
    // respond with HTTP status code 200 (OK).
    // return the newly updated user document.
});

// Start the server to listen to the API on the specific port chosen

const port = 5000;

server.listen(port, () => console.log(`\n *** API ON PORT ${port} \n`));

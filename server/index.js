const express = require("express"); // Importing the Express framework
const mongoose = require("mongoose"); // Importing the Mongoose library
const cookieParser = require("cookie-parser"); // Importing the cookie-parser middleware
const dotenv = require("dotenv"); // Importing the dotenv library for environment variables
const jwt = require("jsonwebtoken"); // Importing the jsonwebtoken library for JSON web token handling
const cors = require("cors"); // Importing the cors library to handle cross-origin requests
// By adding the cors middleware to your Node.js application, you can control cross-origin requests and allow appropriate access to your resources.
// LIKE: methods: ['GET', 'POST'], // Allow only specific HTTP methods
// allowedHeaders: ['Content-Type', 'Authorization'] // Allow only specific headers

const bcrypt = require("bcryptjs"); // Importing the bcryptjs library for password hashing
const User = require("./models/User"); // Importing the User model
const Message = require("./models/Message"); // Importing the Message model
const ws = require("ws"); // Importing the WebSocket library
const fs = require("fs"); // Importing the fs module for file system operations

dotenv.config(); // Loading environment variables from the .env file

// Connecting to the MongoDB database
mongoose
  .connect(process.env.MONGO_URL)
  .then((con) => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    throw err;
  });

const jwtSecret = process.env.JWT_SECRET; // Secret key for signing JWT
const bcryptSalt = bcrypt.genSaltSync(10); // Salt for password hashing

const app = express(); // Creating an Express application
app.use("/uploads", express.static(__dirname + "/uploads")); // Serving static files from the "/uploads" directory
app.use(express.json()); // Parsing JSON requests
app.use(cookieParser()); // Parsing cookies
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
); // Configuring CORS options for cross-origin requests

// Function to extract user data from the request using JWT
async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      // although empty object here contains token expire time but we did not want token to expire
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        // Verifying the JWT token and extracting user data
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

// Route for testing the server
app.get("/test", (req, res) => {
  res.json("test ok");
});

// Route for fetching messages between two users
app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  // console.log("Hello");
  // console.log(userData);
  const ourUserId = userData.userId;
  // Fetching messages from the database based on sender and recipient IDs
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });
  // console.log(messages);
  res.json(messages);
});

// Route for fetching all users
app.get("/people", async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  // { _id: 1, username: 1 }->we only want id and username
  res.json(users);
});

// Route for fetching user profile
app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    //can use asyn await also
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      // Verifying the JWT token and returning user data
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

// Route for user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          // Creating a JWT token and setting it as a cookie in the response
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            id: foundUser._id,
          });
        }
      );
    }
  }
});

// Route for user logout
app.post("/logout", (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
}); //resetting our cookie

// Route for user registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    // Loging new user using jwt
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        // Creating a JWT token for the newly registered user and setting it as a cookie in the response
        if (err) throw err;
        //   !Cookie is a small piece of text that server sends to client and when clients recieves the cookie it will automatically store it and send it with all featured request to the same server
        //         res //sameSite: "none" ->otherwise our cookie will not be send to other local host
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: createdUser._id,
          });
      }
    );
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const wss = new ws.WebSocketServer({ server });

// WebSocket connection handling
wss.on("connection", (connection, req) => {
  // console.log(req.headers.cookie.split(';').find((str) => str.startsWith("token=")).split('=')[1])
  // !evrything is printed or calculated 2 times becuase in react in developement mode it will render every component 2 times
  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach((client) => {
      // wss.clients->object of clients to tranfrom it into array we used ...wss.clients
      // Sending a message to all connected clients with the list of online users
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  }

  // for offline/online connection purpose
  connection.isAlive = true;

  // Set up a timer to send periodic pings to the connection
  connection.timer = setInterval(() => {
    connection.ping();

    // Set a timeout to terminate the connection if it becomes unresponsive
    connection.deathTimer = setTimeout(() => {
      // Mark the connection as unresponsive
      connection.isAlive = false;

      // Clear the interval timer for pinging
      clearInterval(connection.timer);

      // Terminate the connection
      connection.terminate();

      // Notify about online people
      notifyAboutOnlinePeople();

      // Log that the connection is dead
      console.log("dead");
    }, 1000);
  }, 5000);

  // Listen for a "pong" event indicating a successful response to the ping
  connection.on("pong", () => {
    // Clear the death timer, as the connection is responsive
    clearTimeout(connection.deathTimer);
  });

  // Read the username and ID from the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    // Find the token cookie string
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));

    if (tokenCookieString) {
      // Extract the token from the cookie string
      const token = tokenCookieString.split("=")[1];

      if (token) {
        // Verify the JWT token and extract user data
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;

          // Extract the userId and username from the user data
          const { userId, username } = userData;

          // Store the userId and username in the connection object
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString()); //converting the buffer message into actual message
    // console.log(message);
    const { recipient, text, file } = messageData;
    let filename = null;
    // console.log(file);
    if (file) {
      const parts = file.name.split(".");
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const path = __dirname + "/uploads/" + filename;
      // const bufferData = new Buffer(file.data.split(",")[1], "base64");
      // const bufferData = Buffer.from(file.data.split(",")[1], "base64");
      // const bufferData = new Buffer(file.data.split(",")[1], "base64");
      // fs.writeFile(path, bufferData, () => {
      //   console.log("file saved:" + path);
      // });
      const bufferData = Buffer.from(file.data.split(",")[1], "base64");
      fs.writeFile(path, bufferData, (error) => {
        if (error) {
          console.error("Error saving file:", error);
        } else {
          console.log("File saved:", path);
        }
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });
      // Creating a new message in the database and sending it to the recipient(s)
      [...wss.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              file: file ? filename : null,
              _id: messageDoc._id,
            })
          )
        );
    }
  });

  // Notifying everyone about online people (when someone connects)
  // notify everyone about online people (when someone connects)
  notifyAboutOnlinePeople();
});

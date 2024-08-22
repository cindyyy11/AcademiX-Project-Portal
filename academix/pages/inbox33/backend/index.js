const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

// In-memory user store for simplicity
const users = [];

app.post("/authenticate", async (req, res) => {
  const { username, secret } = req.body;
  console.log("req.body", req.body);
  console.log(username, secret);
  const user = users.find((user) => user.username === username);
  console.log("look here", user);

  if (user) {
    // User exists, check if the secret matches
    if (user.secret === secret) {
      try {
        const r = await axios.put(
          "https://api.chatengine.io/users/",
          { username: username, secret: secret, first_name: username },
          { headers: { "private-key": "914ca30f-b953-464d-a8a8-037447b03d48" } }
        );
        return res.status(r.status).json(r.data);
      } catch (e) {
        console.error("Error:", e.message);
        if (e.response) {
          console.error("Error Response:", e.response);
          return res.status(e.response.status).json(e.response.data);
        } else {
          return res.status(500).json({ message: "An error occurred" });
        }
      }
    } else {
      // Secret does not match
      return res.status(400).json({ message: "Invalid Password" });
    }
  } else {
    // New user, create and store in memory
    users.push({ username, secret });
    try {
      const r = await axios.put(
        "https://api.chatengine.io/users/",
        { username: username, secret: secret, first_name: username },
        { headers: { "private-key": "914ca30f-b953-464d-a8a8-037447b03d48" } }
      );
      return res.status(r.status).json(r.data);
    } catch (e) {
      console.error("Error:", e.message);
      if (e.response) {
        console.error("Error Response:", e.response);
        return res.status(e.response.status).json(e.response.data);
      } else {
        return res.status(500).json({ message: "An error occurred" });
      }
    }
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

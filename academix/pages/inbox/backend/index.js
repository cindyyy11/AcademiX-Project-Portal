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

    const user = users.find(user => user.username === username);

    if (user) {
        // User exists, check if the secret matches
        if (user.secret === secret) {
            try {
                const r = await axios.put(
                    'https://api.chatengine.io/users/',
                    { username: username, secret: secret, first_name: username },
                    { headers: { "private-key": "914ca30f-b953-464d-a8a8-037447b03d48" } }
                );
                return res.status(r.status).json(r.data);
            } catch (e) {
                return res.status(e.response.status).json(e.response.data);
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
                'https://api.chatengine.io/users/',
                { username: username, secret: secret, first_name: username },
                { headers: { "private-key": "914ca30f-b953-464d-a8a8-037447b03d48" } }
            );
            return res.status(r.status).json(r.data);
        } catch (e) {
            return res.status(e.response.status).json(e.response.data);
        }
    }
});

app.listen(3001);

//, () => {
//});


/*
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.post("/authenticate", async (req, res) => {
    const { username, secret} = req.body;

    try {
        const r = await axios.put(
            'https://api.chatengine.io/users/',
            {username, secret, first_name: username},
            {headers: {"private-key": "a2d004d4-ad82-4752-b772-82e3d8a0b536"}}
        )
        return res.status(r.status).json(r.data)
    } catch (e) {
        return res.status(e.response.status).json(e.response.data)
    }
});

app.listen(3001);
*/


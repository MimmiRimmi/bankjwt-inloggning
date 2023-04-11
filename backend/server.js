import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";

const secret = "sommar";

function generateAccessToken(userId) {
  return jwt.sign(userId, secret);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secret, (err, userId) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.userId = userId;

    next();
  });
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 7005;
let users = [];
const accounts = [];
let userIds = 1;

app.post("/users", (req, res) => {
  const user = req.body;
  console.log(user, req.body);
  user.id = userIds++;
  users.push(user);

  const account = {
    money: "100",
    userId: user.id,
  };
  console.log("NEW USER", user);
  accounts.push(account);

  res.statusCode = 200;
  res.send("check");
});

// skapa token från user, skicka token till användaren för att de sedan skickas tillbacka i nästa request.

app.post("/sessions", (req, res) => {
  const user = req.body;

  const dbUser = users.find((u) => u.userName === user.userName);

  if (dbUser != null && dbUser.password === user.password) {
    const token = generateAccessToken(dbUser.id);

    console.log("SUCCESS!!");

    res.json({ token });
  } else {
    console.log("INCORRECT PW OR UNAME", user, dbUser, users);
    res.status = 401;
    res.json();
  }
});

app.get("/me/accounts", authenticateToken, (req, res) => {
  console.log("USERID: ", req.userId, "TOKEN: ");

  // Hämta avccount:
  console.log(accounts);
  const dbAccount = accounts.find((a) => a.userId == req.userId);
  console.log(dbAccount);
  res.json(dbAccount);
  res.json({ userId: req.userId });
});

app.listen(PORT, () => {
  console.log("server starts listening on port " + PORT);
});

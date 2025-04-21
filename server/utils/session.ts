const session = require("express-session");
const connectMongo = require("connect-mongo");
const mongoose = require("mongoose");

const MongoStore = connectMongo(session);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "change_this",
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
});

module.exports = { sessionMiddleware };

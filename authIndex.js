const express = require('express')
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const cors = require("cors")


const asyncWrapper = require("./utility/asycnWrapper")
const {auth, authAdmin} = require('./utility/auth')
const pokeUserModel = require("./schema/pokeUser")
const {PokemonClientBadRequest, PokemonDbError, PokemonNotFoundError, PokemonBadQuery, PokemonUserBadRequest} = require("./error")

// Global variables
const app = express()
dotenv.config();
const port = process.env.AUTH_PORT
const unwantedValue = [undefined, null, ""]
const cookieConfig = {
  httpOnly: false
}

// MiddleWares
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.listen(port, async (err) => {
    if (err) {
        console.log('err', err)
    }
    await mongoose.connect(process.env.DB_STRING)
    console.log("Auth App listenting on port " + port)
})

app.get('/', (req, res) => {
  console.log('req.cookies', req.cookies)
    res.end('Success here')
})

// Register a user
app.post('/register', asyncWrapper(async (req, res, next) => {
    const {username, password, email, userType} = req.body

  if (unwantedValue.includes(username)) {
    return next(new PokemonUserBadRequest("username is missing"))
  } else if (unwantedValue.includes(password)) {
    return next(new PokemonUserBadRequest("password is missing"))
  } else if (unwantedValue.includes(email)) {
    return next(new PokemonUserBadRequest("email is missing"))
  }

  let existingUser= await pokeUserModel.find({$or: [{username: username} , {email: email}]})
  if (existingUser.length > 0) {
    existingUser = existingUser[0]
    if (existingUser.username == username) {
      return next(new PokemonUserBadRequest(`User with username: ${username} already exists`))
    } else {
      return next(new PokemonUserBadRequest(`User with email: ${email} already exists`))
    }
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const newUser = await pokeUserModel.create({username, password: hashedPassword, email, userType: userType ?? "User"});
  return res.status(200).json({status: "Success", data: newUser})
}))


// Login a user
app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body
  if (unwantedValue.includes(username)) {
    return next(new PokemonUserBadRequest("username is missing"))
  } else if (unwantedValue.includes(password)) {
    return next(new PokemonUserBadRequest("password is missing"))
  }

  const user = await pokeUserModel.findOne({ username })
  if (!user) {
    throw new PokemonClientBadRequest("User not found")
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new PokemonClientBadRequest("Password is incorrect")
  }

  let token;
  if (user.token) {
    token = user.token
  } else {
    // Create and assign a token
    token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)

    //  Store token into the DB
    await pokeUserModel.updateOne({_id: user._id}, {token})
  }

  res.cookie('authToken', token, cookieConfig)
  res.status(200).json({status: "Success", token})
}))


// Logout a user
app.post('/logout', asyncWrapper(async (req, res) => {
  const {authToken} = req.cookies;
  console.log('authToken', authToken)

  const userAvailable = await pokeUserModel.findOne({token: authToken})
  if (!userAvailable) {
    throw new PokemonClientBadRequest("There is no such user found!")
  }

  await pokeUserModel.updateOne({token: authToken}, {$unset: {token: 1 }})
  return res.status(200).json({status: "Success", message: "User has been logged out"})
}))


// Custom error handler
app.use((err, req, res, next) => {
    const error = {
      name: err.name,
      message: err.message
    }
    const isClientError = err instanceof PokemonClientBadRequest
    const errorStatus = isClientError ? "ClientError" : "ServerError"
    res.status(isClientError ? 400 : 500).send({status: errorStatus, error: error.message})
})
  
  // Missing route handler
app.use((req, res) => {
    res.status(404).send({
    status: 404,
    error: "Not Found"
    })
})
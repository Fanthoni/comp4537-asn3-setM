const express = require('express')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const getThreeCharDigit = require("./utility/utility");
const pokeUserModel = require("./schema/pokeUser")
const getPokemonModel = require("./schema/pokemon")
const getPokemons = require("./services/getPokemons");
const {auth, authAdmin} = require('./utility/auth')
const asyncWrapper = require("./utility/asycnWrapper")
const recordAPI = require("./utility/apiRecorder")
const {PokemonClientBadRequest, PokemonDbError, PokemonNotFoundError, PokemonBadQuery, PokemonUserBadRequest} = require("./error")

const app = express()
dotenv.config();
const port = process.env.APP_PORT
const unwantedValue = [undefined, null, ""]

// MiddleWares
app.use(express.json())
app.use(cookieParser())
app.use(cors())

let pokemonModel;
app.listen(process.env.APP_PORT || port, async (err) => {
  if (err) {
    console.log(err)
  }
    try {
      await mongoose.connect(process.env.DB_STRING)

      pokemonModel = await getPokemonModel();
      const pokemons = await getPokemons();
      
      await pokemonModel.deleteMany({});
      await pokemonModel.insertMany(pokemons);
    } catch (error) {
      console.log('DB startup connection error encountered!', error);
    }
    console.log(`Pokemon APP listening on port ${port}`)
  }
)

app.use(auth)

app.get("/api/v1/pokemons/", asyncWrapper(async (req, res, next) => {
  let {count, after} = req.query;
    count = parseInt(count)
    after = parseInt(after)
    if (!count || unwantedValue.includes(after) || isNaN(after) || isNaN(count) || count <= 0 || after < 0) {
      return next(new PokemonBadQuery("Count or After query params might be missing or has an invalid value!"))
    }

    pokemonModel.find({}).skip(after).limit(count)
    .then((respond) => {
      if (respond.length === 0) {
        return next(new PokemonNotFoundError("Invalid query! There are 0 pokemons found!"))
      }
      res.status(200).json({data: respond, status: "Success"})
      next(200)
    })
}), recordAPI)

// Get a pokemon data by id
app.get("/api/v1/pokemon/:id", asyncWrapper(async (req, res, next) => {
  const {id} = req.params
  if (!id) {
    return next(new PokemonBadQuery("Id is missing from the request body"))
  }

  await pokemonModel.find({id: id})
    .then((pokemon) => {
      if (pokemon.length !== 1) {
        return next(new PokemonNotFoundError(`Pokemon with id ${id} already exists`))
      }
      res.status(200).json({status: "Success", data: pokemon})
      next(200)
    })
    .catch((err) => {
      return next(new PokemonDbError("Error encountered when creating a pokemon"))
    })
}), recordAPI)

app.use(authAdmin)

app.post("/api/v1/pokemon", asyncWrapper(async (req, res, next) => {
  const pokemonValues = req.body;
  if (!pokemonValues || Object.keys(pokemonValues).length === 0) {
    return next(new PokemonBadQuery("Request body is missing!"))
  }

  const {id} = req.body;
  if (!id) {
    return next(new PokemonBadQuery("Id is missing from the request body"))
  }

  const pokemon = await pokemonModel.find({id: id})
  if (pokemon.length > 0) {
    return next(new PokemonNotFoundError(`Pokemon with id ${id} already exists`))
  }

  await pokemonModel.create(pokemonValues)
    .then((doc) => {
      res.status(200).json({status: "Success!", data: doc})
      next(200)
    })
    .catch((err) => {
      return next(new PokemonDbError("Error encountered when creating a pokemon"))
    })
}), recordAPI)

// Get pokemon image
app.get("/api/v1/pokemonImage/:id", asyncWrapper(async (req, res, next) => {
  const {id} = req.params
  if (!id) {
    return next(new PokemonBadQuery("pokemonId is missing in the request params!"))
  }
    const pokemon = await pokemonModel.find({id: id})

    if (pokemon.length === 0)  {
      return next(new PokemonNotFoundError(`Id ${id} is not a validPokemon`))
    }

    const baseImageLinkURL = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/"
    res.status(200).json({status: "Success", imageLink: `${baseImageLinkURL}` +`${getThreeCharDigit(id)}` + `.png`})
    next(200)
}), recordAPI)

// Delete a pokemon
app.delete("/api/v1/pokemon/:id", asyncWrapper(async (req, res, next) => {
  const {id} = req.params
  if (!id) {
    return next(new PokemonBadQuery("pokemonId is missing in the request params!"))
  }

  const pokemon = await pokemonModel.find({id: id})
  if (pokemon.length == 0) {
    return next(new PokemonNotFoundError(`Pokemon with id ${id} does not exist`))
  }

  await pokemonModel.deleteOne({id: id})
    .then(respond => {
      res.status(200).json({status: "Success", msg: `Pokemon with id ${id} has been successfully deleted`})
      next(200)
    })
    .catch(err => {
      console.error(`Error found when deleting a pokemon with id ${id}: ${err}`)
      return res.status(500).json({status: "Error", errMsg: "Issue found when deleting pokemon with id " + id})
    })
}), recordAPI)

// Upsert a partial pokemon document
app.patch("/api/v1/pokemon/:id", asyncWrapper(async (req, res, next) => {
  const {id} = req.params
  const newPokemonValues = req.body

  const pokemon = await pokemonModel.find({id: id})
  if (pokemon.length == 0) {
    return next(new PokemonNotFoundError(`No pokemon found for ${id}`))
  }

  await pokemonModel.updateOne({id: id}, newPokemonValues)
    .then(doc => {
      res.status(200).json({status: "Success", data: {newPokemonValues}})
      next(200)
    })
    .catch(err => {
      return next(new PokemonDbError(`Error encountered while updatingPokemon with id ${id}`))
    })
}), recordAPI)

// Update the entire pokemon document
app.put("/api/v1/pokemon/:id", asyncWrapper(async (req, res, next) => {
  const {id} = req.params
  const newPokemonValues = req.body

  const pokemon = await pokemonModel.find({id: id})
  if (pokemon.length == 0) {
    await pokemonModel.create(newPokemonValues)
    .then((doc) => {
      res.status(200).json({status: "Success!", data: doc})
      next(200)
    })
    .catch((err) => {
      console.log('err', err)
      return next(new PokemonDbError("Error encountered when creating a pokemon"))
    })
  } else {
    await pokemonModel.findOneAndUpdate({id: id}, newPokemonValues, {upsert: true})
      .then(doc => {
        res.status(200).json({status: "Success", data: newPokemonValues})
        next(200)
      })
      .catch(err => {
        return next(new PokemonBadQuery("One or more properties may be invalid"))
      })
  }
}), recordAPI)



// Custom error handler
app.use((err, req, res, next) => {
  const error = {
    name: err.name,
    message: err.message
  }
  const isClientError = err instanceof PokemonClientBadRequest
  const errorStatus = isClientError ? "ClientError" : "ServerError"

  res.status(isClientError ? 400 : 500).send({status: errorStatus, error: error.message})
  next(isClientError ? 400 : 500)
}, recordAPI)

// Missing route handler
app.use((req, res) => {
  res.status(404).send({
  status: 404,
  error: "Not Found"
  })
 })
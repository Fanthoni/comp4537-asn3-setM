const pokeUserModel = require("../schema/pokeUser")
const jwt = require("jsonwebtoken")
const {PokemonClientBadRequest} = require("../error")
const asyncWrapper = require("../utility/asycnWrapper")


/**
 * Regular user authentication
 */
const auth = asyncWrapper( async (req, res, next) => {
  const {authToken} = req.query
  if (!authToken) {
      throw new PokemonClientBadRequest("Access denied! User token is not provided")
  }

  try {
    const existingUser = await pokeUserModel.findOne({token: authToken})
    if (!existingUser) {
      throw new PokemonClientBadRequest("Access denied! There is no such user")
    }
    next()
  } catch (err) {
    console.log('err.message', err.message)
    throw new PokemonClientBadRequest(err.message)
  }

  const user = await pokeUserModel.findOne({token: authToken});
  if (!user) {
      throw new PokemonClientBadRequest("Access denied")
  }
})

/**
 * Admin user authentication
 */
const authAdmin = asyncWrapper(async (req, res, next) => {
  const {authToken} = req.query
  if (!authToken) {
      throw new PokemonClientBadRequest("Access denied")
  }

  try {
    const existingUser = await pokeUserModel.findOne({token: authToken})
    if (!existingUser) {
      throw new PokemonClientBadRequest("Access denied! There is no such user")
    } // nothing happens if token is valid
    const user = await pokeUserModel.findOne({token: authToken, userType: "Admin"});
    if (!user) {
      throw new PokemonClientBadRequest("Access denied. User is not admin!")
    }
    next()
  } catch (err) {
    throw new PokemonClientBadRequest(err.message)
  }
});

const getUserIdByToken = async (token) => {
  const existingUser = await pokeUserModel.findOne({token: token})
  if (!existingUser) {
    return false
  } else {
    return existingUser.id
  }
}

module.exports = {auth, authAdmin, getUserIdByToken};
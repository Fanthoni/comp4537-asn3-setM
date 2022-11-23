const mongoose = require('mongoose')
const axios = require('axios');

const getPokemonTypes = async () => {
    let pokemonTypes;
    await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json")
      .then((res) => {
        pokemonTypes = res.data.map(type => {
          return type.english;
        });
      })
      .catch((err) => {
        console.log('Error found when getting pokemon types!', err)
      })
    return pokemonTypes;
}


const getPokemonModel = async () => {
    const pokemonTypes = await getPokemonTypes();

    const pokemonSchema = new mongoose.Schema({
        "id": {type: String, unique: true},
        "name": {
          "english": {type: String, maxlength: 20},
          "japanese": {type: String},
          "chinese": {type: String},
          "french": {type: String},
        },
        "type": {
          type: [String], enum: pokemonTypes
        },
        "base": {
          "HP": {type: Number, required: true},
          "Attack": {type: Number, required: true},
          "Defense": {type: Number, required: true},
          "Speed": {type: Number, required: true},
          "Speed Attack": {type: Number, required: true},
          "Speed Defense": {type: Number, required: true},
        },
      }, {versionKey: false});

    return mongoose.model('pokemon', pokemonSchema);
}

module.exports = getPokemonModel;
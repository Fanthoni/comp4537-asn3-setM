const axios = require('axios');

/***
 * Retrive pokemons object from the GH API
 */
const getPokemons = async () => {
    let pokemons;
    await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")
    .then((res) => {
      pokemons = res.data
      pokemons.forEach(poke => {
        poke.base["Speed Attack"] = poke.base["Sp. Attack"]
        poke.base["Speed Defense"] = poke.base["Sp. Defense"]
        delete poke.base["Sp. Attack"];
        delete poke.base["Sp. Defense"];
      });
    })
    .catch((err) => {
      console.log('Error found when fetching pokemons from source!', err)
    });
    return pokemons

}

module.exports = getPokemons;
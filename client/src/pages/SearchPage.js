import {useEffect, useState} from "react"
import PokeCard from "../components/PokeCard";
import PokemonDetail from "../components/PokemonDetail";
import getAllPokemons from "../api/pokemonAPI";
import {getCookie, removeCookie} from "../utils/cookie"

function App() {

  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [pokemonsShown, setPokemonsShown] = useState([])
  const [page, setPage] = useState(1)
  const [fullPokemon, setFullPokemon] = useState([])

  const [pokemonToModal, setPokeToModal] = useState({})
  const types = ['Grass', 'Poison', 'Fire', 'Flying', 'Water', 'Bug', 'Normal', 'Electric', 'Ground', 'Fairy', 'Fighting', 'Psychic', 'Rock', 'Steel', 'Ice', 'Ghost', 'Dragon', 'Dark']

  const updateType = (t) => {
    let typeCopy = []

    if (type.trim() !== "") {
      typeCopy = type.split(",")
    }

    if (typeCopy.includes(t)) {
      typeCopy.splice(typeCopy.indexOf(t), 1)
    } else {
      typeCopy.push(t)
    }
    setType(typeCopy.join(","))
  }

  useEffect(() => {
    async function startUpPokemon() {
      const authToken = getCookie("token")
      try {
        const pokemonRes = await getAllPokemons(809, 0, authToken)
        setPokemonsShown(pokemonRes.data.data)
        setFullPokemon(pokemonRes.data.data)
      } catch (err) {
        console.error(err)
      }
    }

    startUpPokemon()
    
  }, [])

  useEffect(() => {
    let pokemonsToShow = fullPokemon
    if (name !== "") {
      pokemonsToShow = pokemonsToShow.filter(poke => poke.name.english.toLowerCase().includes(name))
    }


    if (type.trim() !== "") {
      pokemonsToShow = pokemonsToShow.filter(poke => type.split(",").every(t => poke.type.includes(t)))
    }
    setPokemonsShown(pokemonsToShow)
  }, [name, type])

  useEffect(() => {
    setPage(pokemonsShown.length > 0 ? 1 : 0)
  }, [pokemonsShown])

  const getButtons = () => {
    let index = []
    for (let i = 0; i < pokemonsShown.length / 10; i++) {
      index.push(i)
    }
    // console.log('index', index)
    const buttons = index.map((i) => {
      return <button key={i + 1} onClick={() => {
        setPage(i + 1)
      }}>{i + 1}</button>
    })
    return buttons;
  }

  const handleLogout = () => {
    removeCookie("token")
    removeCookie("userType")
    window.location.reload()
}

  return (
    <>
      { Object.keys(pokemonToModal).length === 0 ? 
      <div>
      <button onClick={handleLogout}>Logout</button>
      <h1>Pokedex Search Page</h1>
      <label>
        Pokemon Name:
        <input type="text" name="name" onChange={(e) => {setName(e.target.value.trim().toLowerCase())}}/>
      </label>
      <br />
      <br />
      <label>Type:</label>
      {types.map(type => {
        return (
          <div key={type} style={{display: "block"}}>
            <input type="checkbox" 
              id={type}
              value={type}
              onChange={(e) => {updateType(e.target.value)}}/>
            <label>{type}</label>
          </div>
        )
      })}

      <h2>Page number {page} / {Math.ceil(pokemonsShown.length / 10)}</h2>
      <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "50px"}}>
        {pokemonsShown.slice(10 * page - 10, 10 * page).map((pokeData) => {
          return <PokeCard key={pokeData.id}  name={pokeData.name.english} pokeId={pokeData.id}
            onClickCallbackFn={() => {setPokeToModal(pokeData)}} />
        })}
      </div>
      
      <br />
      <br />
      {![0, 1].includes(page) && <button onClick={() => {setPage(page - 1)}}>prev</button>}
      {getButtons()}
      {page !== Math.ceil(pokemonsShown.length / 10) && <button onClick={() => {setPage(page + 1)}}>next</button>} </div>
    : null}

      {Object.keys(pokemonToModal).length > 0 && <PokemonDetail pokeData={pokemonToModal} resetPokeToModal={setPokeToModal}/> }
    </>
  );
}

export default App;

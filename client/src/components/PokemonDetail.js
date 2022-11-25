import React from 'react';

function PokemonDetail ({pokeData, resetPokeToModal}) {

    return (
        <>
            <h1>Name: {pokeData.name.english}</h1>
            <h1>ID: {pokeData.id}</h1>
            <h1>HP: {pokeData.base.HP}</h1>
            <h1>Attack: {pokeData.base.Attack}</h1>
            <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${pokeData.id.toString().padStart(3, "0")}.png`} alt="Pokemon" style={{width: "200px", display: "inine-block"}}/>
            <button onClick={() => {resetPokeToModal({})}}>Back</button>
        </>
    )
}

export default PokemonDetail;
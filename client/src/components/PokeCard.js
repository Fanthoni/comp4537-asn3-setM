import React from "react";
import "../styles/PokeCard.css"

function PokeCard ({pokeId, name, onClickCallbackFn}) {

    return (
        <div className="pokeCard" style={{display: "flex", flexDirection: "column", width: "min-content", "&:hover": { background: "#efefef"}}} 
                onClick={onClickCallbackFn}> 
            <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${pokeId.toString().padStart(3, "0")}.png`} alt="Pokemon" style={{width: "200px", display: "inine-block"}}/>
            <h3  style={{display: "block", textAlign: "center"}}>{pokeId}. {name}</h3>
        </div>
    );
}

export default PokeCard;
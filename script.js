const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let currentPokemonIndex = 1;
let amountOfLoadedPokemon = 20;

function loadPokemon(){
    let start = currentPokemonIndex;
    let end = currentPokemonIndex + amountOfLoadedPokemon;

    fetchAndDisplayPokemon(start, end);

    currentPokemonIndex = currentPokemonIndex + amountOfLoadedPokemon;
}


async function fetchAndDisplayPokemon(start, end){
    let contentContainer = document.getElementById('content_container');

    for (let pokemonIndex = start; pokemonIndex < end; pokemonIndex++) {

        let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
        let pokemonResponseAsJson = await pokemonResponse.json();

        contentContainer.innerHTML += createMinicardTemplate(pokemonResponseAsJson, pokemonIndex);
    }
}

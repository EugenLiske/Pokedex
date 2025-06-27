const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";


async function fetchAndDisplayPokemon(){
    let contentContainer = document.getElementById('content_container');

    for (let pokemonIndex = 1; pokemonIndex < 21; pokemonIndex++) {

        let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
        let pokemonResponseAsJson = await pokemonResponse.json();

        contentContainer.innerHTML += createMinicardTemplate(pokemonResponseAsJson, pokemonIndex);
    }

    // let pokemonResponse = await fetch(BASE_URL + "1");
    // let pokemonResponseAsJson = await pokemonResponse.json();

    // contentContainer.innerHTML += createMinicardTemplate(pokemonResponseAsJson);
    // console.log(pokemonResponseAsJson);
}
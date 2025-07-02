const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const BASE_URL_EVO_CHAIN = "https://pokeapi.co/api/v2/pokemon-species/";
let currentPokemonIndex = 1;
let amountOfLoadedPokemon = 200;
let shownPokemonDataArray = [];

function loadPokemon(){
    let start = currentPokemonIndex;
    let end = currentPokemonIndex + amountOfLoadedPokemon;
    fetchAndDisplayPokemon(start, end);
    currentPokemonIndex = currentPokemonIndex + amountOfLoadedPokemon;
}

async function fetchAndDisplayPokemon(start, end){
    let contentContainer = document.getElementById('content_container');
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('d_none'); // Spinner VOR dem try-Bereich starten, damit dieser immer losgeht.
    try {
        for (let pokemonIndex = start; pokemonIndex < end; pokemonIndex++) {
            let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
            if (!pokemonResponse.ok) {
                throw new Error("Ups, da ist wohl etwas schief gelaufen."); // Netzwerkfehler, 404, etc.
            }
            let pokemonResponseAsJson = await pokemonResponse.json();
            contentContainer.innerHTML += createMinicardTemplate(pokemonResponseAsJson, pokemonIndex);
            // Daten für die Suchfunktion speichern
            shownPokemonDataArray.push({
                name: pokemonResponseAsJson.name,
                data: pokemonResponseAsJson,
                index: pokemonIndex
            });
        }
    } catch (error) {
        console.error(error);
        alert("Ups, da ist wohl etwas schief gelaufen.");
    } finally {
    spinner.classList.add('d_none');
  }
}

async function renderDetailedCardView(pokemonIndex){
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d_none');
    overlay.classList.add('d_flex');
    document.body.classList.add("no_scroll");

    try {
        let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
        if (!pokemonResponse.ok) {
            throw new Error("Ups, da ist wohl etwas schief gelaufen.");
        }

        let pokemonResponseAsJson = await pokemonResponse.json();
        overlay.innerHTML = renderSingleDetailedCard(pokemonResponseAsJson, pokemonIndex);
        
    } catch (error) {
        console.error(error);
        alert("Ups, da ist wohl etwas schief gelaufen.");
    }
}

function displayPreviousPokemon(previousPokemonIndex){
    renderDetailedCardView(previousPokemonIndex);
}

function displayNextPokemon(nextPokemonIndex){
    renderDetailedCardView(nextPokemonIndex);
}

// Nach Pokemon suchen

function searchForPokemon(searchTerm){
    let contentContainer = document.getElementById('content_container');
    let term = searchTerm.toLowerCase();

    contentContainer.innerHTML = '';

    if (term.length < 3) {
        // Wenn weniger als 3 Zeichen, dann alle anzeigen
        for (let searchIndex = 0; searchIndex < shownPokemonDataArray.length; searchIndex++) {
            let pokemon = shownPokemonDataArray[searchIndex];
            contentContainer.innerHTML += createMinicardTemplate(pokemon.data, pokemon.index);
        }
        return;
    }

    // Wenn mindestens 3 Zeichen, dann filtern
    for (let searchIndex = 0; searchIndex < shownPokemonDataArray.length; searchIndex++) {
        let pokemon = shownPokemonDataArray[searchIndex];
        if (pokemon.name.includes(term)) {
            contentContainer.innerHTML += createMinicardTemplate(pokemon.data, pokemon.index);
        }
    }
}


// Overlay schließen  

function onOverlayClick(event) {
    const overlay = document.getElementById('overlay');

    if (event.target === overlay) {
        closeOverlay();
    }
}

function closeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('d_none');     // wieder ausblenden
    overlay.classList.remove('d_flex');  // zentrierendes Flex-Layout entfernen
    document.body.classList.remove('no_scroll'); // Scroll wieder erlauben
}
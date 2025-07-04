const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const BASE_URL_EVO_CHAIN = "https://pokeapi.co/api/v2/pokemon-species/";
let currentPokemonIndex = 1;
let amountOfLoadedPokemon = 50;
let shownPokemonDataArray = [];

// Pokemon laden - Beim Start und beim Betätigung des Buttons

function loadPokemon(){
    let start = currentPokemonIndex;
    let end = currentPokemonIndex + amountOfLoadedPokemon;
    fetchAndDisplayPokemon(start, end);
    currentPokemonIndex = currentPokemonIndex + amountOfLoadedPokemon;
}

// Eigentliche fetch-Funktion, um die Pokemondaten zu greifen.

async function fetchAndDisplayPokemon(start, end){
    let contentContainer = document.getElementById('content_container');
    prepareDomForFetching();
    try {
        for (let pokemonIndex = start; pokemonIndex < end; pokemonIndex++) {
            let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
            if (!pokemonResponse.ok) {
                throw new Error("Ups, da ist wohl etwas schief gelaufen.");
            }
            let pokemonResponseAsJson = await pokemonResponse.json();
            contentContainer.innerHTML += createMinicardTemplate(pokemonResponseAsJson, pokemonIndex);
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
        adjustDomAfterFetching();
  }
}

// Funktionen für Spinner sowie Button- und Suchfeld-Deaktivierung während des Fetchens sowie der Aktivierung danach

function prepareDomForFetching(){
    const spinner = document.getElementById('loading-spinner');
    const loadingButton = document.getElementById('loading_button');
    const searchInput = document.getElementById('search_input');

    spinner.classList.remove('d_none');
    loadingButton.disabled = true;
    searchInput.disabled = true; 
}

function adjustDomAfterFetching(){
    const spinner = document.getElementById('loading-spinner');
    const loadingButton = document.getElementById('loading_button');
    const searchInput = document.getElementById('search_input');

    spinner.classList.add('d_none');
    loadingButton.disabled = false; 
    searchInput.disabled = false;
}

// Funktion, um die Großansicht der Pokemon-Karten zu rendern

async function renderDetailedCardView(pokemonIndex){
    let overlay = document.getElementById('overlay');
    prepareOverlay();
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

// Funktion, um das Overlay sichtbar zu machen

function prepareOverlay(){
    overlay.classList.remove('d_none');
    overlay.classList.add('d_flex');
    document.body.classList.add("no_scroll");
}

// Funktionen zum Durchblättern der Pokemon

function displayPreviousPokemon(previousPokemonIndex){
    if(previousPokemonIndex > 0){
        renderDetailedCardView(previousPokemonIndex);
    }
}

function displayNextPokemon(nextPokemonIndex){
    renderDetailedCardView(nextPokemonIndex);
}

// Nach Pokemon suchen

function searchForPokemon(searchTerm){
    let contentContainer = document.getElementById('content_container');
    let term = searchTerm.toLowerCase();

    contentContainer.innerHTML = '';

    if (term.length < 3) {  // Wenn weniger als 3 Zeichen, dann alle anzeigen
        for (let searchIndex = 0; searchIndex < shownPokemonDataArray.length; searchIndex++) {
            let pokemon = shownPokemonDataArray[searchIndex];
            contentContainer.innerHTML += createMinicardTemplate(pokemon.data, pokemon.index);
        }
        return;
    }
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

// Funktionen für die Großansicht

// Funktion, um Type-Icons und Bilder für die Minikarten vorzubereiten

function prepareMinicardTemplate(pokemonResponseAsJson){
    let pokemonTypes = pokemonResponseAsJson.types;
    let typeIconsHTML = '';
    for (let typeIndex = 0; typeIndex < pokemonTypes.length; typeIndex++) {
        let typeName = pokemonTypes[typeIndex].type.name;
        typeIconsHTML += `<img class="type_icon" src="assets/icons/${typeName}.svg" alt="${typeName}">`
    }
    let imgSrc = pokemonResponseAsJson.sprites.other.dream_world.front_default;
    if (!imgSrc) {
        imgSrc = pokemonResponseAsJson.sprites.front_default;
    }
    return {
        typeIconsHTML: typeIconsHTML,
        imgSrc: imgSrc
    };
}

// Anpassung der Bilder - Miniansicht

function adjustImageSize(event){
    const miniCardImage = event.target;
    if(miniCardImage.width > 242){
        miniCardImage.style.width = "242px";
        miniCardImage.style.height = "auto";
    }
}

// Funktion, um Type-Icons, Bilder und Abilities für die Großansicht vorzubereiten

function prepareDetailedCardTemplate(pokemonResponseAsJson){
    let pokemonTypes = pokemonResponseAsJson.types;
    let typeIconsHTML = '';
    for (let typeIndex = 0; typeIndex < pokemonTypes.length; typeIndex++) {
        let typeName = pokemonTypes[typeIndex].type.name;
        typeIconsHTML += `<img class="type_icon_detailed" src="assets/icons/${typeName}.svg" alt="${typeName}">`
    }
    let imgSrc = pokemonResponseAsJson.sprites.other.dream_world.front_default;
    if (!imgSrc) {
        imgSrc = pokemonResponseAsJson.sprites.front_default;
    }
    let pokemonAbilities = pokemonResponseAsJson.abilities;
    let abilitiesArray = [];
    for (let abilityIndex = 0; abilityIndex < pokemonAbilities.length; abilityIndex++) {
        let abilityName = pokemonAbilities[abilityIndex].ability.name;
        abilitiesArray.push(abilityName);
    }
    abilitiesHTML = abilitiesArray.join(", ");
    return {
        typeIconsHTML: typeIconsHTML,
        imgSrc: imgSrc,
        abilitiesHTML: abilitiesHTML
    };
}

// Anpassung der Bilder - Großansicht

function adjustImageSizeDetailedView(event){
    const miniCardImage = event.target;

    if(miniCardImage.width > 350){
        miniCardImage.style.width = "350px";
        miniCardImage.style.height = "auto";
    }
}

// Funktion, um Abilities und pokemonResponseAsJson für die MAIN-Stats in der Großansicht vorzubereiten

async function prepareMainStats(pokemonIndex){
        let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
        if (!pokemonResponse.ok) {
            throw new Error("Ups, da ist wohl etwas schief gelaufen.");
        }
        let pokemonResponseAsJson = await pokemonResponse.json();
        let pokemonAbilities = pokemonResponseAsJson.abilities;
        let abilitiesArray = [];
        for (let abilityIndex = 0; abilityIndex < pokemonAbilities.length; abilityIndex++) {
            let abilityName = pokemonAbilities[abilityIndex].ability.name;
            abilitiesArray.push(abilityName);
        }
        abilitiesHTML = abilitiesArray.join(", ");
        return {
            pokemonResponseAsJson: pokemonResponseAsJson,
            abilitiesHTML: abilitiesHTML
        };
}

// Funktion, um pokemonStatsfür die detaillierten Stats in der Großansicht vorzubereiten

async function prepareDetailedStats(pokemonIndex) {
    let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
    if (!pokemonResponse.ok) {
        throw new Error("Ups, da ist wohl etwas schief gelaufen.");
    }

    let pokemonResponseAsJson = await pokemonResponse.json();
    let pokemonStats = pokemonResponseAsJson.stats;
    return {
        pokemonStats: pokemonStats
    };
}

// Funktion, um das CSS auf die Evochain anzupassen

function prepareEvoChain(){
    document.getElementById('detailed_information_content_container').classList.remove('detailed_information_content_container');
    document.getElementById('detailed_information_content_container').classList.add('evo_chain_container');
    document.getElementById('detailed_information_content_container').classList.add('d_none');
}

// Funktion, um an die Evochain-Daten zu kommen

async function getEvoChainData(pokemonIndex){
        // Pokémon-Speziesdaten laden, um an die Evolution-Chain-URL zu kommen
        let speciesResponse = await fetch(BASE_URL_EVO_CHAIN + `${pokemonIndex}`);
        if (!speciesResponse.ok) {
            throw new Error("Ups, da ist wohl etwas schief gelaufen.");
        }
        let speciesResponseAsJson = await speciesResponse.json();

        // Evolution-Chain laden
        let evoChainURL = speciesResponseAsJson.evolution_chain.url;
        let evoChainResponse = await fetch(evoChainURL);
        if (!evoChainResponse.ok) {
            throw new Error("Ups, da ist wohl etwas schief gelaufen.");
        }
        let evoChainResponseAsJson = await evoChainResponse.json();
        return evoChainResponseAsJson;
}

// Funktion, um an die Evochain-Bilder zu kommen

async function generateCurrentEvoChainImage(currentEvoChainData){
    let pokemonName = currentEvoChainData.species.name;
    let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!pokemonResponse.ok) {
        throw new Error("Ups, da ist wohl etwas schief gelaufen.");
    }
    let pokemonResponseAsJson = await pokemonResponse.json();
    let evoChainImgSrc = pokemonResponseAsJson.sprites.other.dream_world.front_default;
    if (!evoChainImgSrc) {
        evoChainImgSrc = pokemonResponseAsJson.sprites.front_default;
    }

    return {
        pokemonName: pokemonName,
        evoChainImgSrc: evoChainImgSrc,
    };
}

// Anpassung der Bilder - Evochain

function adjustEvoChainImageSize(event) {
    const image = event.target;

    if (image.width > 128) {
        image.style.width = "128px";
        image.style.height = "auto";
    }
}
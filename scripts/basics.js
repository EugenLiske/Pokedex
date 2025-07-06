// basic functions - search pokemon, spinner, overlay, etc.// Nach Pokemon suchen

// search bar function

function searchForPokemon(searchTerm){
    disableLoadingButton();
    let term = prepareForSearch(searchTerm);
    if (term.length < 3) {
        displayAllPokemon(term);
        return;
    }
    displaySearchResults(term);
}

function displaySearchResults(term){
    for (let searchIndex = 0; searchIndex < shownPokemonDataArray.length; searchIndex++) {
        let pokemon = shownPokemonDataArray[searchIndex];
        if (pokemon.name.includes(term)) {
            document.getElementById('content_container').innerHTML += createMinicardTemplate(pokemon.data, pokemon.index);
        }
    }
}

function displayAllPokemon(term){
    for (let searchIndex = 0; searchIndex < shownPokemonDataArray.length; searchIndex++) {
        let pokemon = shownPokemonDataArray[searchIndex];
        document.getElementById('content_container').innerHTML += createMinicardTemplate(pokemon.data, pokemon.index);
    }
    if (term.length === 0) {
        enableLoadingButton();
    }
}

function prepareForSearch(searchTerm){
    document.getElementById('content_container').innerHTML = '';
    let term = searchTerm.toLowerCase();
    return term;
}

function disableLoadingButton(){
    document.getElementById('loading_button').disabled = true;
    document.getElementById('loading_button').classList.add('load_pokemon_button_disabled');
}

function enableLoadingButton(){
    document.getElementById('loading_button').disabled = false;
    document.getElementById('loading_button').classList.remove('load_pokemon_button_disabled');
}

// overlay

function prepareOverlay(){
    overlay.classList.remove('d_none');
    overlay.classList.add('d_flex');
    document.body.classList.add("no_scroll");
}

function onOverlayClick(event) {
    const overlay = document.getElementById('overlay');

    if (event.target === overlay) {
        closeOverlay();
    }
}

function closeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('d_none');
    overlay.classList.remove('d_flex');
    document.body.classList.remove('no_scroll');
}

// adjust pokemon images - minicard, detailed card, evochain

function adjustImageSize(event, maxWidth){
    const image = event.target;
    if(image.width > maxWidth){
        image.style.width = `${maxWidth}px`;
        image.style.height = "auto";
    }
}

// checking fetch results for errors

function checkForErrors(response){
    if (!response.ok) {
        throw new Error("Ups, da ist wohl etwas schief gelaufen.");
    }
}

// disable/enable search bar and spinner

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

// browse through the pokemon - detailed view

function displayPreviousPokemon(previousPokemonIndex){
    if(previousPokemonIndex > 0){
        renderDetailedCardView(previousPokemonIndex);
    }
}

// check if button needs to be disabled - in case of bulbasaur

function updateLeftButtonState(pokemonIndex) {
    let  leftButton = document.getElementById(`left_arrow_button_${pokemonIndex}`);
    if (pokemonIndex <= 1) {
        leftButton.classList.add('nav_arrow_disabled');
    } else {
        leftButton.classList.remove('nav_arrow_disabled');
    }
}

function displayNextPokemon(nextPokemonIndex){
    renderDetailedCardView(nextPokemonIndex);
}

// create type icons for the minicard and detailed card

function createTypeIcons(pokemonResponseAsJson){
    let pokemonTypes = pokemonResponseAsJson.types;
    let typeIconsHTML = '';
    for (let typeIndex = 0; typeIndex < pokemonTypes.length; typeIndex++) {
        let typeName = pokemonTypes[typeIndex].type.name;
        typeIconsHTML += `<img class="type_icon_detailed" src="assets/icons/${typeName}.svg" alt="${typeName}">`
    }
    return typeIconsHTML;
}

// create image source for hq svg image, return alternative png image if first isn't available

function getBestPokemonImage(primarySrc, fallbackSrc) {
    return primarySrc || fallbackSrc;
}

// create ability names for the main stats - detailed card

function createAbilityNames(pokemonResponseAsJson){
    let pokemonAbilities = pokemonResponseAsJson.abilities;
    let abilitiesArray = [];
    for (let abilityIndex = 0; abilityIndex < pokemonAbilities.length; abilityIndex++) {
        let abilityName = pokemonAbilities[abilityIndex].ability.name;
        abilitiesArray.push(abilityName);
    }
    abilitiesHTML = abilitiesArray.join(", ");
    return abilitiesHTML;
}

// adjust css for the evochain

function prepareEvoChain(){
    document.getElementById('detailed_information_content_container').classList.remove('detailed_information_content_container');
    document.getElementById('detailed_information_content_container').classList.add('evo_chain_container');
    document.getElementById('detailed_information_content_container').classList.add('d_none');
}

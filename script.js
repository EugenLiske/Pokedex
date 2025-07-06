const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const BASE_URL_EVO_CHAIN = "https://pokeapi.co/api/v2/pokemon-species/";
let currentPokemonIndex = 1;
let amountOfLoadedPokemon = 20;
let shownPokemonDataArray = [];

// loading pokemon - at the start and when pressing the loading button

function loadPokemon(){
    let start = currentPokemonIndex;
    let end = currentPokemonIndex + amountOfLoadedPokemon;
    fetchAndDisplayPokemon(start, end);
    currentPokemonIndex = currentPokemonIndex + amountOfLoadedPokemon;
}

// fetching and displaying the pokemon data

async function fetchAndDisplayPokemon(start, end){
    let contentContainer = document.getElementById('content_container');
    prepareDomForFetching();
    try {
        for (let pokemonIndex = start; pokemonIndex < end; pokemonIndex++) {
            await loadAndRenderSinglePokemon(pokemonIndex, contentContainer);
        }
    } catch (error) {
        console.error(error);
        alert("Ups, da ist wohl etwas schief gelaufen.");
    } finally {
        adjustDomAfterFetching();
  }
}

// loading and rendering single pokemon - minicard

async function loadAndRenderSinglePokemon(pokemonIndex, container) {
    const response = await fetch(BASE_URL + pokemonIndex);
    checkForErrors(response);
    const data = await response.json();
    container.innerHTML += createMinicardTemplate(data, pokemonIndex);
    shownPokemonDataArray.push({
        name: data.name,
        data: data,
        index: pokemonIndex
    });
}

// prepare type icons and images for the minicards

function prepareMinicardTemplate(pokemonResponseAsJson){
    let typeIconsHTML = createTypeIcons(pokemonResponseAsJson);
    let imgSrc = getBestPokemonImage(
        pokemonResponseAsJson.sprites.other.dream_world.front_default,
        pokemonResponseAsJson.sprites.front_default
    );
    return {
        typeIconsHTML: typeIconsHTML,
        imgSrc: imgSrc
    };
}

// create the minicard

function createMinicardTemplate(pokemonResponseAsJson, pokemonIndex){
    let preparationsResults = prepareMinicardTemplate(pokemonResponseAsJson);
    let typeIconsHTML = preparationsResults.typeIconsHTML;
    let imgSrc = preparationsResults.imgSrc;
    return buildRawTemplateMinicard(pokemonResponseAsJson, imgSrc, typeIconsHTML, pokemonIndex)
}

// rendering single pokemon - detailed view

async function renderDetailedCardView(pokemonIndex){
    let overlay = document.getElementById('overlay');
    prepareOverlay();
    try {
        let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
        checkForErrors(pokemonResponse);
        let pokemonResponseAsJson = await pokemonResponse.json();
        overlay.innerHTML = renderSingleDetailedCard(pokemonResponseAsJson, pokemonIndex);
    } catch (error) {
        console.error(error);
        alert("Ups, da ist wohl etwas schief gelaufen.");
    }
    updateLeftButtonState(pokemonIndex);
}

// create the detailed card

function renderSingleDetailedCard(pokemonResponseAsJson, pokemonIndex){
    let preparationsResults = prepareDetailedCardTemplate(pokemonResponseAsJson);
    return buildRawTemplateDetailedCard(pokemonResponseAsJson, pokemonIndex, preparationsResults);
}

// prepare type icons, images and abilities for the detailed card

function prepareDetailedCardTemplate(pokemonResponseAsJson){
    let typeIconsHTML = createTypeIcons(pokemonResponseAsJson);
    let imgSrc = getBestPokemonImage(
        pokemonResponseAsJson.sprites.other.dream_world.front_default,
        pokemonResponseAsJson.sprites.front_default
    );
    let abilitiesHTML = createAbilityNames(pokemonResponseAsJson);
    return {
        typeIconsHTML: typeIconsHTML,
        imgSrc: imgSrc,
        abilitiesHTML: abilitiesHTML
    };
}

// create the main stats of the detailled card

async function renderMainStats(pokemonIndex){
    document.getElementById('detailed_information_content_container').classList.add('detailed_information_content_container');
    document.getElementById('detailed_information_content_container').classList.remove('evo_chain_container');
    try {
        let preparationResults = await prepareMainStats(pokemonIndex)
        let pokemonResponseAsJson = preparationResults.pokemonResponseAsJson;
        let abilitiesHTML = preparationResults.abilitiesHTML;
        let detailedInformationContentContainer = document.getElementById('detailed_information_content_container');
        detailedInformationContentContainer.innerHTML = buildRawTemplateMainstats(pokemonResponseAsJson, abilitiesHTML);
    } catch (error) {
        console.error(error);
        alert("Ups, da ist wohl etwas schief gelaufen.");
    }
}

// prepare the abilities and pokemonResponseAsJson for the mainstats of the detailled card

async function prepareMainStats(pokemonIndex){
        let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
        checkForErrors(pokemonResponse);
        let pokemonResponseAsJson = await pokemonResponse.json();
        let abilitiesHTML = createAbilityNames(pokemonResponseAsJson);
        return {
            pokemonResponseAsJson: pokemonResponseAsJson,
            abilitiesHTML: abilitiesHTML
        };
}

// create the detailled stats of the detailled card

async function renderDetailedStats(pokemonIndex){
    document.getElementById('detailed_information_content_container').classList.add('detailed_information_content_container');
    document.getElementById('detailed_information_content_container').classList.remove('evo_chain_container');
    try {
        let preparationsResults = await prepareDetailedStats(pokemonIndex);
        let pokemonStats = preparationsResults.pokemonStats;
        let statsHTML = generateMainStatsHTML(pokemonStats);
        document.getElementById('detailed_information_content_container').innerHTML = statsHTML;
    } catch (error) {
        console.error(error);
        alert("Ups, da ist wohl etwas schief gelaufen.");
    }
}

// create main stats html for the detailled card

function generateMainStatsHTML(pokemonStats) {
    const MAX_STAT_VALUE = 255;
    let statsHTML = '';
    for (let i = 0; i < pokemonStats.length; i++) {
        const statName = pokemonStats[i].stat.name;
        const statValue = pokemonStats[i].base_stat;
        const widthPercent = (statValue / MAX_STAT_VALUE) * 100;
        statsHTML += buildRawTemplateDetailedStats(statName, widthPercent);
    }
    return statsHTML;
}

// prepare the pokemon stats for the detailled stats of the detailled card

async function prepareDetailedStats(pokemonIndex) {
    let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
    checkForErrors(pokemonResponse);
    let pokemonResponseAsJson = await pokemonResponse.json();
    let pokemonStats = pokemonResponseAsJson.stats;
    return {
        pokemonStats: pokemonStats
    };
}

// create the evochain for the detailled card

async function renderEvoChain(pokemonIndex){
    prepareEvoChain();
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('d_none');
    let evoChainHTML = '';
    try {
        evoChainHTML = await generateEvoChainHTML(pokemonIndex);
    } catch (error) {
        console.error(error);
        alert("Ups, da ist wohl etwas schief gelaufen.");
    } finally { // finally wird IMMER ausgeführt
        spinner.classList.add('d_none');
        document.getElementById('detailed_information_content_container').classList.remove('d_none');
        document.getElementById('detailed_information_content_container').innerHTML = evoChainHTML;
  }
}

// create evochain html for the detailled card

async function generateEvoChainHTML(pokemonIndex){
    let evoChainHTML = '';
    let evoChainData = await getEvoChainData(pokemonIndex);
    let currentEvoChainData = evoChainData.chain;
    while (currentEvoChainData) {
        let evoChainPreparationsResults = await generateCurrentEvoChainImage(currentEvoChainData)
        let pokemonName =  evoChainPreparationsResults.pokemonName;
        let evoChainImgSrc =  evoChainPreparationsResults.evoChainImgSrc;
        evoChainHTML += buildRawTemplateEvoChain(evoChainImgSrc, pokemonName);
            if (currentEvoChainData.evolves_to.length > 0) {
                evoChainHTML += `<div class="evo_arrow"></div>`;
            }
        currentEvoChainData = currentEvoChainData.evolves_to[0];
    }
    return evoChainHTML;
}


// get evochain data

async function getEvoChainData(pokemonIndex){
        let speciesResponse = await fetch(BASE_URL_EVO_CHAIN + `${pokemonIndex}`); // get evochain-url
        checkForErrors(speciesResponse);
        let speciesResponseAsJson = await speciesResponse.json();
        let evoChainURL = speciesResponseAsJson.evolution_chain.url;
        let evoChainResponse = await fetch(evoChainURL); // get evochain-data
        checkForErrors(evoChainResponse);
        let evoChainResponseAsJson = await evoChainResponse.json();
        return evoChainResponseAsJson;
}

// generate evochain images

async function generateCurrentEvoChainImage(currentEvoChainData){
    let pokemonName = currentEvoChainData.species.name;
    let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    checkForErrors(pokemonResponse);
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


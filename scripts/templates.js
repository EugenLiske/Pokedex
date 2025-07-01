function createMinicardTemplate(pokemonResponseAsJson, pokemonIndex){
    let pokemonTypes = pokemonResponseAsJson.types;
    let typeIconsHTML = '';

    for (let typeIndex = 0; typeIndex < pokemonTypes.length; typeIndex++) {
        let typeName = pokemonTypes[typeIndex].type.name;
        typeIconsHTML += `<img class="type_icon" src="assets/icons/${typeName}.svg" alt="${typeName}">`
    }

    return `
        <div class="pokemon_card_mini">
            <div class="card_header">
                <div class="pokemon_id">
                    # ${pokemonResponseAsJson.id}
                </div>
                <div class="pokemon_name">
                    ${pokemonResponseAsJson.name}
                </div>
            </div>

            <div onclick="renderDetailedCardView(${pokemonIndex})" class="image_container ${pokemonResponseAsJson.types[0].type.name}">
                <img onload="adjustImageSize(${pokemonIndex})" id="card_image_mini_${pokemonIndex}" class="card_image_mini" src="${pokemonResponseAsJson.sprites.other.dream_world.front_default}" alt="${pokemonResponseAsJson.name}">
            </div>
            <div id="type_area_${pokemonIndex}" class="type_area">
                ${typeIconsHTML}
            </div>
        </div>

    `
}

// Anpassung der Bilder - Miniansicht

function adjustImageSize(pokemonIndex){
    let miniCardImage = document.getElementById(`card_image_mini_${pokemonIndex}`);

    if(miniCardImage.width > 242){
        miniCardImage.style.width = "242px";
        miniCardImage.style.height = "auto";
    }
}

function renderSingleDetailedCard(pokemonResponseAsJson, pokemonIndex){
    // Rendern der Typ-Icons
    let pokemonTypes = pokemonResponseAsJson.types;
    let typeIconsHTML = '';

    for (let typeIndex = 0; typeIndex < pokemonTypes.length; typeIndex++) {
        let typeName = pokemonTypes[typeIndex].type.name;
        typeIconsHTML += `<img class="type_icon_detailed" src="assets/icons/${typeName}.svg" alt="${typeName}">`
    }

    // Rendern der Fähigkeiten
    let pokemonAbilities = pokemonResponseAsJson.abilities;
    let abilitiesArray = []; // Array als Zwischenlösung notwendig, damit .join funktioniert

    for (let abilityIndex = 0; abilityIndex < pokemonAbilities.length; abilityIndex++) {
        let abilityName = pokemonAbilities[abilityIndex].ability.name;
        abilitiesArray.push(abilityName);
    }
    let abilitiesHTML = abilitiesArray.join(", ");

    return `
        <div class="pokemon_card_detailed">
            <div class="card_header_detailed">
                <div class="pokemon_id">
                    # ${pokemonResponseAsJson.id}
                </div>
                <div class="pokemon_name">
                    ${pokemonResponseAsJson.name}
                </div>
            </div>

        <div class="image_container_detailed ${pokemonResponseAsJson.types[0].type.name}">
            <img
            onload="adjustImageSizeDetailedView(${pokemonIndex})"
            id="card_image_detailed_${pokemonIndex}"
            class="card_image_detailed"
            src="${pokemonResponseAsJson.sprites.other.dream_world.front_default}"
            alt="${pokemonResponseAsJson.name}">

            <div class="nav_arrow left_arrow" onclick="displayPreviousPokemon(${pokemonIndex - 1})"></div>
            <div class="nav_arrow right_arrow" onclick="displayNextPokemon(${pokemonIndex + 1})"></div>
        </div>
        <div id="type_area_detailed_${pokemonIndex}" class="type_area_detailed">
            ${typeIconsHTML}
        </div>

        <div class="detailed_information_header">
            <div class="more_stats_button" onclick="renderMainStats(${pokemonIndex})">main</div>
            <div class="separator"></div>
            <div class="more_stats_button" onclick="renderDetailedStats(${pokemonIndex})">stats</div>
            <div class="separator"></div>
            <div class="more_stats_button" onclick="renderEvoChain(${pokemonIndex})">evo chain</div>
        </div>

        <div class="detailed_information_content_container" id="detailed_information_content_container">
            <div class="info_row_mainstats">
                <span class="info_label_mainstats">Height:</span>
                <span class="info_value_mainstats">${pokemonResponseAsJson.height} m</span>
            </div>
            <div class="info_row_mainstats">
                <span class="info_label_mainstats">Weight:</span>
                <span class="info_value_mainstats">${pokemonResponseAsJson.weight} kg</span>
            </div>
            <div class="info_row_mainstats">
                <span class="info_label_mainstats">Base Experience:</span>
                <span class="info_value_mainstats">${pokemonResponseAsJson.base_experience} xp</span>
            </div>
            <div class="info_row_mainstats">
                <span class="info_label_mainstats">Abilities:</span>
                <span class="info_value_mainstats">${abilitiesHTML}</span>
            </div>
        </div>
    </div>
    `
}

// Anpassung der Bilder - Großansicht

function adjustImageSizeDetailedView(pokemonIndex){
    let miniCardImage = document.getElementById(`card_image_detailed_${pokemonIndex}`);

    if(miniCardImage.width > 350){
        miniCardImage.style.width = "350px";
        miniCardImage.style.height = "auto";
    }
}

async function renderMainStats(pokemonIndex){
    document.getElementById('detailed_information_content_container').classList.add('detailed_information_content_container');
    document.getElementById('detailed_information_content_container').classList.remove('evo_chain_container');

    let pokemonResponse = await fetch (BASE_URL + `${pokemonIndex}`);
    let pokemonResponseAsJson = await pokemonResponse.json();

    let pokemonAbilities = pokemonResponseAsJson.abilities;
    let abilitiesArray = []; // Array als Zwischenlösung notwendig, damit .join funktioniert

    for (let abilityIndex = 0; abilityIndex < pokemonAbilities.length; abilityIndex++) {
        let abilityName = pokemonAbilities[abilityIndex].ability.name;
        abilitiesArray.push(abilityName);
    }

    let abilitiesHTML = abilitiesArray.join(", ");

    let detailedInformationContentContainer = document.getElementById('detailed_information_content_container');
    detailedInformationContentContainer.innerHTML = `
        <div class="info_row_mainstats">
            <span class="info_label_mainstats">Height:</span>
            <span class="info_value_mainstats">${pokemonResponseAsJson.height} m</span>
        </div>
        <div class="info_row_mainstats">
            <span class="info_label_mainstats">Weight:</span>
            <span class="info_value_mainstats">${pokemonResponseAsJson.weight} kg</span>
        </div>
        <div class="info_row_mainstats">
            <span class="info_label_mainstats">Base Experience:</span>
            <span class="info_value_mainstats">${pokemonResponseAsJson.base_experience} xp</span>
        </div>
        <div class="info_row_mainstats">
            <span class="info_label_mainstats">Abilities:</span>
            <span class="info_value_mainstats">${abilitiesHTML}</span>
        </div>
    `

}

async function renderDetailedStats(pokemonIndex){
    document.getElementById('detailed_information_content_container').classList.add('detailed_information_content_container');
    document.getElementById('detailed_information_content_container').classList.remove('evo_chain_container');
    const MAX_STAT_VALUE = 255;

    let pokemonResponse = await fetch (BASE_URL + `${pokemonIndex}`);
    let pokemonResponseAsJson = await pokemonResponse.json();
    let pokemonStats = pokemonResponseAsJson.stats;

    let detailedInformationContentContainer = document.getElementById('detailed_information_content_container');
    let statsHTML = '';

    for (let statsIndex = 0; statsIndex < pokemonStats.length; statsIndex++) {
        let statName = pokemonStats[statsIndex].stat.name;
        let statValue = pokemonStats[statsIndex].base_stat;
        let widthPercent = (statValue / MAX_STAT_VALUE) * 100;

        statsHTML += `
            <div class="info_row_detailled_stats">
                <span class="info_label_detailled_stats">${statName}</span>
                <div class="bar_wrapper_detailled_stats">
                    <div class="bar_fill_detailled_stats" style="width: ${widthPercent}%"></div>
                </div>
            </div>
        `
    }

    detailedInformationContentContainer.innerHTML = statsHTML;
}

async function renderEvoChain(pokemonIndex){
    document.getElementById('detailed_information_content_container').classList.remove('detailed_information_content_container');
    document.getElementById('detailed_information_content_container').classList.add('evo_chain_container');

    // Pokémon-Speziesdaten laden, um an die Evolution-Chain-URL zu kommen
    let speciesResponse = await fetch(BASE_URL_EVO_CHAIN + `${pokemonIndex}`);
    let speciesResponseAsJson = await speciesResponse.json();

    // Evolution-Chain laden
    let evoChainURL = speciesResponseAsJson.evolution_chain.url;
    let evoChainResponse = await fetch(evoChainURL);
    let evoChainResponseAsJson = await evoChainResponse.json();

    // Evolutionen durchlaufen

    let currentEvoChainData = evoChainResponseAsJson.chain;
    let evoChainHTML = '';

    while (currentEvoChainData) {
        let pokemonName = currentEvoChainData.species.name;

        let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        let pokemonResponseAsJson = await pokemonResponse.json();

        let evoChainImgSrc = pokemonResponseAsJson.sprites.other.dream_world.front_default;

        evoChainHTML += `
            <img
            onload="adjustEvoChainImageSize(event)"
            class="evo_chain_image"
            src="${evoChainImgSrc}"
            alt="${pokemonName}">

        `

        if(currentEvoChainData.evolves_to.length > 0){
            evoChainHTML += `<div class="evo_arrow"></div>`;
        }

        currentEvoChainData = currentEvoChainData.evolves_to[0];
    }
    document.getElementById('detailed_information_content_container').innerHTML = evoChainHTML;
}

// Anpassung der Bilder - Evochain

function adjustEvoChainImageSize(event) {
    const image = event.target;

    if (image.width > 100) {
        image.style.width = "100px";
        image.style.height = "auto";
    }
}
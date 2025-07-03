function createMinicardTemplate(pokemonResponseAsJson, pokemonIndex){
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
                <img onload="adjustImageSize(${pokemonIndex})" id="card_image_mini_${pokemonIndex}" class="card_image_mini" src="${imgSrc}" alt="${pokemonResponseAsJson.name}">
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

    let imgSrc = pokemonResponseAsJson.sprites.other.dream_world.front_default;

    if (!imgSrc) {
        imgSrc = pokemonResponseAsJson.sprites.front_default;
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
                <img
                    src="assets/icons/delete_button.png"
                    alt="Close"
                    class="close_button"
                    onclick="closeOverlay()"
                >
            </div>

        <div class="image_container_detailed ${pokemonResponseAsJson.types[0].type.name}">
            <img
            onload="adjustImageSizeDetailedView(${pokemonIndex})"
            id="card_image_detailed_${pokemonIndex}"
            class="card_image_detailed"
            src="${imgSrc}"
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

    try {
        let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
        if (!pokemonResponse.ok) {
            throw new Error("Ups, da ist wohl etwas schief gelaufen.");
        }

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
        `;
    } catch (error) {
        console.error(error);
        alert("Ups, da ist wohl etwas schief gelaufen.");
    }
}

async function renderDetailedStats(pokemonIndex){
    document.getElementById('detailed_information_content_container').classList.add('detailed_information_content_container');
    document.getElementById('detailed_information_content_container').classList.remove('evo_chain_container');
    const MAX_STAT_VALUE = 255;

    try {
        let pokemonResponse = await fetch(BASE_URL + `${pokemonIndex}`);
        if (!pokemonResponse.ok) {
            throw new Error("Ups, da ist wohl etwas schief gelaufen.");
        }

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
            `;
        }

        detailedInformationContentContainer.innerHTML = statsHTML;
    } catch (error) {
        console.error(error);
        alert("Ups, da ist wohl etwas schief gelaufen.");
    }
}

async function renderEvoChain(pokemonIndex){
    document.getElementById('detailed_information_content_container').classList.remove('detailed_information_content_container');
    document.getElementById('detailed_information_content_container').classList.add('evo_chain_container');
    // d_none zwecks verbesserter UE, kein halbsichtbarer Loadingkram
    document.getElementById('detailed_information_content_container').classList.add('d_none');
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('d_none'); // Spinner VOR dem try-Bereich starten, damit dieser immer losgeht.
    // Loading der Evochain, muss vorher deklariert werden für das finally
    let evoChainHTML = '';
    try {
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

        // Evolutionen durchlaufen
        let currentEvoChainData = evoChainResponseAsJson.chain;

        while (currentEvoChainData) {
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

            evoChainHTML += `
                <img
                onload="adjustEvoChainImageSize(event)"
                class="evo_chain_image"
                src="${evoChainImgSrc}"
                alt="${pokemonName}">
            `;

            if (currentEvoChainData.evolves_to.length > 0) {
                evoChainHTML += `<div class="evo_arrow"></div>`;
            }

            currentEvoChainData = currentEvoChainData.evolves_to[0];
        }
    } catch (error) {
        console.error(error);
        alert("Ups, da ist wohl etwas schief gelaufen.");
    } finally { // finally wird IMMER ausgeführt
        spinner.classList.add('d_none');
        document.getElementById('detailed_information_content_container').classList.remove('d_none');
        document.getElementById('detailed_information_content_container').innerHTML = evoChainHTML;
  }
}

// Anpassung der Bilder - Evochain

function adjustEvoChainImageSize(event) {
    const image = event.target;

    if (image.width > 128) {
        image.style.width = "128px";
        image.style.height = "auto";
    }
}
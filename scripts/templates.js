// Template-Funktion, um die Minikarten zu rendern

function createMinicardTemplate(pokemonResponseAsJson, pokemonIndex){
    let preparationsResults = prepareMinicardTemplate(pokemonResponseAsJson);
    let typeIconsHTML = preparationsResults.typeIconsHTML;
    let imgSrc = preparationsResults.imgSrc;
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
                <img onload="adjustImageSize(event)" id="card_image_mini_${pokemonIndex}" class="card_image_mini" src="${imgSrc}" alt="${pokemonResponseAsJson.name}">
            </div>
            <div id="type_area_${pokemonIndex}" class="type_area">
                ${typeIconsHTML}
            </div>
        </div>

    `
}

// Template-Funktion, um die Großansicht zu rendern

function renderSingleDetailedCard(pokemonResponseAsJson, pokemonIndex){
    let preparationsResults = prepareDetailedCardTemplate(pokemonResponseAsJson);
    let typeIconsHTML = preparationsResults.typeIconsHTML;
    let imgSrc = preparationsResults.imgSrc;
    let abilitiesHTML = preparationsResults.abilitiesHTML;
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
            onload="adjustImageSizeDetailedView(event)"
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

// Template-Funktion, um die MAIN-Stats zu rendern (linker Reiter innerhalb der Großansicht)

async function renderMainStats(pokemonIndex){
    document.getElementById('detailed_information_content_container').classList.add('detailed_information_content_container');
    document.getElementById('detailed_information_content_container').classList.remove('evo_chain_container');
    try {
        let preparationResults = await prepareMainStats(pokemonIndex)
        let pokemonResponseAsJson = preparationResults.pokemonResponseAsJson;
        let abilitiesHTML = preparationResults.abilitiesHTML;
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

// Template-Funktion, um die detaillierten Stats zu rendern (mittiger Reiter innerhalb der Großansicht)

async function renderDetailedStats(pokemonIndex){
    document.getElementById('detailed_information_content_container').classList.add('detailed_information_content_container');
    document.getElementById('detailed_information_content_container').classList.remove('evo_chain_container');
    const MAX_STAT_VALUE = 255;
    try {
        let preparationsResults = await prepareDetailedStats(pokemonIndex);
        let pokemonStats = preparationsResults.pokemonStats;
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

// Funktion, um die Evochain zu rendern (rechter Reiter innerhalb der Großansicht)

async function renderEvoChain(pokemonIndex){
    prepareEvoChain();
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('d_none');
    let evoChainHTML = '';
    try {
        let evoChainData = await getEvoChainData(pokemonIndex);
        let currentEvoChainData = evoChainData.chain;

        while (currentEvoChainData) {
            let evoChainPreparationsResults = await generateCurrentEvoChainImage(currentEvoChainData)
            let pokemonName =  evoChainPreparationsResults.pokemonName;
            let evoChainImgSrc =  evoChainPreparationsResults.evoChainImgSrc;
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
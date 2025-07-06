// build the raw template for the minicards

function buildRawTemplateMinicard(pokemonResponseAsJson, imgSrc, typeIconsHTML, pokemonIndex){
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
            <img onload="adjustImageSize(event, 242)" id="card_image_mini_${pokemonIndex}" class="card_image_mini" src="${imgSrc}" alt="${pokemonResponseAsJson.name}">
        </div>
        <div id="type_area_${pokemonIndex}" class="type_area">
            ${typeIconsHTML}
        </div>
    </div>
    `
}

// build the raw template for the detailed cards

function buildRawTemplateDetailedCard(pokemonResponseAsJson, pokemonIndex, typeIconsHTML, imgSrc, abilitiesHTML){
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
            onload="adjustImageSize(event, 350)"
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

// build the raw template for the main stats

function buildRawTemplateMainstats(pokemonResponseAsJson, abilitiesHTML){
    return `
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

// build the raw template for detailed main stats

function buildRawTemplateDetailedStats(statName, widthPercent){
    return `
    <div class="info_row_detailled_stats">
        <span class="info_label_detailled_stats">${statName}</span>
        <div class="bar_wrapper_detailled_stats">
            <div class="bar_fill_detailled_stats" style="width: ${widthPercent}%"></div>
        </div>
    </div>
    `
}

// build the raw template for evochain

function buildRawTemplateEvoChain(evoChainImgSrc, pokemonName){
    return `
    <img
        onload="adjustImageSize(event, 128)"
        class="evo_chain_image"
        src="${evoChainImgSrc}"
        alt="${pokemonName}">
    `
}
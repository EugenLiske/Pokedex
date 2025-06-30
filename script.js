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

async function renderDetailedCardView(pokemonIndex){
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d_none');
    overlay.classList.add('d_flex');
    document.body.classList.add("no_scroll");

    let pokemonResponse = await fetch (BASE_URL + `${pokemonIndex}`);
    let pokemonResponseAsJson = await pokemonResponse.json();

    overlay.innerHTML = renderSingleDetailedCard(pokemonResponseAsJson, pokemonIndex);

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
            <img onload="adjustImageSizeDetailedView(${pokemonIndex})" id="card_image_detailed_${pokemonIndex}" class="card_image_detailed" src="${pokemonResponseAsJson.sprites.other.dream_world.front_default}" alt="${pokemonResponseAsJson.name}">
        </div>
        <div id="type_area_detailed_${pokemonIndex}" class="type_area_detailed">
            ${typeIconsHTML}
        </div>

        <div class="detailed_information_header">
            <div onclick="renderMainStats()">main</div>
            <div class="separator"></div>
            <div onclick="renderDetailedStats()">stats</div>
            <div class="separator"></div>
            <div onclick="renderEvoChain()">evo chain</div>
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


             <div class="info_row_detailled_stats">
                 <span class="info_label_detailled_stats">HP</span>
                 <div class="bar_wrapper_detailled_stats">
                     <div id="hp_value" class="bar_fill_detailled_stats" style="width: 39%"></div>
                 </div>
             </div>
             <div class="info_row_detailled_stats">
                 <span class="info_label_detailled_stats">Attack</span>
                 <div class="bar_wrapper_detailled_stats">
                     <div id="attack_value" class="bar_fill_detailled_stats" style="width: 52%"></div>
                 </div>
             </div>
             <div class="info_row_detailled_stats">
                 <span class="info_label_detailled_stats">Defense</span>
                 <div class="bar_wrapper_detailled_stats">
                     <div id="defense_value" class="bar_fill_detailled_stats" style="width: 43%"></div>
                 </div>
             </div>
             <div class="info_row_detailled_stats">
                 <span class="info_label_detailled_stats">Special-Attack</span>
                 <div class="bar_wrapper_detailled_stats">
                     <div id="special_attack_value" class="bar_fill_detailled_stats" style="width: 60%"></div>
                 </div>
             </div>
             <div class="info_row_detailled_stats">
                 <span class="info_label_detailled_stats">Special-Defense</span>
                 <div class="bar_wrapper_detailled_stats">
                     <div id="special_defense_value" class="bar_fill_detailled_stats" style="width: 50%"></div>
                 </div>
             </div>
             <div class="info_row_detailled_stats">
                 <span class="info_label_detailled_stats">Speed</span>
                 <div class="bar_wrapper_detailled_stats">
                     <div id="speed_value" class="bar_fill_detailled_stats" style="width: 65%"></div>
                 </div>
             </div>


        </div>
    </div>
    `
}

function adjustImageSizeDetailedView(pokemonIndex){
    let miniCardImage = document.getElementById(`card_image_detailed_${pokemonIndex}`);

    if(miniCardImage.width > 350){
        miniCardImage.style.width = "350px";
        miniCardImage.style.height = "auto";
    }
}

    // <div class="pokemon_card_detailed">

    //     <div class="card_header_detailed">
    //         <div class="pokemon_id">
    //             #1
    //         </div>
    //         <div class="pokemon_name">
    //             Bulbasaur
    //         </div>
    //     </div>

    //     <div class="image_container_detailed ${pokemonResponseAsJson.types[0].type.name} grass">
    //         <img onload="adjustImageSize()" id="card_image_mini_${pokemonIndex}" class="card_image_detailed" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg" alt="${pokemonResponseAsJson.name}">
    //     </div>
    //     <div id="type_area_${pokemonIndex}" class="type_area_detailed">
    //         <img class="type_icon_detailed" src="assets/icons/grass.svg" alt="${typeName}">
    //     </div>

    //     <div class="detailed_information_header">
    //         <div onclick="renderMainStats()">main</div>
    //         <div class="separator"></div>
    //         <div onclick="renderDetailedStats()">stats</div>
    //         <div class="separator"></div>
    //         <div onclick="renderEvoChain()">evo chain</div>
    //     </div>

    //     <div class="detailed_information_content_container" id="detailed_information_content_container">

    //         <div class="info_row_mainstats">
    //             <span class="info_label_mainstats">Height:</span>
    //             <span class="info_value_mainstats">0.6 m</span>
    //         </div>
    //         <div class="info_row_mainstats">
    //             <span class="info_label_mainstats">Weight:</span>
    //             <span class="info_value_mainstats">8.5 kg</span>
    //         </div>
    //         <div class="info_row_mainstats">
    //             <span class="info_label_mainstats">Base Experience:</span>
    //             <span class="info_value_mainstats">62</span>
    //         </div>
    //         <div class="info_row_mainstats">
    //             <span class="info_label_mainstats">Abilities:</span>
    //             <span class="info_value_mainstats">blaze, solar power</span>
    //         </div>

    //         <!-- <div class="info_row_detailled_stats">
    //             <span class="info_label_detailled_stats">HP</span>
    //             <div class="bar_wrapper_detailled_stats">
    //                 <div id="hp_value" class="bar_fill_detailled_stats" style="width: 39%"></div>
    //             </div>
    //         </div>
    //         <div class="info_row_detailled_stats">
    //             <span class="info_label_detailled_stats">Attack</span>
    //             <div class="bar_wrapper_detailled_stats">
    //                 <div id="attack_value" class="bar_fill_detailled_stats" style="width: 52%"></div>
    //             </div>
    //         </div>
    //         <div class="info_row_detailled_stats">
    //             <span class="info_label_detailled_stats">Defense</span>
    //             <div class="bar_wrapper_detailled_stats">
    //                 <div id="defense_value" class="bar_fill_detailled_stats" style="width: 43%"></div>
    //             </div>
    //         </div>
    //         <div class="info_row_detailled_stats">
    //             <span class="info_label_detailled_stats">Special-Attack</span>
    //             <div class="bar_wrapper_detailled_stats">
    //                 <div id="special_attack_value" class="bar_fill_detailled_stats" style="width: 60%"></div>
    //             </div>
    //         </div>
    //         <div class="info_row_detailled_stats">
    //             <span class="info_label_detailled_stats">Special-Defense</span>
    //             <div class="bar_wrapper_detailled_stats">
    //                 <div id="special_defense_value" class="bar_fill_detailled_stats" style="width: 50%"></div>
    //             </div>
    //         </div>
    //         <div class="info_row_detailled_stats">
    //             <span class="info_label_detailled_stats">Speed</span>
    //             <div class="bar_wrapper_detailled_stats">
    //                 <div id="speed_value" class="bar_fill_detailled_stats" style="width: 65%"></div>
    //             </div>
    //         </div> -->
    //     </div>
    // </div>

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
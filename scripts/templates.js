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

function adjustImageSize(pokemonIndex){
    let miniCardImage = document.getElementById(`card_image_mini_${pokemonIndex}`);

    if(miniCardImage.width > 242){
        miniCardImage.style.width = "242px";
        miniCardImage.style.height = "auto";
    }
}
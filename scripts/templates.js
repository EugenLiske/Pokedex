// function createMinicardTemplate(pokemonResponseAsJson){
//     return `
//         <div class="pokemon_card_mini">
//             <div class="card_header">
//                 <div class="pokemon_id">
//                     ${pokemonResponseAsJson.id}
//                 </div>
//                 <div class="pokemon_name">
//                     ${pokemonResponseAsJson.name}
//                 </div>
//             </div>

//             <div class="image_container">
//                 <img id="card_image_mini" class="card_image_mini" src="${pokemonResponseAsJson.sprites.other.dream_world.front_default}" alt="${pokemonResponseAsJson.name}">
//             </div>
//             <div class="type_area">
//                 <img class="type_icon" src="assets/icons/${pokemonResponseAsJson.types[0].type.name}.svg" alt="grass">
//             </div>
//         </div>

//     `
// }

function createMinicardTemplate(pokemonResponseAsJson, pokemonIndex){
    return `
        <div class="pokemon_card_mini">
            <div class="card_header">
                <div class="pokemon_id">
                    #${pokemonResponseAsJson.id}
                </div>
                <div class="pokemon_name">
                    ${pokemonResponseAsJson.name}
                </div>
            </div>

            <div class="image_container">
                <img onload="adjustImageSize(${pokemonIndex})" id="card_image_mini_${pokemonIndex}" class="card_image_mini" src="${pokemonResponseAsJson.sprites.other.dream_world.front_default}" alt="${pokemonResponseAsJson.name}">
            </div>
            <div class="type_area">
                <img class="type_icon" src="assets/icons/${pokemonResponseAsJson.types[0].type.name}.svg" alt="grass">
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
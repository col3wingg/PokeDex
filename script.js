async function fetchPokemonDetails(url) {
    const response = await fetch(url)
    return await response.json()
}

async function searchPokemons(detailedPokemons, search_value) {
    return detailedPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(search_value.toLowerCase()))
}

async function sortPokemons(detailedPokemons) {
    const id_radio = document.getElementById("id-radio-input")
    const name_radio = document.getElementById("name-radio-input")
    const health_radio = document.getElementById("health-radio-input")
    const damage_radio = document.getElementById("damage-radio-input")
    const defense_radio = document.getElementById("defense-radio-input")
    
    const fstb_radio = document.getElementById("fstb-radio-input")
    const fbts_radio = document.getElementById("fbts-radio-input")

    if (id_radio.checked) {
        if (fstb_radio.checked) {
            detailedPokemons.sort((a, b) => a.id - b.id)
        } else if (fbts_radio.checked) {
            detailedPokemons.sort((a, b) => b.id - a.id)
        }
    }

    if (name_radio.checked) {
        if (fstb_radio.checked) {
            detailedPokemons.sort((a, b) => a.name.localeCompare(b.name))
        } else if (fbts_radio.checked) {
            detailedPokemons.sort((a, b) => b.name.localeCompare(a.name))
        }
    }

    if (health_radio.checked) {
        if (fstb_radio.checked) {
            detailedPokemons.sort((a, b) => {
                hpA = a.stats.find(s => s.stat.name === "hp").base_stat
                hpB = b.stats.find(s => s.stat.name === "hp").base_stat
                return hpA - hpB
            })
        } else if (fbts_radio.checked) {
            detailedPokemons.sort((a, b) => {
                hpA = a.stats.find(s => s.stat.name === "hp").base_stat
                hpB = b.stats.find(s => s.stat.name === "hp").base_stat
                return hpB - hpA
            })
        }
    }

    if (damage_radio.checked) {
        if (fstb_radio.checked) {
            detailedPokemons.sort((a, b) => {
                dmgA = a.stats.find(s => s.stat.name === "attack").base_stat
                dmgB = b.stats.find(s => s.stat.name === "attack").base_stat
                return dmgA - dmgB
            })
        } else if (fbts_radio.checked) {
            detailedPokemons.sort((a, b) => {
                dmgA = a.stats.find(s => s.stat.name === "attack").base_stat
                dmgB = b.stats.find(s => s.stat.name === "attack").base_stat
                return dmgB - dmgA
            })
        }
    }

    if (defense_radio.checked) {
        if (fstb_radio.checked) {
            detailedPokemons.sort((a, b) => {
                dfnA = a.stats.find(s => s.stat.name === "defense").base_stat
                dfnB = b.stats.find(s => s.stat.name === "defense").base_stat
                return dfnA - dfnB
            })
        } else if (fbts_radio.checked) {
            detailedPokemons.sort((a, b) => {
                dfnA = a.stats.find(s => s.stat.name === "defense").base_stat
                dfnB = b.stats.find(s => s.stat.name === "defense").base_stat
                return dfnB - dfnA
            })
        }
    }

    return detailedPokemons
}

async function load_pokemon() {
    const section = document.getElementById("main-pokemon-section")

    const count = document.getElementById("pokemon-count-input").value

    const search_value = document.getElementById("search").value

    const fetch_url = `https://pokeapi.co/api/v2/pokemon?limit=${count}`

    try {
        const response = await fetch(fetch_url);
        if (!response.ok) {
            section.innerHTML = "<p>Помилка загрузки покемонів</p>"
            return
        }
        const data = await response.json()

        const detailedPromises = data.results.map(pokemon => fetchPokemonDetails(pokemon.url))
        let detailedPokemons = await Promise.all(detailedPromises)

        console.log(detailedPokemons)

        await sortPokemons(detailedPokemons)

        if (search_value.trim() !== "") {
            detailedPokemons = await searchPokemons(detailedPokemons, search_value)
        }
        
        section.innerHTML = detailedPokemons.map(pokemon => `
            <div>
                <p>#${pokemon.id} • ${pokemon.name}</p>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h2>${pokemon.name}</h2>
                <div class="pokemon-stats">
                    <div class="stat-item">
                        <span class="stat-label">❤️ HP</span>
                        <span class="stat-value">${pokemon.stats.find(s => s.stat.name === "hp").base_stat}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">⚔️ Atk</span>
                        <span class="stat-value">${pokemon.stats.find(s => s.stat.name === "attack").base_stat}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">🛡️ Def</span>
                        <span class="stat-value">${pokemon.stats.find(s => s.stat.name === "defense").base_stat}</span>
                    </div>
                </div>
                <p><strong>Types:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
                <p><strong>Abilities:</strong> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
            </div>
        `).join('');

    } catch(error) {

    }
}

$(document).ready(function() {
    load_pokemon()

    $("form").on("submit", function(e) {
        e.preventDefault();
    })

    $("#apply-count, #apply-search-input").on("click", function() {
        load_pokemon()
    })

    $("#id-radio-input, #name-radio-input, #health-radio-input, #damage-radio-input, #defense-radio-input, #fstb-radio-input, #fbts-radio-input, #pokemon-count-input").change(function() {
        load_pokemon()
    })
})

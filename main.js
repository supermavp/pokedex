const POKEAPI_URL = "https://pokeapi.co/api/v2";
const pokemonList = document.getElementById("pokeSelect");

const loadPokemons = async () => {
  try {
    const response = await fetch(`${POKEAPI_URL}/pokemon`).then((response) =>
      response.json(),
    );
    response.results.forEach((pokemon) => {
      const option = document.createElement("option");
      option.textContent = pokemon.name;
      option.value = pokemon.url;
      pokemonList.appendChild(option);
    });


  } catch (error) {
    console.error("Error fetching pokemons:", error);
  }
};

loadPokemons();

const pokemonSelected = async (pokemonUrl) => {
  const pokemonImage = document.getElementById("pokeImg");
  const pokemonName = document.getElementById("pokeName");
  const placeholder = document.getElementById("screen-placeholder"); // <--- Capturamos el texto

  // Si el valor seleccionado es vacío o "", limpiamos todo
  if (!pokemonUrl || pokemonUrl === "") {
    pokemonImage.src = "";
    pokemonImage.alt = "";
    placeholder.style.display = "block"; // <--- MOSTRAMOS el aviso "ELIJA UN POKÉMON"
    
    pokemonName.textContent = "SELECCIONE...";
    
    document.getElementById("stat-hp").textContent = "-";
    document.getElementById("stat-atk").textContent = "-";
    document.getElementById("stat-def").textContent = "-";
    document.getElementById("stat-spatk").textContent = "-";
    document.getElementById("stat-spdef").textContent = "-";
    document.getElementById("stat-speed").textContent = "-";
    const typesContainer = document.getElementById("pokeTypes");
    typesContainer.innerHTML = "<span class=\"type-badge\">-</span>";
    document.getElementById("pokeAbilities").innerHTML = "<li>-</li>";
    return; 
  }

  try {
    const response = await fetch(pokemonUrl).then((response) => response.json());

    // OCULTAMOS el aviso ya que encontramos un Pokémon válido
    placeholder.style.display = "none"; 

    // El resto de tu código para cargar los datos del Pokémon...
    pokemonImage.src = response.sprites.other["official-artwork"].front_default;
    pokemonImage.alt = response.name;
    
    const formattedId = String(response.id).padStart(3, '0');
    pokemonName.textContent = `No.${formattedId} ${response.name.toUpperCase()}`;

    const statsMap = {};
    response.stats.forEach((stat) => {
      statsMap[stat.stat.name] = stat.base_stat;
    });

    document.getElementById("stat-hp").textContent = statsMap["hp"] || 0;
    document.getElementById("stat-atk").textContent = statsMap["attack"] || 0;
    document.getElementById("stat-def").textContent = statsMap["defense"] || 0;
    document.getElementById("stat-spatk").textContent = statsMap["special-attack"] || 0;
    document.getElementById("stat-spdef").textContent = statsMap["special-defense"] || 0;
    document.getElementById("stat-speed").textContent = statsMap["speed"] || 0;

    const typesContainer = document.getElementById("pokeTypes");
    typesContainer.innerHTML = "";
    response.types.forEach((typeEntry) => {
      const typeBadge = document.createElement("span");
      typeBadge.className = "type-badge";
      typeBadge.textContent = typeEntry.type.name.toUpperCase();
      typesContainer.appendChild(typeBadge);
    });

    const abilitiesList = document.getElementById("pokeAbilities");
    abilitiesList.innerHTML = "";
    response.abilities.forEach((abilityEntry) => {
      const abilityItem = document.createElement("li");
      abilityItem.textContent = abilityEntry.ability.name.replace(/-/g, " ").toUpperCase();
      abilitiesList.appendChild(abilityItem);
    });

  } catch (error) {
    console.error("Error fetching pokemon details:", error);
    placeholder.style.display = "none";
    pokemonName.textContent = "ERROR API";
  }
};

pokemonSelected("");
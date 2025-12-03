import {
    NamedAPIResource,
    Pokemon,
    PokemonClient,
    GameClient,
    PokemonSpecies,
    Type,
    NamedAPIResourceList
} from 'pokenode-ts';
import * as fs from 'fs';
import pokemons from './pokemons.json';
import types from './types.json';

const api = new PokemonClient();
const gameApi = new GameClient();

let typesDic = {}
let pokemonsDic = {}
let pokedexesDic = {}
let versionGroups = {}
let versions = {}
let games = {}

const pokemonSpritePrefix = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

////// TYPES

function GetTypeFromName(name: string): Type {
    return Object.entries(types)
        .find(pair => pair[1].name === name)![1];
}

async function GetTypes() {
    const list: NamedAPIResourceList = await api
        .listTypes(0, 100);


    for (let {name} of list.results) {
        let t: Type = await api.getTypeByName(name);
        const {moves, pokemon, sprites, move_damage_class, game_indices, ...cleanedType} = t;
        if (t.id < 100)
            typesDic[t.id] = {
                ...cleanedType,
                generation : cleanedType.generation.name.replace("generation-",""),
            };
    }

    fs.writeFile('types.json', JSON.stringify(typesDic), (error) => {
        if (error) {
            throw error;
        }
    });
    
    console.log("Updated types !");
}

////// POKEMON

async function GetPokemon(name: string) {
    let pkmn: Pokemon = await api.getPokemonByName(name);
    let species: PokemonSpecies
    try {
        species = await api.getPokemonSpeciesByName(name);
    } catch (e) {
        species = await api.getPokemonSpeciesByName(name.split("-")[0]);
    }

    let sprite = pkmn.sprites["front_default"];
    if (sprite.startsWith(pokemonSpritePrefix))
        sprite = sprite.replace(pokemonSpritePrefix, "");

    console.log(sprite);
    return {
        id: pkmn.id,
        species: species.name,
        name: species.names.find(x => x.language.name == "fr").name,
        sprite: sprite,
        types: pkmn.types.map(x => x.type.name),
        ...(pkmn.past_types.length > 0 ? {
                past_types: pkmn.past_types.map(x => ({
                    gen: x.generation.name.replace("generation-", ""),
                    types: x.types.map(y => y.type.name)
                }))
            }
            : []),
    };
}


async function GetPokemons() {
    const list: NamedAPIResourceList = await api
        .listPokemons(0, 1050);

    for (let {name} of list.results) {
        const cleanedPkmn = await GetPokemon(name);
        console.log(cleanedPkmn);
        pokemonsDic[cleanedPkmn.id] = cleanedPkmn;
    }


    fs.writeFile('pokemons.json', JSON.stringify(pokemonsDic), (error) => {
        if (error) {
            throw error;
        }
    });

    console.log("Pokemons updated !");
}


////// RELATIONS

function GetRelations(type: Type): number[] {
    let relations = new Array(Object.keys(types).length+1).fill(1);
    for (const r of type.damage_relations.double_damage_to) {
        relations[GetTypeFromName(r.name).id] = 2;
    }
    for (const r of type.damage_relations.half_damage_to) {
        relations[GetTypeFromName(r.name).id] = 0.5;
    }
    for (const r of type.damage_relations.no_damage_to) {
        relations[GetTypeFromName(r.name).id] = 0;
    }
    return relations;
}

function GetPokemonRelations(pokemon, types) {
    let relationsArray = new Array(Object.keys(types).length).fill(1);
    for (let t of Object.values(types))
        relationsArray[t.id] = relationsArray[t.id] * t.relations[GetTypeFromName(pokemon.types[0]).id]

    if (pokemon.types.length == 2) {
        for (let t of Object.values(types))
            relationsArray[t.id] = relationsArray[t.id] * t.relations[GetTypeFromName(pokemon.types[1]).id]
    }

    let relations = {
        double: [],
        half: [],
        quadruple: [],
        none: [],
        quarter: []
    }

    for (let i = 0; i < relationsArray.length; i++) {
        if (relationsArray[i] == 0)
            relations.none.push(i);
        if (relationsArray[i] == 0.25)
            relations.quarter.push(i);
        if (relationsArray[i] == 0.5)
            relations.half.push(i);
        if (relationsArray[i] == 2)
            relations.double.push(i);
        if (relationsArray[i] == 4)
            relations.quadruple.push(i);
    }
    return {
        ...(relations.none.length > 0 ? {none: relations.none} : []),
        ...(relations.quarter.length > 0 ? {quarter: relations.quarter} : []),
        ...(relations.half.length > 0 ? {half: relations.half} : []),
        ...(relations.double.length > 0 ? {double: relations.double} : []),
        ...(relations.quadruple.length > 0 ? {quadruple: relations.quadruple} : []),
    }
}

async function UpdatePokemonsRelations() {
    let relations = [];
    console.log(types);
    for (let type of Object.values(types)) {
        const r = GetRelations(type);
        relations.push(r);
        type.relations = r;
    }
    console.log(relations);

    for (const pokemon of Object.values(pokemons)) {
        pokemon.relations = GetPokemonRelations(pokemon, types);
        console.log(pokemon);
    }
    fs.writeFile('pokemons.json', JSON.stringify(pokemons), (error) => {
        if (error) {
            throw error;
        }
    });

    console.log("Pokemon relations updated");
}

////// POKEDEXES


async function GetPokedexes() {
    const list: NamedAPIResourceList = await gameApi
        .listPokedexes(0, 100);

    for (let {name} of list.results) {
        console.log(name);
        let pkdx = await gameApi.getPokedexByName(name);
        console.log(pkdx.descriptions[0]);
        //pkdx.pokemon_entries
        pokedexesDic[pkdx.id] = {
            id: pkdx.id,
            name: pkdx.name,
            names: pkdx.names,
            pokemon_entries: pkdx.pokemon_entries.map(x => ({entry: x.entry_number, species: x.pokemon_species.name})),
            region: pkdx.region?.name,
            version_groups: pkdx.version_groups.map(x => x.name),
            is_main_series: pkdx.is_main_series,
        }
    }

    fs.writeFile('pokedexes.json', JSON.stringify(pokedexesDic), (error) => {
        if (error) {
            throw error;
        }
    });

    console.log("Pokedexes updated");
}

////// VERSION GROUPS


async function GetVersionGroups() {
    const list: NamedAPIResourceList = await gameApi
        .listVersionGroups(0, 100);

    for (let {name} of list.results) {
        const group = await gameApi.getVersionGroupByName(name);
        console.log(group);

        const {move_learn_methods, regions, ...cleanedGroup} = group;
        versionGroups[group.id] = {
            ...cleanedGroup,
            generation: group.generation.name.replace("generation-", ""),
            pokedexes: group.pokedexes.map(x => x.name),
            versions: group.versions.map((x) => x.name),
        };
    }

    console.log("Version Groups updated");

}

////// VERSIONS


async function GetVersions() {
    const list: NamedAPIResourceList = await gameApi
        .listVersions(0, 100);

    for (let {name} of list.results) {
        const version = await gameApi.getVersionByName(name);
        console.log(version);
        versions[version.id] = {
            ...version,
            version_group: version.version_group.name
        };

    }

    console.log("Versions updated");
}

async function GetVersionsAndVersionsGroups() {
    await GetVersionGroups();
    await GetVersions();

    fs.writeFile('versions.json', JSON.stringify({versions: versions, versionGroups: versionGroups}), (error) => {
        if (error) {
            throw error;
        }
    });

}

//await GetTypes();

//GetPokemons();

UpdatePokemonsRelations();

//await GetPokedexes();

//await GetVersionGroups();

//await GetVersions();

//await GetVersionsAndVersionsGroups();

setInterval(() => {
}, 1_000);
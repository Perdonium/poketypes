import {NamedAPIResource, Pokemon, PokemonClient, GameClient, PokemonSpecies, Type} from 'pokenode-ts';
import * as fs from 'fs';
import pokemons from './pokemons.json';
import types from './types.json';

const api = new PokemonClient();
const gameApi = new GameClient();

let typesDic = {}
let pokemonsDic = {}
let pokedexesDic = {}

const pokemonSpritePrefix = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

async function GetType(typeName: string): Promise<Type> {
    let t: Type = await api.getTypeById(typeName);
    const {moves, pokemon, ...cleanedType} = t;
    if (t.id < 100)
        typesDic[t.id] = cleanedType;
    return t;
}

async function OnTypes(types: NamedAPIResource[]) {
    for (let type of types) {
        await GetType(type.name)
    }

    fs.writeFile('types.json', JSON.stringify(typesDic), (error) => {
        if (error) {
            throw error;
        }
    });
}

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
                    gen: x.generation.name.replace("generation-",""),
                    types: x.types.map(y => y.type.name)
                }))
            }
            : []),
    };
}

async function GetTypes() {
    await api
        .listTypes()
        .then((data) => OnTypes(data.results))
        .catch((error) => console.error(error));
}

async function OnPokemons(pokemons: NamedAPIResource[]) {
    for (let pkmn of pokemons) {
        console.log(pkmn);
        const cleanedPkmn = await GetPokemon(pkmn.name);
        console.log(cleanedPkmn);
        pokemonsDic[cleanedPkmn.id] = cleanedPkmn;
    }


    fs.writeFile('pokemons.json', JSON.stringify(pokemonsDic), (error) => {
        if (error) {
            throw error;
        }
    });

}

async function GetPokemons() {
    await api
        .listPokemons(0, 1050)
        .then((data) => OnPokemons(data.results))


}

function GetTypeFromName(name: string): Type {
    return Object.entries(types)
        .find(pair => pair[1].name === name)![1];
}

function GetRelations(type: Type): number[] {
    let relations = new Array(Object.keys(types).length).fill(1);
    for (const r of type.damage_relations.double_damage_to) {
        relations[GetTypeFromName(r.name).id] = 2;
    }
    for (const r of type.damage_relations.half_damage_to) {
        relations[GetTypeFromName(r.name).id] = 0.5;
    }
    for (const r of type.damage_relations.no_damage_to) {
        relations[GetTypeFromName(r.name).id] = 0;
    }
    relations.shift(); //ids start at 1
    relations.push(1);
    return relations;
}

function GetPokemonRelations(pokemon, types) {
    let relationsArray = new Array(Object.keys(types).length).fill(1);
    for (let t of Object.values(types))
        relationsArray[t.id - 1] = relationsArray[t.id - 1] * t.relations[GetTypeFromName(pokemon.types[0]).id - 1]

    if (pokemon.types.length == 2) {
        for (let t of Object.values(types))
            relationsArray[t.id - 1] = relationsArray[t.id - 1] * t.relations[GetTypeFromName(pokemon.types[1]).id - 1]
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
        ...(relations.none.length > 0 ? {none:relations.none}:[]),
        ...(relations.quarter.length > 0 ? {quarter:relations.quarter}:[]),
        ...(relations.half.length > 0 ? {half:relations.half}:[]),
        ...(relations.double.length > 0 ? {double:relations.double}:[]),
        ...(relations.quadruple.length > 0 ? {quadruple:relations.quadruple}:[]),
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

async function OnPokedexes(pokedexes: NamedAPIResource[]) {
    for (let pokedex of pokedexes) {
        console.log(pokedex.name);
        let pkdx = await gameApi.getPokedexByName(pokedex.name);
        console.log(pkdx.descriptions[0]);
        //pkdx.pokemon_entries
        pokedexesDic[pkdx.id] = {
            id: pkdx.id,
            name: pkdx.name,
            names: pkdx.names,
            pokemon_entries: pkdx.pokemon_entries.map(x => ({entry:x.entry_number, species:x.pokemon_species.name})),
            region: pkdx.region,
            version_groups: pkdx.version_groups,
            is_main_series: pkdx.is_main_series,
        }
    }
    fs.writeFile('pokedexes.json', JSON.stringify(pokedexesDic), (error) => {
        if (error) {
            throw error;
        }
    });
}

async function GetPokedexes() {
    await gameApi
        .listPokedexes()
        .then((data) => {
            OnPokedexes(data.results);
        })


}


//GetTypes();

//GetPokemons();

//UpdatePokemonsRelations();

GetPokedexes();

setInterval(() => {
}, 1_000);
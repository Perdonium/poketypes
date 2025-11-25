import {NamedAPIResource, Pokemon, PokemonClient, Type} from 'pokenode-ts';
import * as fs from 'fs';
import pokemons from './pokemons.json';
import types from './types.json';

const api = new PokemonClient();

let typesDic = {}
let pokemonsDic = {}

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

async function GetPokemon(name:string) {
    let pkmn: Pokemon = await api.getPokemonByName(name);
    return {
        id: pkmn.id,
        name: pkmn.name,
        sprite: pkmn.sprites["front_default"],
        types: pkmn.types,
        past_types: pkmn.past_types
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
        .listPokemons(0, 151)
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

function GetPokemonRelations(pokemon, types):number[]{
    let relationsArray = new Array(Object.keys(types).length).fill(1);
    for(let t of Object.values(types))
        relationsArray[t.id-1] = relationsArray[t.id-1] * t.relations[GetTypeFromName(pokemon.types[0].type.name).id-1]
    
    if(pokemon.types.length == 2){
        for(let t of Object.values(types))
            relationsArray[t.id-1] = relationsArray[t.id-1] * t.relations[GetTypeFromName(pokemon.types[1].type.name).id-1]
    }
    
    let relations = {
        double:[],
        half:[],
        quadruple:[],
        none:[],
        quarter:[]
    }

    for (let i = 0; i < relationsArray.length; i++) {
        if(relationsArray[i] == 0)
            relations.none.push(i);
        if(relationsArray[i] == 0.25)
            relations.quarter.push(i);
        if(relationsArray[i] == 0.5)
            relations.half.push(i);
        if(relationsArray[i] == 2)
            relations.double.push(i);
        if(relationsArray[i] == 4)
            relations.quadruple.push(i);
    }
    return relations;
}

async function UpdatePokemonsRelations(){
    let relations = [];
    console.log(types);
    for(let type of Object.values(types)){
        const r = GetRelations(type);
        relations.push(r);
        type.relations = r;
    }
    console.log(relations);
    
    for(const pokemon of Object.values(pokemons)){
        pokemon.relations = GetPokemonRelations(pokemon, types);
        console.log(pokemon);
    }
    fs.writeFile('pokemons.json', JSON.stringify(pokemons), (error) => {
        if (error) {
            throw error;
        }
    });
}
//GetTypes();

//GetPokemons();

UpdatePokemonsRelations();

setInterval(() => {
}, 1_000);
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type {Dictionary, Pokemon, Relations, Type, TypeRelations} from "@/assets/types.ts";
import types from "@/data/types.json";

const typesDic:Dictionary<Type> = Object.values(types).reduce((res, type) => {
    res[type.name] = type;
    return res;
},{});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function Capitalize(val:string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function GroupBy (xs:{}[], key:string) {
    return xs.reduce(function(rv, x) {
        // @ts-ignore
        (rv[x[key]] ??= []).push(x);
        return rv;
    }, {});
}



export function GetTypesFromNames(typeNames: string[]): Type[] {
    return typeNames.map(x => Object.entries(types)
        .find(pair => pair[1].name === x)![1]);
}

export function TypeIsRelatedTo(baseType:Type, relatedType:Type): boolean {

    for (const r of baseType.damage_relations.double_damage_from) {
        if(r == relatedType.name) 
            return true;
    }
    for (const r of baseType.damage_relations.half_damage_from) {
        if(r == relatedType.name)
            return true;
    }
    for (const r of baseType.damage_relations.no_damage_from) {
        if(r == relatedType.name)
            return true;
    }
    
    return false;
}

const generations = [
    "i","ii","iii","iv","v","vi","vii","viii","ix","x"
]

export function GetGeneration(gen:string){
    return generations.indexOf(gen)+1;
}

export function GetPokemonTypes(pokemon:Pokemon, currentGen:string):string[]{
    if(pokemon.past_types){
        for(let pastType of pokemon.past_types){
            if(GetGeneration(pastType.gen) >= GetGeneration(currentGen))
                return pastType.types;
        }
    }
    return pokemon.types;
}

export function GetTypeRelations(type:Type, currentGen:string):TypeRelations{
    if(type.past_damage_relations){
        for(let pastRelations of type.past_damage_relations){
            if(GetGeneration(pastRelations.generation) >= GetGeneration(currentGen))
                return pastRelations.damage_relations;
        }
    }
    return type.damage_relations;
}

/*
export function GetPokemonRelations(pokemon:Pokemon, currentGen:string):Relations{
    if(pokemon.past_types){
        for(let pastType of pokemon.past_types){
            if(GetGeneration(pastType.gen) >= GetGeneration(currentGen))
                return pokemon.past_relations;
        }
    }
    return pokemon.relations;
}
*/

export function GetPokemonRelations(pokemon:Pokemon, currentGen:string):Relations {
    const pokemonTypes:string[] = GetPokemonTypes(pokemon, currentGen);
    let ratios = new Array(pokemonTypes.length);
    for(let i = 0; i < Object.values(typesDic).length; i++){
        ratios[i] = 1;
    }
    for(let type of pokemonTypes){
        const relations:TypeRelations = GetTypeRelations(typesDic[type], currentGen);
        for(let relatedType of relations.half_damage_from)
        {
            ratios[typesDic[relatedType].id] *= 0.5;
        }
        for(let relatedType of relations.double_damage_from)
        {
            ratios[typesDic[relatedType].id] *= 2;
        }
        for(let relatedType of relations.no_damage_from)
        {
            ratios[typesDic[relatedType].id] *= 0;
        }
    }
    
    let relations:Relations = {};
    for(let i = 0; i < Object.values(typesDic).length; i++){
        if(ratios[i] != 1){
            if(ratios[i] === 0.5){
               if(!relations.half)
                   relations.half = [];
               relations.half.push(i)
            }

            if(ratios[i] === 0.25){
                if(!relations.quarter)
                    relations.quarter = [];
                relations.quarter.push(i)
            }
            
            if(ratios[i] === 2){
                if(!relations.double)
                    relations.double = [];
                relations.double.push(i)
            }

            if(ratios[i] === 4){
                if(!relations.quadruple)
                    relations.quadruple = [];
                relations.quadruple.push(i)
            }

            if(ratios[i] === 0){
                if(!relations.none)
                    relations.none = [];
                relations.none.push(i)
            }
        }
    }
    
    return relations;
}
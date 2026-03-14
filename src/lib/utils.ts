import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type {Pokemon, Relations, Type} from "@/assets/types.ts";
import types from "@/data/types.json";

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

    for (const r of baseType.damage_relations.double_damage_to) {
        if(r.name == relatedType.name) 
            return true;
    }
    for (const r of baseType.damage_relations.half_damage_to) {
        if(r.name == relatedType.name)
            return true;
    }
    for (const r of baseType.damage_relations.no_damage_to) {
        if(r.name == relatedType.name)
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

export function GetPokemonRelations(pokemon:Pokemon, currentGen:string):Relations{
    if(pokemon.past_types){
        for(let pastType of pokemon.past_types){
            if(GetGeneration(pastType.gen) >= GetGeneration(currentGen))
                return pokemon.past_relations;
        }
    }
    return pokemon.relations;
}
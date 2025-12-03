import type {Name, NamedAPIResource, TypeRelations, TypeRelationsPast} from "pokenode-ts";

export interface Dictionary<T> {
    [Key: string]: T;
}

export type Pokemon = {
    id: number,
    name: string,
    species: string,
    sprite: string,
    types: string[],
    past_types?: { gen: string, types: string[] }[], //Absent if no change in types
    relations: {
        none?:number[],
        quarter?:number[],
        half?:number[],
        double?:number[],
        quadruple?:number[],
    }
}

export interface Pokedex {
    id: number,
    name: string,
    names: Name[],
    pokemon_entries: { entry: number, species: string }[],
    region: NamedAPIResource,
    version_groups: NamedAPIResource[],
    is_main_series: boolean
}

export interface Version {
    id: number,
    name: string,
    names: Name[],
    version_group: string,
}

export interface VersionGroup {
    id: number,
    generation: string,
    name: string,
    order: number,
    pokedexes: string[],
    versions: string[]
}

export interface Type {
    id: number,
    name: string,
    damage_relations: TypeRelations,
    past_damage_relations: TypeRelationsPast[],
    generation: string,
    names: Name[]
}

export interface PokemonContextType {
    pokemons:Dictionary<Pokemon>,
    pokedexes:Dictionary<Pokedex>,
    versions:Dictionary<Version>,
    versionGroups:Dictionary<VersionGroup>,
    types:Dictionary<Type>

}
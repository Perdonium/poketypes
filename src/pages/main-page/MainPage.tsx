import {lazy, useEffect, useState} from "react";
import type {Name, NamedAPIResource, Type} from 'pokenode-ts';
import TypesTable from "@/components/TypesTable.tsx";
import PokemonList from "@/components/PokemonList.tsx";
import VersionSelector from "@/components/VersionSelector.tsx";

export interface Dictionary<T> {
    [Key: string]: T;
}

export interface Pokemon {
    id: number,
    name: string,
    species: string,
    sprite: string,
    types: string[],
    past_types: { gen: string, types: string[] }[]
}

export interface Pokedex {
    id: number,
    name: string,
    names: Name[],
    pokemon_entries: {entry: number, species:string}[],
    region: NamedAPIResource,
    version_groups: NamedAPIResource[],
    is_main_series: boolean
}

export interface Version {
    id: number,
    name:string,
    names:Name[],
    version_group:name,
}

export interface VersionGroup {
    id: number,
    generation:string,
    name:string,
    order:number,
    pokedexes:string[],
    versions:string[]
}

function MainPage() {
    const [types, setTypes] = useState<Dictionary<Type>>();
    const [pokemons, setPokemons] = useState<Dictionary<Pokemon>>();
    const [pokedexes, setPokedexes] = useState<Dictionary<Pokedex>>();
    const [versions, setVersions] = useState<Dictionary<Version>>();
    const [versionGroups, setVersionGroups] = useState<Dictionary<VersionGroup>>()

    function FetchData(){

        fetch("./types.json").then((response: Response) => {
            return response.json();
        }).then(data => {
            console.log("Fetched types");
            setTypes(data as { [id: string]: Type });
        });

        fetch("./pokemons.json").then((response: Response) => {
            return response.json();
        }).then(data => {
            console.log("Fetched pokemons");
            setPokemons(data as { [id: string]: Pokemon });
        });

        fetch("./pokedexes.json").then((response: Response) => {
            return response.json();
        }).then(data => {
            console.log("Fetched pokedexes");
            setPokedexes(data as { [id: string]: Pokedex });
        });
        
        fetch("./versions.json").then((response: Response) => {
            return response.json();
        }).then(data => {
            console.log("Fetched pokedexes");
            setVersions(data.versions as { [id: string]: Version });
            setVersionGroups(data.versionGroups as { [id: string]: VersionGroup });
        });
        
    }
    useEffect(() => {
        FetchData();
        //setTimeout(FetchData, 1000);
    }, []);

    return (
        <div className={"w-full"}>
            <h1 className={"mb-16 text-4xl font-bold"}>PokeTypes.fr</h1>
            <VersionSelector pokedexes={pokedexes} versions={versions} versionGroups={versionGroups}/>
            <div className={"flex flex-col md:flex-row gap-16 md:h-full"}>
                <TypesTable types={types}/>
                <PokemonList pokemons={pokemons} types={types} versions={versions} versionGroups={versionGroups}/>
            </div>
        </div>
    )
}

export default MainPage
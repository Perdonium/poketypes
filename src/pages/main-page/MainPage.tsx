import {useEffect, useState} from "react";
import type {Pokedex, Type} from 'pokenode-ts';
import TypesTable from "@/components/TypesTable.tsx";
import PokemonList from "@/components/PokemonList.tsx";
import PokedexSelector from "@/components/PokedexSelector.tsx";

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

function MainPage() {
    const [types, setTypes] = useState<Dictionary<Type>>();
    const [pokemons, setPokemons] = useState<Dictionary<Pokemon>>();
    const [pokedexes, setPokedexes] = useState<Dictionary<Pokedex>>();

    useEffect(() => {
        fetch("./types.json").then((response: Response) => {
            return response.json();
        }).then(data => {
            setTypes(data as { [id: string]: Type });
        });

        fetch("./pokemons.json").then((response: Response) => {
            return response.json();
        }).then(data => {
            setPokemons(data as { [id: string]: Pokemon });
        });

        fetch("./pokedexes.json").then((response: Response) => {
            return response.json();
        }).then(data => {
            setPokedexes(data as { [id: string]: Pokedex });
        });
    }, []);

    return (
        <div className={"w-full"}>
            <h1 className={"mb-16 text-4xl font-bold"}>PokeTypes.fr</h1>
            <PokedexSelector pokedexes={pokedexes}/>
            <div className={"flex flex-col md:flex-row gap-16 md:h-full"}>
                <TypesTable types={types}/>
                <PokemonList pokemons={pokemons} types={types}/>
            </div>
        </div>
    )
}

export default MainPage
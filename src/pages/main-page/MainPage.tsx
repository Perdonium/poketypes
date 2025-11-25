import {useEffect, useState} from "react";
import type {Type} from 'pokenode-ts';
import TypesTable from "@/components/TypesTable.tsx";
import PokemonList from "@/components/PokemonList.tsx";

export interface Dictionary<T> {
    [Key: string]: T;
}

export interface Pokemon {
    id:number,
    name:string,
    sprite:string,
    types:{slot:number, type:Type}[],
    past_types:{slot:number, type:Type}[]
}

function MainPage() {
    const [types, setTypes] = useState<Dictionary<Type>>();
    const [pokemons, setPokemons] = useState<Dictionary<Pokemon>>();

    useEffect(() => {
        fetch("./types.json").then((response: Response) => {
            return response.json();
        })
            .then(data => {
                setTypes(data as {[id:string]:Type});
            });

        fetch("./pokemons.json").then((response: Response) => {
            return response.json();
        })
            .then(data => {
                console.log(data);
                setPokemons(data as {[id:string]:Pokemon});
            });
    }, []);

    return (
        <div className={"w-full"}>
            <h1 className={"mb-16 text-4xl font-bold"}>PokeTypes.net</h1>
            <div className={"flex flex-col md:flex-row gap-16 md:h-screen"}>
                <TypesTable types={types}/>
                <PokemonList pokemons={pokemons} types={types}/>
            </div>
        </div>
    )
}

export default MainPage
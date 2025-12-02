import {useEffect, useRef, useState} from "react";
import type {Dictionary, Pokedex, Pokemon} from "@/pages/main-page/MainPage.tsx";
import PokemonCard from "@/components/PokemonCard.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useVirtualizer} from "@tanstack/react-virtual";
import {usePokedex} from "@/stores/store.tsx";

function PokemonListOld({pokemons, types}: { pokemons: Dictionary<Pokemon> }) {
    const [nameInput, setNameInput] = useState("");
    const [entryMap, setEntryMap] = useState<Record<string, number>>({});
    const pokedex: Pokedex = usePokedex((state) => state.pokedex);

    
    useEffect(() => {
        if(!pokedex) return;
        let entries:Record<string, number> = {};
        for(let entry of pokedex.pokemon_entries)
            entries[entry.species] = entry.entry;
        setEntryMap(entries);
    }, [pokedex]);

    const filtered = pokemons && pokedex
        ? Object.values(pokemons)
            .filter(pkmn =>
                entryMap[pkmn.species] !== undefined &&
                pkmn.name.toLowerCase().includes(nameInput.toLowerCase())
            )
            .sort((a, b) => entryMap[a.species] - entryMap[b.species])
        : [];

    const parentRef = useRef(null)
    
    const rowVirtualizer = useVirtualizer({
        count: filtered.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 230,
    })
    
    return (
        <div className={"h-96 w-90 md:h-[80vh]"}>
            <Input type={"text"}
                   placeholder={"Nom"}
                   value={nameInput}
                   onChange={e => setNameInput(e.target.value)}/>
            <ScrollArea className="rounded-md h-full border overflow-hidden">
                {pokemons && pokedex
                    && Object.values(pokemons)
                        .filter(pkmn =>
                            Object.keys(entryMap).includes(pkmn.species)
                            && pkmn.name.toLowerCase().includes(nameInput.toLowerCase()))
                        .sort((a,b) => entryMap[a.species] - entryMap[b.species])
                        .map((pokemon: Pokemon) => {
                            return <PokemonCard pokemon={pokemon} entry={entryMap[pokemon.species]} types={types} key={pokemon.id}/>;
                        })
                    //TODO : Optimize this
                }

            </ScrollArea>
          
        </div>
    )
}

export default PokemonListOld
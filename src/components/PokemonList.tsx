import {useEffect, useRef, useState} from "react";
import type {Dictionary, Pokedex, Pokemon, VersionGroup, Version} from "@/pages/main-page/MainPage.tsx";
import PokemonCard from "@/components/PokemonCard.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useVirtualizer} from "@tanstack/react-virtual";
import {usePokedex} from "@/stores/store.tsx";

function PokemonList({pokemons, types}: { pokemons: Dictionary<Pokemon>}) {
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
        estimateSize: () => 250,
    })
    
    return (
        <div className={"h-[40vh] w-90 md:h-[80vh] mx-auto"}>
            <Input type={"text"}
                   placeholder={"Nom"}
                   value={nameInput}
                   onChange={e => setNameInput(e.target.value)}/>
            {/* The scrollable element for your list */}
            <div
                ref={parentRef}
                className={"overflow-auto h-full border"}
            >
                {/* The large inner element to hold all of the items */}
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                    }}
                    
                    className={"relative"}
                >
                    {/* Only the visible items in the virtualizer, manually positioned to be in view */}
                    {filtered.length > 0 && rowVirtualizer.getVirtualItems().map((virtualItem) => (
                        <div
                            key={virtualItem.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualItem.size}px`,
                                transform: `translateY(${virtualItem.start}px)`,
                            }}
                        >
                            <PokemonCard
                                pokemon={filtered[virtualItem.index]}
                                entry={entryMap[filtered[virtualItem.index].species]}
                                types={types}
                            />
                        </div>
                    ))}
                </div>
            </div>
          
        </div>
    )
}

export default PokemonList
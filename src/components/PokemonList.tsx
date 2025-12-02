import {useEffect, useRef, useState} from "react";
import type {Dictionary, Pokedex, Pokemon} from "@/pages/main-page/MainPage.tsx";
import PokemonCard from "@/components/PokemonCard.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useVirtualizer} from "@tanstack/react-virtual";
import {usePokedex} from "@/stores/store.tsx";

function PokemonList({pokemons, types}: { pokemons: Dictionary<Pokemon> }) {
    const [nameInput, setNameInput] = useState("");
    const [entryMap, setEntryMap] = useState<Record<string, number>>({});
    const pokedex: Pokedex = usePokedex((state) => state.pokedex);

    const scrollRef = useRef<HTMLDivElement>(null);
    
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

    const rowVirtualizer = useVirtualizer({
        count: filtered.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 230, // hauteur approximative d’une carte
        overscan: 10
    });
    
    return (
        <div className={"h-96 w-90 md:h-[80vh]"}>
            <Input type={"text"}
                   placeholder={"Nom"}
                   value={nameInput}
                   onChange={e => setNameInput(e.target.value)}/>
            <ScrollArea className="rounded-md h-full border overflow-hidden">
                {/* Le vrai viewport du ScrollArea */}
                <div ref={scrollRef} className="h-full w-full">
                    <div
                        style={{
                            height: rowVirtualizer.getTotalSize(),
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const pokemon = filtered[virtualRow.index];
                            return (
                                <div
                                    key={pokemon.id}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        transform: `translateY(${virtualRow.start}px)`
                                    }}
                                >
                                    <PokemonCard
                                        pokemon={pokemon}
                                        entry={entryMap[pokemon.species]}
                                        types={types}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

export default PokemonList
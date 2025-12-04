import {useContext, useEffect, useRef, useState} from "react";
import {PokemonContext} from "@/pages/main-page/MainPage.tsx";
import PokemonCard from "@/components/PokemonCard.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useVirtualizer} from "@tanstack/react-virtual";
import {usePokedex} from "@/stores/store.tsx";
import type {Pokedex, Pokemon, VersionGroup} from "@/assets/types.ts";

const nationalPerGen = [
    151,
    251,
    386,
    493,
    649,
    721,
    809,
    905,
    1025
]

const generations = [
    "i","ii","iii","iv","v","vi","vii","viii","ix","x"
]
function PokemonList() {
    const {pokemons, pokedexes} = useContext(PokemonContext);
    const [nameInput, setNameInput] = useState("");
    const [entryMap, setEntryMap] = useState<Record<string, number>>({});
    const national: boolean = usePokedex((state) => state.national);
    const versionGroup: VersionGroup | undefined = usePokedex((state) => state.versionGroup);

    const scrollParentRef = useRef(null)

    useEffect(() => {
        if (!versionGroup) return;
        let entries: Record<string, number> = {};
        const pokedex = Object.values(pokedexes).find(p => p.name === versionGroup.pokedexes[0])!
        let pokedexEntries = pokedex.pokemon_entries;
        if(national){
            const gen = generations.indexOf(versionGroup.generation);
            pokedexEntries = Object.values(pokedexes).find(p => p.name === "national")!.pokemon_entries.slice(0,nationalPerGen[gen]);
        }
        for (let entry of pokedexEntries)
            entries[entry.species] = entry.entry;
        setEntryMap(entries);
        // @ts-ignore
        scrollParentRef.current!.scrollTop = 0;
        
    }, [versionGroup, national]);

    const filtered:Pokemon[] = pokemons && versionGroup
        ? Object.values(pokemons)
            .filter(pkmn =>
                entryMap[pkmn.species] !== undefined &&
                pkmn.name.toLowerCase().includes(nameInput.toLowerCase())
            )
            .sort((a, b) => entryMap[a.species] - entryMap[b.species])
        : [];


    const rowVirtualizer = useVirtualizer({
        count: filtered.length,
        getScrollElement: () => scrollParentRef.current,
        estimateSize: () => 250,
    })

    return (
        <div className={"w-90 mx-auto mb-8"}>

            <Input type={"text"}
                   placeholder={"Nom"}
                   value={nameInput}
                   onChange={e => setNameInput(e.target.value)}/>
        <div className={"h-[90vh] md:h-[80vh] mt-4"}>
            <div
                ref={scrollParentRef}
                className={"overflow-auto h-full border"}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                    }}

                    className={"relative"}
                >
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
                            />
                        </div>
                    ))}
                </div>
            </div>

        </div>
        </div>
            
    )
}

export default PokemonList
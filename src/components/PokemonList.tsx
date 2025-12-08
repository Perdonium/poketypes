import {useContext, useEffect, useRef, useState} from "react";
import {PokemonContext} from "@/pages/MainPage.tsx";
import PokemonCard from "@/components/PokemonCard.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useVirtualizer} from "@tanstack/react-virtual";
import {usePokedex} from "@/stores/store.tsx";
import type {Pokemon, VersionGroup} from "@/assets/types.ts";

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

    const scrollParentRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

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

    function OnInputClick(){
        const windowHeight = window.innerHeight;
        const yPos = inputRef.current!.getBoundingClientRect().y;
        const scrollPercentage = (yPos / (windowHeight)) * 100;
        if(scrollPercentage > 50) {
            //Need to add a delay because on mobile the keyboard opening stops any scrolling
            setTimeout(() => {
                inputRef.current!.scrollIntoView({behavior: "smooth", block: "start"});
            }, 300);
        }
    }


    return (
        <div className={"max-w-90 w-90 mb-8 mx-auto lg:mx-0 scroll-smooth"} id={"pokemon-list"}>

            <Input type={"text"}
                   placeholder={"Nom"}
                   value={nameInput}
                   onChange={e => setNameInput(e.target.value)}
                    onClick={(_) => OnInputClick()}
                    ref={inputRef}
                />
        <div className={"h-[90vh] md:h-[80vh] mt-4"}>
            <div
                ref={scrollParentRef}
                id={"scrollParent"}
                className={"overflow-auto h-full border"}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                    }}
                    id={"listParent"}
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
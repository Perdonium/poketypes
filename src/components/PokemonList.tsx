import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {PokemonContext} from "@/pages/MainPage.tsx";
import PokemonCard from "@/components/PokemonCard.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useVirtualizer} from "@tanstack/react-virtual";
import {usePokedex} from "@/stores/store.tsx";
import type {Pokemon, VersionGroup} from "@/assets/types.ts";
import DetailledPokemonCard from "@/components/DetailledPokemonCard.tsx";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog.tsx";
import {cn, GetGeneration} from "@/lib/utils.ts";

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

function PokemonList() {
    const {pokemons, pokedexes} = useContext(PokemonContext);
    const [nameInput, setNameInput] = useState("");
    const [dialogPokemon, setDialogPokemon] = useState<Pokemon | undefined>(undefined);
    const lanes = useResponsiveLanes();
    const [entryMap, setEntryMap] = useState<Record<string, number>>({});
    const national: boolean = usePokedex((state) => state.national);
    const lang: string = usePokedex((state) => state.lang);
    const versionGroup: VersionGroup | undefined = usePokedex((state) => state.versionGroup);
    const setHighlightedPokemon  = usePokedex((state) => state.setHighlightedPokemon);

    const scrollParentRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    
    const width = lanes * 70;
    useEffect(() => {
        if (!versionGroup) return;
        let entries: Record<string, number> = {};
        const pokedex = Object.values(pokedexes).find(p => p.name === versionGroup.pokedexes[0])!
        let pokedexEntries = pokedex.pokemon_entries;
        if(national){
            const gen = GetGeneration(versionGroup.generation);
            pokedexEntries = Object.values(pokedexes).find(p => p.name === "national")!.pokemon_entries.slice(0,nationalPerGen[gen]);
        }
        for (let entry of pokedexEntries)
            entries[entry.species] = entry.entry;
        setEntryMap(entries);
        scrollParentRef.current!.scrollTop = 0;
        
    }, [versionGroup, national]);

    const filtered: Pokemon[] = useMemo(() => {
        if (!pokemons || !versionGroup) return [];
        return Object.values(pokemons)
            .filter(pkmn => entryMap[pkmn.species] !== undefined &&
                pkmn.name.toLowerCase().includes(nameInput.toLowerCase()))
            .sort((a, b) => entryMap[a.species] - entryMap[b.species]);
    }, [pokemons, versionGroup, entryMap, nameInput]);
    
    

    const paddedCount = Math.ceil(filtered.length / lanes) * lanes;
    const rowVirtualizer = useVirtualizer({
        get count() {
            return paddedCount;
        },
        getScrollElement: () => scrollParentRef.current,
        estimateSize: () => 250,
        lanes:lanes,
        
    })
    
    useEffect(() => {
        rowVirtualizer.measure();
    }, [lanes, paddedCount]);


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

    const [dialogOpen, setDialogOpen] = useState(false)
    function onDialogOpenChange(open:boolean){
        setDialogOpen(open)
    }
    
    function onPokemonClick(pokemon:Pokemon){
            setDialogPokemon(pokemon);
            setDialogOpen(true)
    }
    
    function onHoverStart(pokemon:Pokemon){
        setHighlightedPokemon(pokemon);
    }

    function onHoverEnd(pokemon:Pokemon){
        setHighlightedPokemon(undefined);
    }
    
    return (
        <div className={"w-auto mb-8 mx-auto lg:-mt-14 lg:mx-0 scroll-smooth"} id={"pokemon-list"}>

            {<Dialog open={dialogOpen} onOpenChange={onDialogOpenChange} >
                <DialogContent className={cn("p-0 border-0",
                "data-[state=open]:animate-in \n" +
                    "data-[state=closed]:animate-out " +
                    "data-[state=closed]:-spin-out-15 \n" +
                    "data-[state=closed]:slide-out-to-left-1/2 \n" +
                    "data-[state=open]:spin-in-15 \n" +
                    "data-[state=open]:slide-in-from-right-1/2 \n")}>

                    { <DetailledPokemonCard pokemon={dialogPokemon!} entry={1} lang={lang}/>}
                </DialogContent>
            </Dialog>}
            
            <span className={"font-bold mr-4"}>Rechercher </span>
            <Input type={"text"}
                   placeholder={"Nom"}
                   className={"w-auto"}
                   value={nameInput}
                   onChange={e => setNameInput(e.target.value)}
                    onClick={(_) => OnInputClick()}
                    ref={inputRef}
                />
        <div className={"h-[90vh] md:h-[80vh] mt-4 bg-black/10"} style={{width:`${width/3}rem`}}>
            <div
                ref={scrollParentRef}
                id={"scrollParent"}
                className={"scrollbar overflow-y-auto overflow-x-hidden h-full" +
                    " border border-t-2 border-white/10 border-t-white/30 px-2 rounded-lg"}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                    }}
                    id={"listParent"}
                    className={"relative flex"}
                >
                    {rowVirtualizer.getVirtualItems().map(virtualItem => {
                        const item = filtered[virtualItem.index];
                        if (!item) return null; // fantôme pour compléter la dernière ligne

                        const containerWidth = scrollParentRef.current?.clientWidth || 0;
                        const laneWidth = containerWidth / lanes;

                        return (
                            <div
                                key={virtualItem.key}
                                style={{
                                    position: "absolute",
                                    width: `${100 / lanes}%`,
                                    height: `${virtualItem.size}px`,
                                    transform: `translateX(${virtualItem.lane * laneWidth}px) translateY(${virtualItem.start}px)`,
                                }}
                            >
                                <PokemonCard
                                    pokemon={item}
                                    entry={entryMap[item.species]}
                                    onClick={onPokemonClick}
                                    lang={lang}
                                    onHoverStart={onHoverStart}
                                    onHoverEnd={onHoverEnd}
                                    generation={versionGroup!.generation}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
        </div>
            
    )
}

function useResponsiveLanes() {
    const [lanes, setLanes] = useState(3); // valeur par défaut

    useEffect(() => {
        function updateLanes() {
            const width = window.innerWidth;

            if (width < 1500) setLanes(1);      // mobile
            else if (width < 2000) setLanes(2); // tablette
            else setLanes(3);                  // desktop
        }

        updateLanes(); // set initial value
        window.addEventListener("resize", updateLanes);

        return () => window.removeEventListener("resize", updateLanes);
    }, []);

    return lanes;
}
    
export default PokemonList
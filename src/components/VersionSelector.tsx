import {useEffect, useRef, useState} from "react";
import type {Dictionary, Pokedex, Pokemon, Version, VersionGroup} from "@/pages/main-page/MainPage.tsx";
import {usePokedex} from "@/stores/store.tsx";
import {cn} from "@/lib/utils.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button.tsx";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";

function VersionSelector({pokedexes, versions, versionGroups}:{pokedexes:Dictionary<Pokedex>, versions:Dictionary<Version>, versionGroups:Dictionary<VersionGroup>}) {

    const pokedex = usePokedex((state) => state.pokedex);
    const setPokedex = usePokedex((state) => state.setPokedex);


    const [open, setOpen] = useState(false)
    const [groupId, setGroupId] = useState(-1)
    
    const groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] ??= []).push(x);
            return rv;
        }, {});
    };
    function OnSelect(newValue:number){
        console.log(newValue);
        setOpen(false)
        if(newValue === groupId)
            return;
        setGroupId(newValue)
        setPokedex(Object.values(pokedexes).find(p => p.name === versionGroups[newValue].pokedexes[0]));
    }

    useEffect(() => {
        console.log(pokedexes);
        if(pokedexes && groupId === -1)
            OnSelect(1);
    }, [pokedexes]);
    
    const groupsByVersions = versionGroups?groupBy(Object.values(versionGroups),"generation"):{};
    console.log(groupsByVersions);
    return (
        <div className={"w-full my-4"}>
            {versionGroups && <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        {groupId
                            ? Object.values(versionGroups).find((pokedex) => pokedex.id === groupId)?.name
                            : "Select framework..."}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search framework..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            {
                                Object.keys(groupsByVersions).map((version:string) => (
                                    <CommandGroup heading={"Generation "+version.toUpperCase()}>
                                        {groupsByVersions[version].map((pokedex) => (
                                            <CommandItem
                                                key={pokedex.id}
                                                value={pokedex.name}
                                                onSelect={(currentValue) => {
                                                    OnSelect(pokedex.id);
                                                }}
                                            >
                                                {pokedex.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        groupId === pokedex.name ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ))
                            }
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>}
        </div>
    )
}

export default VersionSelector
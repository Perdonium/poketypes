import {useContext, useEffect,useState} from "react";
import {usePokedex} from "@/stores/store.tsx";
import {cn, GroupBy} from "@/lib/utils.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button.tsx";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandGroup, CommandItem} from "@/components/ui/command.tsx";
import {PokemonContext} from "@/pages/main-page/MainPage.tsx";
import type {Dictionary, VersionGroup} from "@/assets/types.ts";

function VersionSelector() {

    const {pokedexes, versionGroups} = useContext(PokemonContext);
    
    const pokedex = usePokedex((state) => state.pokedex);
    const setPokedex = usePokedex((state) => state.setPokedex);


    const [open, setOpen] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState(-1)
    

    function OnSelect(newValue:number){
        console.log(newValue);
        setOpen(false)
        if(newValue === selectedGroupId)
            return;
        setSelectedGroupId(newValue)
        setPokedex(Object.values(pokedexes).find(p => p.name === versionGroups[newValue].pokedexes[0]));
    }

    useEffect(() => {
        console.log(pokedexes);
        if(pokedexes && selectedGroupId === -1)
            OnSelect(1);
    }, [pokedexes]);
    
    const groupsByVersions:Dictionary<VersionGroup[]> = versionGroups?GroupBy(Object.values(versionGroups),"generation"):{};
    
    return (
        <div className={"w-full my-4"}>
            {versionGroups && <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[300px] justify-between"
                    >
                        {selectedGroupId
                            ? Object.values(versionGroups).find((pokedex) => pokedex.id === selectedGroupId)?.name
                            : "Select framework..."}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command className={"w-max -translate-x-1/4"}>
                        <div className={"grid grid-cols-2"}>
                            {
                                Object.keys(groupsByVersions).map((version:string) => (
                                    <CommandGroup className={"col-span-1"} heading={"Generation "+version.toUpperCase()}>
                                        {groupsByVersions[version].map((versionGroup) => (
                                            <CommandItem
                                                key={versionGroup.id}
                                                value={versionGroup.name}
                                                onSelect={(_) => {
                                                    OnSelect(versionGroup.id);
                                                }}
                                            >
                                                {versionGroup.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        selectedGroupId === versionGroup.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ))
                            }
                        </div>
                    </Command>
                </PopoverContent>
            </Popover>}
        </div>
    )
}

export default VersionSelector
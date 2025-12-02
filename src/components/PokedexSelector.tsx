import {useEffect, useRef, useState} from "react";
import type {Dictionary, Pokemon} from "@/pages/main-page/MainPage.tsx";
import {usePokedex} from "@/stores/store.tsx";
import type {Pokedex} from "pokenode-ts";
import {cn} from "@/lib/utils.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button.tsx";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";

function PokedexSelector({pokedexes}:{pokedexes:Dictionary<Pokedex>}) {

    const pokedex = usePokedex((state) => state.pokedex);
    const setPokedex = usePokedex((state) => state.setPokedex);


    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    
    function OnSelect(newValue:string){
        setOpen(false)
        if(newValue === value)
            return;
        setValue(newValue)
        setPokedex(Object.values(pokedexes).find(p => p.name === newValue));
    }

    useEffect(() => {
        console.log(pokedexes);
        if(pokedexes && value === "")
            OnSelect(pokedexes[1].name);
    }, [pokedexes]);
    
    return (
        <div className={"w-full my-4"}>
            {pokedexes && <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        {value
                            ? Object.values(pokedexes).find((pokedex) => pokedex.name === value)?.name
                            : "Select framework..."}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search framework..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                                {Object.values(pokedexes).map((pokedex) => (
                                    <CommandItem
                                        key={pokedex.id}
                                        value={pokedex.name}
                                        onSelect={(currentValue) => {
                                            OnSelect(currentValue);
                                        }}
                                    >
                                        {pokedex.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === pokedex.name ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>}
        </div>
    )
}

export default PokedexSelector
import {useContext, useEffect, useState} from "react";
import {usePokedex} from "@/stores/store.tsx";
import {GroupBy} from "@/lib/utils.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button.tsx";
import {ChevronsUpDown} from "lucide-react";
import {Command, CommandGroup, CommandItem} from "@/components/ui/command.tsx";
import {PokemonContext} from "@/pages/main-page/MainPage.tsx";
import type {Dictionary, VersionGroup} from "@/assets/types.ts";
import {Switch} from "@/components/ui/switch.tsx";
import {Label} from "@/components/ui/label.tsx";
import GameLogo from "@/components/GameLogo.tsx";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer.tsx";
import {useMediaQuery} from "usehooks-ts";

function VersionSelector() {

    const {pokedexes, versionGroups} = useContext(PokemonContext);

    const setVersionGroup = usePokedex((state) => state.setVersionGroup);
    const setNational = usePokedex((state) => state.setNational);


    const [open, setOpen] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState(-1)
    const isDesktop = useMediaQuery("(min-width: 768px)")


    function SetNational(national: boolean) {
        setNational(national)
    }


    function OnSelect(newValue: number) {
        setOpen(false)
        if (newValue === selectedGroupId)
            return;
        setSelectedGroupId(newValue)
        setVersionGroup(versionGroups[newValue]);
    }

    useEffect(() => {
        if (pokedexes && selectedGroupId === -1)
            OnSelect(1);
    }, [pokedexes]);

    const groupsByVersions: Dictionary<VersionGroup[]> = versionGroups ? GroupBy(Object.values(versionGroups), "generation") : {};

    return (
        <div className={"w-full my-4 flex justify-center md:grid md:grid-cols-2 space-x-4 h-[120px]"}>
            {versionGroups && isDesktop &&
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={open}
                            className="w-fit h-fit my-auto md:ml-auto"
                        >
                            {Object.values(versionGroups).find((pokedex) => pokedex.id === selectedGroupId)?.versions
                                .map(x => (
                                    <GameLogo name={x} additionalClass={""}/>
                                ))}
                            <ChevronsUpDown className="opacity-50"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <Command className={"w-max md:-translate-x-1/3 overflow-auto"}>
                            <div className={"grid grid-cols-2 md:grid-cols-3"}>
                                {
                                    Object.keys(groupsByVersions).reverse().map((version: string) => (
                                        <CommandGroup className={"col-span-1"}
                                                      heading={"Generation " + version.toUpperCase()}>
                                            {groupsByVersions[version].map((versionGroup) => (
                                                <CommandItem
                                                    className={""}
                                                    key={versionGroup.id}
                                                    value={versionGroup.name}
                                                    onSelect={(_) => {
                                                        OnSelect(versionGroup.id);
                                                    }}
                                                >
                                                    {versionGroup.versions.map(x => (
                                                        <GameLogo name={x} additionalClass={"mx-auto"}/>
                                                    ))}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    ))
                                }
                            </div>
                        </Command>
                    </PopoverContent>
                </Popover>
            }
            {versionGroups && !isDesktop &&
                <Drawer open={open} onOpenChange={setOpen} direction={"right"}>
                    <DrawerTrigger asChild>
                        <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={open}
                            className="w-fit h-fit my-auto md:ml-auto"
                        >
                            {Object.values(versionGroups).find((pokedex) => pokedex.id === selectedGroupId)?.versions
                                .map(x => (
                                    <GameLogo name={x} additionalClass={""}/>
                                ))}
                            <ChevronsUpDown className="opacity-50"/>
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="p-0 !w-fit">
                        <Command className={"overflow-auto bg-transparent"}>
                            <div className={"grid grid-cols-2 md:grid-cols-3"}>
                                {
                                    Object.keys(groupsByVersions).reverse().map((version: string) => (
                                        <CommandGroup className={"col-span-1"}
                                                      heading={"Generation " + version.toUpperCase()}>
                                            {groupsByVersions[version].map((versionGroup) => (
                                                <CommandItem
                                                    className={" bg-transparent"}
                                                    key={versionGroup.id}
                                                    value={versionGroup.name}
                                                    onSelect={(_) => {
                                                        OnSelect(versionGroup.id);
                                                    }}
                                                >
                                                    {versionGroup.versions.map(x => (
                                                        <GameLogo name={x} additionalClass={"mx-auto"}/>
                                                    ))}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    ))
                                }
                            </div>
                        </Command>
                    </DrawerContent>
                </Drawer>
            }
            <div className="flex items-center space-x-2">
                <Switch id="national-mode"
                        onCheckedChange={SetNational}
                />
                <Label htmlFor="national-mode">National</Label>
            </div>
        </div>
    )
}

export default VersionSelector
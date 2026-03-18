import {useContext, useEffect, useState} from "react";
import {usePokedex} from "@/stores/store.tsx";
import {GroupBy} from "@/lib/utils.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button.tsx";
import {ChevronsUpDown} from "lucide-react";
import {Command, CommandGroup, CommandItem} from "@/components/ui/command.tsx";
import {PokemonContext} from "@/pages/MainPage.tsx";
import type {Dictionary, VersionGroup} from "@/assets/types.ts";
import {Switch} from "@/components/ui/switch.tsx";
import {Label} from "@/components/ui/label.tsx";
import GameLogo from "@/components/GameLogo.tsx";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer.tsx";
import {useMediaQuery} from "usehooks-ts";

const generationTranslated = [
    {lang:"fr",
    text:"Génération"},
    {lang:"en",
        text:"Generation"},
    {lang:"de",
        text:"Generation"},
    {lang:"es",
        text:"Generación"},
]

const chooseVersionTranslated = [
    {lang:"fr",
        text:"Choisis ta version"},
    {lang:"en",
        text:"Choose your version"},
    {lang:"de",
        text:"Elige tu versión"},
    {lang:"es",
        text:"Wählen Sie Ihre Version"},

]
function VersionSelector() {

    const {pokedexes, versions, versionGroups} = useContext(PokemonContext);

    const setVersionGroup = usePokedex((state) => state.setVersionGroup);
    const setNational = usePokedex((state) => state.setNational);
    const national = usePokedex((state) => state.national);
    const versionGroup = usePokedex((state) => state.versionGroup);
    const lang = usePokedex((state) => state.lang);

    const [open, setOpen] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState(-1)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    function SetNational(national: boolean) {
        setNational(national)
    }

    console.log(lang);
    function OnSelect(newValue: number) {
        setOpen(false)
        if (newValue === selectedGroupId)
            return;
        setSelectedGroupId(newValue)
        setVersionGroup(versionGroups[newValue]);
    }

    function GetVersionTranslatedName(versionName: string)
    {
        let versionLang =  Object.values(versions).find(v => v.name === versionName)!.names.find(n => n.language.name == lang);
        if(!versionLang)
            return Object.values(versions).find(v => v.name === versionName)!.names.find(n => n.language.name == "en")!.name;
        return versionLang.name;
    }
    
    useEffect(() => {
        if (pokedexes && selectedGroupId === -1 && versionGroup == undefined)
            OnSelect(1);
    }, [pokedexes]);


    useEffect(() => {
        if (pokedexes && selectedGroupId === -1 && versionGroup == undefined)
            OnSelect(1);
        else if(versionGroup != undefined)
            setSelectedGroupId(versionGroup!.id);
    }, []);

    const groupsByVersions: Dictionary<VersionGroup[]> = versionGroups ? GroupBy(Object.values(versionGroups), "generation") : {};

    return (
        <div className={"w-120 h-40 lg:mb-4 flex flex-col justify-center space-x-4"}>
            <h1 className={"text-xl font-mono mb-4"}>{chooseVersionTranslated.find(x => x.lang == lang)?.text}</h1>
            <div className={"flex flex-col lg:flex-row justify-center items-center space-x-4"}>
            {versionGroups && isDesktop &&
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={open}
                            className="w-fit h-fit my-auto border border-input rounded-2xl bg-input/30 hover:bg-input/50"
                        >
                            {Object.values(versionGroups).find((pokedex) => pokedex.id === selectedGroupId)?.versions
                                .map(x => (
                                    <GameLogo name={x} additionalClass={""}/>
                                ))}
                            <ChevronsUpDown className="opacity-50"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 scale-60 xl:scale-80 2xl:scale-90">
                        <Command className={"w-max md:-translate-x-1/3 overflow-auto"}>
                            <div className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5"}>
                                {
                                    Object.keys(groupsByVersions).reverse().map((version: string) => (
                                        <CommandGroup className={"col-span-1 border-r border-b"}
                                                      heading={generationTranslated.find(x => x.lang == lang)?.text + " "+version.toUpperCase()}>
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
                                                        <div className={"flex flex-col"}>
                                                        <GameLogo name={x} additionalClass={"mx-auto "}/>
                                                            <h1 className={"text-center"}>{GetVersionTranslatedName(x)}</h1>
                                                        </div>
                                                        
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
                                                        <div className={"flex flex-col"}>
                                                            <GameLogo name={x} additionalClass={"mx-auto"}/>
                                                            <h1 className={"text-center"}>{GetVersionTranslatedName(x)}</h1>
                                                        </div>
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
            <div className="flex items-center space-x-2 border border-input h-fit rounded-2xl bg-input/30 hover:bg-input/50 px-4 py-2">
                <Switch id="national-mode"
                        onCheckedChange={SetNational}
                        checked={national}
                />
                <Label htmlFor="national-mode">National</Label>
            </div>
            </div>
        </div>
    )
}

export default VersionSelector
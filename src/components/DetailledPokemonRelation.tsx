import TypeIcon from "@/components/TypeIcon.tsx";
import {
    cn,
    GetPokemonRelations,
    GetRelationBackgroundColor,
    GetTypeFromName,
    GetTypeRelations,
    GetTypesFromNames
} from "@/lib/utils.ts";
import {Separator} from "@/components/ui/separator.tsx";
import type {Pokemon, Type} from "@/assets/types.ts";
import {useContext} from "react";
import {PokemonContext} from "@/pages/MainPage.tsx";
import {usePokedex} from "@/stores/store.tsx";

function DetailledPokemonRelation({pokemon, typeList, title, orientation = "vertical", useClick = true}: {
    pokemon: Pokemon,
    typeList: string[],
    title: string,
    orientation?: "horizontal" | "vertical",
    useClick?: boolean
}) {
    const {types, tips} = useContext(PokemonContext);

    const versionGroup = usePokedex((state) => state.versionGroup);
    
    function FindTip(attacking: Type, defending: Type) {
        const tip = tips.find(tip => (tip.attacking === attacking.name && tip.defending === defending.name)
            || (tip.attacking === defending.name && tip.defending === attacking.name && tip.mutual));

        return tip ? tip : undefined;
    }

    function GetRelations(type: Type): number[] {
        let relations = new Array(Object.keys(types).length).fill(1);
        const typeRelations = GetTypeRelations(type, versionGroup!.generation);
        for (const r of typeRelations.double_damage_to) {
            relations[GetTypeFromName(r).id] = 2;
        }
        for (const r of typeRelations.half_damage_to) {
            relations[GetTypeFromName(r).id] = 0.5;
        }
        for (const r of typeRelations.no_damage_to) {
            relations[GetTypeFromName(r).id] = 0;
        }
        relations.shift(); //ids start at 1
        relations.push(1);
        return relations;
    }
    

    return (
        <>
            <Separator className={cn("separator bg-white/40", orientation == "vertical" && "!h-auto")}
                       orientation={orientation}/>
            <div className={"flex my-4 items-center ml-2"}>

                <div className={cn("md:text-lg font-bold w-1/5 xl:w-1/8 text-center")}>
                    <h1 className={cn("w-fit mx-auto rounded-2xl px-3",
                        GetRelationBackgroundColor(Number.parseFloat(title)))}>
                        x{title}
                    </h1>
                </div>
                <div className={cn("grid gap-4 my-2 pr-4 w-4/5 xl:w-7/8")}>
                    {
                        GetTypesFromNames(typeList).map((s) => {
                            return <div className={"grid grid-cols-4"}>
                                <div className={"flex mx-auto items-center align-middle"}>
                                    <TypeIcon key={s.id}
                                              type={s}
                                              additionalClass={"w-7 xl:w-10"}
                                              useClick={useClick}
                                              showName={true}/>
                                </div>
                                <div className={"relative col-span-3 my-auto"}>
                                    {pokemon.types.map(pokemonTypeName => {
                                        const pokemonType = GetTypeFromName(pokemonTypeName);
                                        const tip = FindTip(s, pokemonType);
                                        if (GetRelations(s)[pokemonType.id-1] != 1 && tip) {
                                            return (
                                                <div className={"flex space-x-4 items-center align-middle w-full h-8 last:border-t first:border-t-0!"}>
                                                    <div className={"flex space-x-2 w-1/5"}>
                                                        <h1 className={"w-fit my-auto"}>→</h1>
                                                        <TypeIcon key={s.id}
                                                                  type={pokemonType}
                                                                  additionalClass={"w-5 xl:w-7"}
                                                                  useClick={useClick}/>
                                                    </div>
                                                    <h1 className={"w-4/5 text-xs xs:text-md my-auto"}>{tip.tip}</h1>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default DetailledPokemonRelation
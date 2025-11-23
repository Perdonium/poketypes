import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import type {Dictionary} from "@/pages/main-page/MainPage.tsx";
import type {Type} from "pokenode-ts";
import {cn} from "@/lib/utils.ts";
import {useState} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import { motion } from "motion/react"
import {Button} from "@/components/ui/button.tsx";

function TypesTable({types}: { types: Dictionary<Type> }) {

    const hoverBg = "bg-gray-400";
    const noDamageBg = "bg-gray-800";
    const halfDamageBg = "bg-red-800";
    const doubleDamageBg = "bg-green-800";

    const [hoverAttackingType, setHoverAttackingType] = useState<Type>();
    const [hoverDefendingType, setHoverDefendingType] = useState<Type>();
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [currentTip, setCurrentTip] = useState("");

    function GetTypeFromName(name: string): Type {
        return Object.entries(types)
            .find(pair => pair[1].name === name)![1];
    }

    function GetSprite(type: Type): string {
        /*
        console.log(type);
        const spritesKeys = Object.keys(type.sprites);
        const games = type.sprites[spritesKeys[Object.keys(spritesKeys).length-1]];
        const gamesKeys = Object.keys(games);
        return games[gamesKeys[Object.keys(gamesKeys).length-1]].name_icon;
        
         */
        return type.sprites["generation-ix"]["scarlet-violet"].name_icon;
    }

    function GetRelations(type: Type): number[] {
        let relations = new Array(Object.keys(types).length).fill(1);
        for (const r of type.damage_relations.double_damage_to) {
            relations[GetTypeFromName(r.name).id] = 2;
        }
        for (const r of type.damage_relations.half_damage_to) {
            relations[GetTypeFromName(r.name).id] = 0.5;
        }
        for (const r of type.damage_relations.no_damage_to) {
            relations[GetTypeFromName(r.name).id] = 0;
        }
        relations.shift(); //ids start at 1
        relations.push(1);
        return relations;
    }

    return (
        <div className="relative overflow-x-auto w-fit">


            <table className="text-sm border [&_td]:border bg-accent ">
                <thead>
                <tr>
                    <th></th>
                    {
                        types && Object.entries(types).map(([key, value]) => {
                            return (
                                <th key={key}
                                    onMouseEnter={() => setHoverDefendingType(value)}
                                    onMouseLeave={() => setHoverDefendingType(hoverDefendingType == value ? undefined : value)}
                                    className={cn(
                                        hoverAttackingType && GetRelations(hoverAttackingType)[value.id - 1] == 1 && "opacity-20"
                                    )}
                                >
                                    <img src={`./types-icons/${value.name}.png`} alt="Logo"/>
                                </th>);
                        })
                    }
                </tr>
                </thead>
                <tbody>
                {
                    types && Object.entries(types).map(([key, value]) => {
                        return (<tr className={cn(
                                "font-bold",
                            )}>
                                <td onMouseEnter={() => setHoverAttackingType(value)}
                                    onMouseLeave={() => setHoverAttackingType(hoverAttackingType == value ? undefined : value)}
                                    className={cn(
                                        hoverDefendingType && GetRelations(value)[hoverDefendingType.id - 1] == 1 && "opacity-20"
                                    )}>
                                    <img src={`./types-icons/${value.name}.png`} alt="Logo"/>
                                </td>
                                {
                                    (GetRelations(value).map((relationValue, index) => {
                                        if(relationValue != 1){

                                            return (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <td key={index} className={cn(
                                                            "transition-all",
                                                            hoverAttackingType == value && hoverBg,
                                                            hoverDefendingType && hoverDefendingType.id == index + 1 && hoverBg,
                                                            relationValue == 0 && noDamageBg,
                                                            relationValue == 0.5 && halfDamageBg,
                                                            relationValue == 2 && doubleDamageBg,
                                                            hoverAttackingType && hoverAttackingType != value && "opacity-50",
                                                            hoverDefendingType && hoverDefendingType.id != index + 1 && "opacity-50",
                                                        )}
                                                            onMouseEnter={() => setTooltipOpen(true)}
                                                            onMouseLeave={() => setTooltipOpen(false)}

                                                        >
                                                            {relationValue != 1 && relationValue}
                                                        </td>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{currentTip}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        } else {
                                            return (
                                                        <td key={index} className={cn(
                                                            "transition-all",
                                                            hoverAttackingType == value && hoverBg,
                                                            hoverDefendingType && hoverDefendingType.id == index + 1 && hoverBg,
                                                            hoverAttackingType && hoverAttackingType != value && "opacity-50",
                                                            hoverDefendingType && hoverDefendingType.id != index + 1 && "opacity-50",
                                                        )}
                                                            onMouseEnter={() => setTooltipOpen(true)}
                                                            onMouseLeave={() => setTooltipOpen(false)}

                                                        >
                                                            {relationValue != 1 && relationValue}
                                                        </td>
                                            );
                                        }
                                    }))
                                }
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </div>
    )
}

export default TypesTable;
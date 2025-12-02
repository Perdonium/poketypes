import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import type {Dictionary} from "@/pages/main-page/MainPage.tsx";
import type {Type} from "pokenode-ts";
import {cn} from "@/lib/utils.ts";
import {useEffect, useRef, useState} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {motion, useMotionValue} from "motion/react"
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import TypeIcon from "@/components/TypeIcon.tsx";

interface Tip {
    attacking: string,
    defending: string,
    tip: string,
    mutual: boolean
}

function TypesTable({types}: { types: Dictionary<Type> }) {
    const topY = useMotionValue(0);
    const leftX = useMotionValue(0);

    const tips: Tip[] = [
        {
            attacking: "ghost",
            defending: "normal",
            tip: "Les vivants et les morts ne peuvent pas interagir entre eux",
            mutual: true
        },
        {
            attacking: "fighting",
            defending: "normal",
            tip: "Un combattant experimenté a l'avantage sur une personne normale",
            mutual: true
        },
        {
            attacking: "ground",
            defending: "fire",
            tip: "On peut éteindre un feu avec de la terre",
            mutual: false
        },
        {
            attacking: "fire",
            defending: "water",
            tip: "L'eau éteint le feu.",
            mutual: true
        },
        {
            attacking: "electric",
            defending: "water",
            tip: "L'eau conduit l'électricité",
            mutual: true
        },
        {
            attacking: "grass",
            defending: "water",
            tip: "Les plantes se nourrissent d'eau",
            mutual: true
        },
        
    ]

    const topRowRef = useRef(null);
    const tbodyRef = useRef(null);

    const hoverBg = "bg-accent";
    const noDamageBg = "bg-muted-foreground";
    const halfDamageBg = "bg-destructive";
    const doubleDamageBg = "bg-green-500";
    const baseBg = "bg-background";
    
    const [hoverAttackingType, setHoverAttackingType] = useState<Type>();
    const [hoverDefendingType, setHoverDefendingType] = useState<Type>();
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const [topOffset, setTopOffset] = useState(0);
    const [leftOffset, setLeftOffset] = useState(0);


    const [relations, setRelations] = useState<Dictionary<number[]>>();

    const [tooltipOffset, setTooltipOffset] = useState([0, 0]);
    const [currentTip, setCurrentTip] = useState("");

    const [clickAttacking, setClickAttacking] = useState<Type>();
    const [clickDefending, setClickDefending] = useState<Type>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newTip, setNewTip] = useState("");
    const [newTipMutual, setNewTipMutual] = useState(true);
    const [newTips, setNewTips] = useState("");
    
    useEffect(() => {
        if (!types)
            return;
        let relations: Dictionary<number[]> = {};
        Object.entries(types).map(([key, value]) => {
            relations[key] = GetRelations(value);
        });
        setRelations(relations);
    }, [types]);

    function FindTip(attacking: Type, defending: Type) {
        const tip = tips.find(tip => (tip.attacking === attacking.name && tip.defending === defending.name)
            || (tip.attacking === defending.name && tip.defending === attacking.name && tip.mutual));

        return tip ? tip.tip : undefined;
    }

    function GetTypeFromName(name: string): Type {
        return Object.entries(types)
            .find(pair => pair[1].name === name)![1];
    }

    function GetTypeFromIndex(ind: number): Type {
        return Object.entries(types)[ind][1];
    }


    function OnHoverAttacking(type: Type) {
        if (hoverDefendingType || leftX.get() != 0)
            return;
        setHoverAttackingType(type);

        if (type == undefined) {
            setTopOffset(0);
        } else {
            setTopOffset(tbodyRef.current.firstChild.clientHeight * (type.id - 1));
        }
    }

    function OnHoverDefending(type: Type) {
        if (hoverAttackingType || topY.get() != 0)
            return;
        setHoverDefendingType(type);

        if (type == undefined) {
            setLeftOffset(0);
        } else {
            setLeftOffset(topRowRef.current.firstChild.clientWidth * (type.id - 1));
        }
    }

    function OnHoverCell(attackingType: Type, defendingTypeIndex: number) {
        const defendingType = GetTypeFromIndex(defendingTypeIndex);
        const tip = FindTip(attackingType, defendingType);
        if (!tip)
            return;
        setCurrentTip(tip);
        setTooltipOffset([tbodyRef.current.firstChild.firstChild.clientWidth / 2 + tbodyRef.current.firstChild.firstChild.clientWidth * (defendingType.id), topRowRef.current.clientHeight * (attackingType.id)]);
        setTooltipOpen(true);
        setClickAttacking(attackingType);
        setClickDefending(defendingType);
    }
    
    function OnClickCell(attackingType: Type, defendingTypeIndex: number) {
        const defendingType = GetTypeFromIndex(defendingTypeIndex);
        setClickAttacking(attackingType);
        setClickDefending(defendingType);
        setDialogOpen(true);
    }

    function OnSubmitDialog(){
        const nTips = newTips+`        {
            attacking: "${clickAttacking.name}",
            defending: "${clickDefending.name}",
            tip: "${newTip}",
            mutual: ${newTipMutual}
        },
        `;
        setNewTips(nTips);
        console.log(nTips);
        setDialogOpen(false);
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
        <div className="relative md:w-2/3 my-auto">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nouveau tip</DialogTitle>
                        <DialogDescription>
                            Tip pour {clickAttacking && clickAttacking.name} sur {clickDefending && clickDefending.name} ?
                        </DialogDescription>
                    </DialogHeader>
                    <Input id="tip" name="tip" onChange={(e) => setNewTip(e.target.value)}/>
                    <div className={"space-x-4"}><Checkbox id="mutuel" checked={newTipMutual}  onCheckedChange={(value) => setNewTipMutual(value === true)}/><span>Mutuel</span></div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={OnSubmitDialog}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            <TooltipProvider>

                <table className={`relative text-sm border [&_td]:border ${baseBg}`}>
                    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                        <TooltipTrigger asChild>
                            <div
                                className={"absolute opacity-0"}
                                style={{
                                    top: tooltipOffset[1],
                                    left: tooltipOffset[0],
                                }}>
                                .
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{currentTip}</p>
                        </TooltipContent>
                    </Tooltip>
                    <motion.thead className={"z-50 relative"}
                                  animate={{y: topOffset}}
                                  transition={{ease: "easeOut", duration: 0.2}}
                                  style={{y:topY}}
                    >
                        <tr ref={topRowRef}>
                            <th className={"pointer-events-none"}></th>
                            {
                                types && Object.entries(types).map(([key, value]) => {
                                    return (
                                        <th key={key}
                                            onMouseEnter={() => OnHoverDefending(value)}
                                            onMouseLeave={() => OnHoverDefending(hoverDefendingType == value ? undefined : value)}
                                            className={cn(
                                                "relative bg-accent w-10",
                                            )}
                                        >
                                           <TypeIcon type={value} additionalClass={cn(
                                               "",
                                               hoverAttackingType && relations[hoverAttackingType.id][value.id - 1] == 1 ? "opacity-20" : "")}/>
                                        </th>);
                                })
                            }
                            
                        </tr>
                    </motion.thead>

                    <tbody className={"relative "} ref={tbodyRef}>
                    {
                        types && Object.entries(types).map(([_, rowType]) => {
                            return (<tr className={cn(
                                    "relative font-bold",
                                    baseBg
                                )}>

                                    <motion.td
                                        animate={{x: leftOffset}}
                                        transition={{ease: "easeOut", duration: 0.2}}
                                        style={{x:leftX}}
                                        onMouseEnter={() => OnHoverAttacking(rowType)}
                                        onMouseLeave={() => OnHoverAttacking(hoverAttackingType == rowType ? undefined : rowType)
                                        }
                                        className={"relative z-10 bg-accent"}>
                                        <div className={"size-10"}>
                                            
                                        <TypeIcon type={rowType} 
                                                  additionalClass={cn(
                                                      hoverDefendingType && relations[rowType.id][hoverDefendingType.id - 1] == 1 ? "opacity-20" : "")}/>
                                        </div>
                                    </motion.td>
                                    {
                                        relations && relations[rowType.id].map((relationValue, index) => {
                                            
                                            if (relationValue != 1) {

                                                return (
                                                    <td key={index} className={cn(
                                                        "transition-all cursor-help",
                                                        hoverAttackingType == rowType && hoverBg,
                                                        hoverDefendingType && hoverDefendingType.id == index + 1 && hoverBg,
                                                        relationValue == 0 && noDamageBg,
                                                        relationValue == 0.5 && halfDamageBg,
                                                        relationValue == 2 && doubleDamageBg,
                                                        hoverAttackingType && hoverAttackingType != rowType && "opacity-40",
                                                        hoverDefendingType && hoverDefendingType.id != index + 1 && "opacity-40",
                                                    )}
                                                        onMouseEnter={() => OnHoverCell(rowType, index)}
                                                        onClick={() => OnClickCell(rowType, index)}
                                                        onMouseLeave={() => setTooltipOpen(false)}

                                                    >
                                                        <div className={"size-10 text-center h-fit align-middle"}>
                                                            
                                                        {relationValue != 1 && `x${relationValue}`}
                                                        </div>
                                                    </td>
                                                );
                                            } else {
                                                return (
                                                    <td key={index} className={cn(
                                                        "size-10",
                                                        hoverAttackingType == rowType && hoverBg,
                                                        hoverDefendingType && hoverDefendingType.id == index + 1 && hoverBg,
                                                        hoverAttackingType && hoverAttackingType != rowType && "opacity-50",
                                                        hoverDefendingType && hoverDefendingType.id != index + 1 && "opacity-50",
                                                    )}
                                                    >
                                                    </td>
                                                );
                                                
                                            }
                                        })
                                    }
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </TooltipProvider>
        </div>
    )
}

export default TypesTable;
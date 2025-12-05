import {PokemonContext} from "@/pages/main-page/MainPage.tsx";
import {cn} from "@/lib/utils.ts";
import {useContext, useEffect, useRef, useState} from "react";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import {motion, useMotionValue} from "motion/react"
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import TypeIcon from "@/components/TypeIcon.tsx";
import type {Dictionary, Tip, Type} from "@/assets/types.ts";
import RelationTip from "@/components/RelationTip.tsx";



function TypesTable() {
    const {types, tips} = useContext(PokemonContext);

    const topY = useMotionValue(0);
    const leftX = useMotionValue(0);

    const firstCellRef = useRef<HTMLDivElement>(null);

    const hoverBg = "bg-accent";
    const noDamageBg = "bg-muted-foreground";
    const halfDamageBg = "bg-destructive";
    const doubleDamageBg = "bg-green-500";
    const baseBg = "bg-background";

    const [hoverAttackingType, setHoverAttackingType] = useState<Type | undefined>();
    const [hoverDefendingType, setHoverDefendingType] = useState<Type | undefined>();
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const [topOffset, setTopOffset] = useState(0);
    const [leftOffset, setLeftOffset] = useState(0);


    const [relations, setRelations] = useState<Dictionary<number[]>>();

    const [tooltipOffset, setTooltipOffset] = useState([0, 0]);
    const [currentTip, setCurrentTip] = useState<Tip>();

    const [hoverCell, setHoverCell] = useState<[Type,Type]>();
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

        return tip ? tip : undefined;
    }

    function GetTypeFromName(name: string): Type {
        return Object.entries(types)
            .find(pair => pair[1].name === name)![1];
    }

    function GetTypeFromIndex(ind: number): Type {
        return Object.entries(types)[ind][1];
    }

    function GetTypeFromId(id: number): Type {
        return types[id];
    }

    function GetCellOffset(id: string, includeWidth: boolean = false) {
        const cell = document.getElementById(id)?.getBoundingClientRect();
        if (!cell)
            return undefined;
        return {
            x: cell.x - firstCellRef.current!.getBoundingClientRect().x + (includeWidth?cell.width/3:0),
            y: cell.y - firstCellRef.current!.getBoundingClientRect().y
        };
    }

    function OnHoverAttacking(type: Type | undefined) {
        if (hoverDefendingType || leftX.get() != 0)
            return;
        setHoverAttackingType(type);

        if (type == undefined) {
            setTopOffset(0);
        } else {
            const prevRowOffset = GetCellOffset(`left-type-${type.id - 1}`);
            if (!prevRowOffset) //First row
                return;
            setTopOffset(prevRowOffset.y);
        }
    }

    function OnHoverDefending(type: Type | undefined) {
        if (hoverAttackingType || topY.get() != 0)
            return;
        setHoverDefendingType(type);

        if (type == undefined) {
            setLeftOffset(0);
        } else {
            const prevColumnOffset = GetCellOffset(`top-type-${type.id - 1}`);
            if (!prevColumnOffset) //First column
                return;
            setLeftOffset(prevColumnOffset.x);
        }
    }

    function OnHoverCell(attackingType: Type, defendingTypeIndex: number) {
        const defendingType = GetTypeFromId(defendingTypeIndex);
        const tip = FindTip(attackingType, defendingType);
        if (!tip)
            return;
        setCurrentTip(tip);
        const cellOffset = GetCellOffset(`cell-${attackingType.id}-${defendingTypeIndex}`, true)!;
        setTooltipOffset([cellOffset.x, cellOffset.y]);
        setTooltipOpen(true);
        setHoverCell([attackingType, defendingType]);
    }

    function OnClickCell(attackingType: Type, defendingTypeIndex: number) {
        const defendingType = GetTypeFromIndex(defendingTypeIndex);
        setHoverCell([attackingType, defendingType]);
        setDialogOpen(true);
    }

    function OnSubmitDialog() {
        if(!hoverCell)
            return;
        const nTips = newTips + `        {
            attacking: "${hoverCell[0].name}",
            defending: "${hoverCell[1].name}",
            tip: "${newTip}",
            mutual: ${newTipMutual}
        },
        `;
        setNewTips(nTips);
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
        <>
            <div className="relative my-auto mx-auto md:mx-8 lg:mx-auto 
                 text-[12px]
                  lg:text-lg md:font-bold">
                {hoverCell && <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nouveau tip</DialogTitle>
                            <DialogDescription>
                                Tip
                                pour {hoverCell[0] && hoverCell[0].name} sur {hoverCell[1] && hoverCell[1].name} ?
                            </DialogDescription>
                        </DialogHeader>
                        <Input id="tip" name="tip" onChange={(e) => setNewTip(e.target.value)}/>
                        <div className={"space-x-4"}><Checkbox id="mutuel" checked={newTipMutual}
                                                               onCheckedChange={(value) => setNewTipMutual(value === true)}/><span>Mutuel</span>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={OnSubmitDialog}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>}

                <TooltipProvider>

                    <div className={`relative border [&_>div]:border ${baseBg}
                  grid types-grid max-w-2xl mx-auto`}>
                      <RelationTip tooltipOpen={tooltipOpen} tip={currentTip} offset={tooltipOffset}/>
                        {/*Header*/}
                        <div className={"pointer-events-none"} ref={firstCellRef}></div>
                        {
                            types && relations && Object.entries(types).map(([key, value]) => {
                                return (
                                    <motion.div key={key}
                                                id={`top-type-${value.id}`}
                                                onMouseEnter={() => OnHoverDefending(value)}
                                                onMouseLeave={() => OnHoverDefending(hoverDefendingType == value ? undefined : value)}
                                                className={cn(
                                                    "relative bg-accent z-10", //TODO:Here size
                                                )}
                                                animate={{y: topOffset}}
                                                transition={{ease: "easeOut", duration: 0.2}}
                                                style={{y: topY}}
                                    >
                                        <TypeIcon type={value} additionalClass={cn(
                                            "",
                                            hoverAttackingType && relations[hoverAttackingType.id][value.id - 1] == 1 ? "opacity-20" : "")}/>
                                    </motion.div>);
                            })
                        }

                        {
                            types && relations && Object.entries(types).map(([_, rowType]) => {
                                return (<>

                                        <motion.div
                                            key={rowType.id}
                                            id={`left-type-${rowType.id}`}
                                            animate={{x: leftOffset}}
                                            transition={{ease: "easeOut", duration: 0.2}}
                                            style={{x: leftX}}
                                            onMouseEnter={() => OnHoverAttacking(rowType)}
                                            onMouseLeave={() => OnHoverAttacking(hoverAttackingType == rowType ? undefined : rowType)
                                            }
                                            className={"relative z-10 bg-accent"}>

                                            <TypeIcon type={rowType}
                                                      additionalClass={cn(
                                                          "w-full h-full",
                                                          hoverDefendingType && relations[rowType.id][hoverDefendingType.id - 1] == 1 ? "opacity-20" : "")}/>
                                        </motion.div>
                                        {
                                            relations && relations[rowType.id].map((relationValue, index) => {

                                                //TODO : Just remove new type
                                                if (index == 18) {
                                                    return <></>
                                                }
                                                if (relationValue != 1) {

                                                    return (
                                                        <div key={index}
                                                             id={`cell-${rowType.id}-${index + 1}`}
                                                             className={cn(
                                                                 "flex transition-all cursor-help",
                                                                 hoverAttackingType == rowType && hoverBg,
                                                                 hoverDefendingType && hoverDefendingType.id == index + 1 && hoverBg,
                                                                 relationValue == 0 && noDamageBg,
                                                                 relationValue == 0.5 && halfDamageBg,
                                                                 relationValue == 2 && doubleDamageBg,
                                                                 hoverAttackingType && hoverAttackingType != rowType && "opacity-40",
                                                                 hoverDefendingType && hoverDefendingType.id != index + 1 && "opacity-40",
                                                             )}
                                                             onMouseEnter={() => OnHoverCell(rowType, index + 1)}
                                                             onClick={() => OnClickCell(rowType, index)}
                                                             onMouseLeave={() => setTooltipOpen(false)}

                                                        >
                                                            <div className={cn("mx-auto my-auto h-fit")}>

                                                                {relationValue === 0.5 ? (
                                                                    <><sup>1</sup>&frasl;
                                                                        <sub>2</sub></>) : `${relationValue}`}

                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div key={index} className={cn(
                                                            hoverAttackingType == rowType && hoverBg,
                                                            hoverDefendingType && hoverDefendingType.id == index + 1 && hoverBg,
                                                            hoverAttackingType && hoverAttackingType != rowType && "opacity-50",
                                                            hoverDefendingType && hoverDefendingType.id != index + 1 && "opacity-50",
                                                        )}
                                                        >
                                                        </div>
                                                    );

                                                }
                                            })
                                        }
                                    </>
                                );
                            })
                        }
                    </div>
                </TooltipProvider>
            </div>
            {/* <img src={"chart.png"} className={"w-full"}/> */}
        </>
    )
}

export default TypesTable;
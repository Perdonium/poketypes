import {Item, ItemActions, ItemContent} from "@/components/ui/item.tsx";
import TypeIcon from "@/components/TypeIcon.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import PokemonRelation from "@/components/PokemonRelation.tsx";
import {useContext, useEffect, useState} from "react";
import {PokemonContext} from "@/pages/MainPage.tsx";
import {usePokedex} from "@/stores/store.tsx";
import type {Tip, Type} from "@/assets/types.ts";
import RelationTip from "@/components/RelationTip.tsx";
import {cn} from "@/lib/utils.ts";

const typeColors: { [color: string] : string } = {
    "normal": "bg-gradient-to-t from-gray-300/30 to-gray-500/50",
    "fighting": "bg-gradient-to-t from-red-400/30 to-red-600/50",
    "flying": "bg-gradient-to-t from-blue-200/30 to-blue-400/50",
    "poison": "bg-gradient-to-t from-purple-400/30 to-purple-600/50",
    "ground": "bg-gradient-to-t from-yellow-400/30 to-yellow-600/50",
    "rock": "bg-gradient-to-t from-gray-300/30 to-gray-300/50",
    "bug": "bg-gradient-to-t from-green-400/30 to-green-600/50",
    "ghost": "bg-gradient-to-t from-indigo-400/30 to-indigo-600/50",
    "steel": "bg-gradient-to-t from-gray-400/30 to-gray-600/50",
    "fire": "bg-gradient-to-t from-red-300/30 to-red-500/50",
    "water": "bg-gradient-to-t from-blue-300/30 to-blue-500/50",
    "grass": "bg-gradient-to-t from-green-300/30 to-green-500/50",
    "electric": "bg-gradient-to-t from-yellow-300/30 to-yellow-500/50",
    "psychic": "bg-gradient-to-t from-pink-300/30 to-pink-500/50",
    "ice": "bg-gradient-to-t from-cyan-200/30 to-cyan-400/50",
    "dragon": "bg-gradient-to-t from-indigo-500/30 to-indigo-700/50",
    "dark": "bg-gradient-to-t from-gray-800/30 to-gray-900/50",
    "fairy": "bg-gradient-to-t from-pink-200/30 to-pink-400/50",
    "unknown": "bg-gradient-to-t from-gray-200/30 to-gray-400/50",
    "shadow": "bg-gradient-to-t from-gray-900/30 to-black/50"
};

function TypeCard() {

    const titles = {
        no_damage_to: "0",
        half_damage_to: "0.5",
        double_damage_to: "2"
    };

    const currentType = usePokedex((state) => state.currentType);
    const setCurrentType = usePokedex((state) => state.setCurrentType);
    const {types, tips} = useContext(PokemonContext);

    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
    const [currentTip, setCurrentTip] = useState<Tip>();
    const [offset, setOffset] = useState([0, 0]);

    function FindTip(attacking: Type, defending: Type) {
        const tip = tips.find(tip => (tip.attacking === attacking.name && tip.defending === defending.name)
            || (tip.attacking === defending.name && tip.defending === attacking.name && tip.mutual));

        return tip ? tip : undefined;
    }
    
    useEffect(() => {
        if (!currentType)
            setCurrentType(Object.values(types)[0]);
        //TODO : improve
    }, []);

    // @ts-ignore
    const handleHover = (e: MouseEvent<HTMLElement>) => {
        if (e.target && e.target.tagName === "IMG") {
            const tip = FindTip(currentType!, Object.values(types).find(x => x.name == e.target.dataset.type)!);
            if (!tip) {
                setTooltipOpen(false);
                return;
            }
            setCurrentTip(tip);
            setTooltipOpen(true);
            setOffset([e.clientX + window.scrollX + e.target.getBoundingClientRect().width / 3,
                e.target.getBoundingClientRect().y + window.scrollY])
        } else {
            if (tooltipOpen)
                setTooltipOpen(false);
        }
    };
    return (
        <>
            {currentType &&
                <Item variant="outline"
                      className={cn("my-4 lg:my-8 mx-auto h-[15rem] w-[300px] gap-0 border-l-0 border-r-0 border-b-0 border-t border-white/50 overflow-hidden",
                      typeColors[currentType.name])}
                      onMouseOver={handleHover}>
                    <RelationTip tip={currentTip} tooltipOpen={tooltipOpen} offset={offset}/>
                    <ItemContent className={"w-fit h-fit mx-auto"}>
                        <div className={"relative flex justify-center gap-4"}>
                            <TypeIcon type={currentType} additionalClass={"w-12 mx-auto"} useClick={false}/>
                            <h1 className={"text-lg font-bold h-fit my-auto"}>{currentType.name.toUpperCase()}</h1>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                 className="pointer-events-none left-0 absolute blur-xl -translate-y-1/2 w-[150px] opacity-40 -z-10">
                                <circle cx={"0%"} cy={"0%"} r="50"/>
                            </svg>
                        </div>

                        <Separator className={"my-4"}/>

                        <div className={" flex justify-evenly [&>*:first-child]:hidden"}>

                            {
                                Object.keys(titles).map((key: string) => {
                                    const relationKey = key as keyof typeof currentType.damage_relations;
                                    if (currentType.damage_relations[relationKey].length == 0)
                                        return <></>;

                                    return <PokemonRelation title={titles[key as keyof typeof titles]}
                                                            typeList={currentType.damage_relations[relationKey].map(x => x.name)}
                                                            useClick={false}/>;
                                })
                            }


                        </div>
                    </ItemContent>
                    <ItemActions>
                    </ItemActions>
                </Item>}
        </>
    )
}

export default TypeCard;
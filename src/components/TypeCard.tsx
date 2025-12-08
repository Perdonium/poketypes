import {Item, ItemActions, ItemContent} from "@/components/ui/item.tsx";
import TypeIcon from "@/components/TypeIcon.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import PokemonRelation from "@/components/PokemonRelation.tsx";
import {useContext, useEffect, useState} from "react";
import {PokemonContext} from "@/pages/MainPage.tsx";
import {usePokedex} from "@/stores/store.tsx";
import type {Tip, Type} from "@/assets/types.ts";
import RelationTip from "@/components/RelationTip.tsx";

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
                      className={"my-4 lg:my-8 bg-card mx-auto h-[15rem] w-[300px] gap-0"}
                      onMouseOver={handleHover}>
                    <RelationTip tip={currentTip} tooltipOpen={tooltipOpen} offset={offset}/>
                    <ItemContent className={"w-fit h-fit mx-auto"}>
                        <div className={"flex justify-center gap-4"}>
                            <TypeIcon type={currentType} additionalClass={"w-12 mx-auto"} useClick={false}/>
                            <h1 className={"text-lg font-bold h-fit my-auto"}>{currentType.name.toUpperCase()}</h1>
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
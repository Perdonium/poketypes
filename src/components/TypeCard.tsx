import {Item, ItemActions, ItemContent} from "@/components/ui/item.tsx";
import TypeIcon from "@/components/TypeIcon.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import PokemonRelation from "@/components/PokemonRelation.tsx";
import {memo, useContext, useEffect} from "react";
import type {Dictionary, Pokemon, Type} from "@/assets/types.ts";
import {PokemonContext} from "@/pages/main-page/MainPage.tsx";
import {Capitalize} from "@/lib/utils.ts";
import {usePokedex} from "@/stores/store.tsx";

function TypeCard() {
    const currentType = usePokedex((state) => state.currentType);
    const setCurrentType = usePokedex((state) => state.setCurrentType);
    const {types} = useContext(PokemonContext);
    useEffect(() => {
        if(!currentType)
            setCurrentType(Object.values(types)[0]);
        //TODO : improve
    }, []);
    
    console.log(currentType);
    return (
        <>
            {currentType &&
                <Item variant="outline"
                      className={"py-2 bg-card mx-auto h-[15rem] w-[300px] gap-0"}>
                    <ItemContent className={"w-fit h-fit mx-auto"}>

                        <div className={""}>
                            <div className={"flex justify-center gap-4"}>
                                <TypeIcon type={currentType} additionalClass={"w-12 mx-auto"} useClick={false}/>
                                <h1 className={"text-lg font-bold h-fit my-auto"}>{currentType.name.toUpperCase()}</h1>
                            </div>

                            <Separator className={"my-4"}/>


                                <div className={"flex justify-evenly mt-4 [&>*:first-child]:hidden"}>
                                    {currentType.damage_relations.no_damage_to.length > 0 &&
                                        <PokemonRelation title="0"
                                                         typeList={currentType.damage_relations.no_damage_to.map(x => x.name)}/>}
                                    {currentType.damage_relations.half_damage_to.length > 0 &&
                                        <PokemonRelation title="0.5"
                                                         typeList={currentType.damage_relations.half_damage_to.map(x => x.name)}/>}
                                    {currentType.damage_relations.double_damage_to.length > 0 &&
                                        <PokemonRelation title="2"
                                                         typeList={currentType.damage_relations.double_damage_to.map(x => x.name)}/>}


                                </div>
                        </div>

                    </ItemContent>
                    <ItemActions>
                    </ItemActions>
                </Item>}
        </>
    )
}

export default TypeCard;
import type {Dictionary, Pokemon} from "@/pages/main-page/MainPage.tsx";
import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {Type} from "pokenode-ts";
import TypeIcon from "@/components/TypeIcon.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import PokemonRelation from "@/components/PokemonRelation.tsx";

function PokemonCard({pokemon, types}: { pokemon: Pokemon }) {

    function Capitalize(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    return (
        <>
            <Item variant="outline" className={"gap-0 py-2 my-2"}>
                <ItemContent className={"w-fit h-fit"}>

                    <div className={""}>
                        <div className={"flex justify-around"}>

                            <div className={"w-1/3 my-auto"}>

                                <h1 className={"text-lg font-bold"}>{Capitalize(pokemon.name)}</h1>
                                <h1 className={"text-lg font-bold"}>#{pokemon.id}</h1>
                            </div>
                            <img src={pokemon.sprite}
                                 alt={pokemon.name}
                                 className={"w-24"}/>

                            <div className={"w-1/3 flex space-y-2"}>
                                <div className={"flex items-center mx-auto space-x-2"}>
                                    {
                                        Object.values(pokemon.types).map((type) => {
                                            return <TypeIcon type={type.type} additionalClass={"w-6"}/>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        <Separator className={""}/>
                        
                        <div className={"flex justify-evenly"}>
                            {pokemon.relations.none.length > 0 &&
                                <PokemonRelation title="0" relations={pokemon.relations.none} types={types}/>}
                            {pokemon.relations.quarter.length > 0 &&
                                <PokemonRelation title="0.25" relations={pokemon.relations.quarter} types={types}/>}
                            {pokemon.relations.half.length > 0 &&
                                <PokemonRelation title="0.5" relations={pokemon.relations.half} types={types}/>}
                            {pokemon.relations.double.length > 0 &&
                                <PokemonRelation title="2" relations={pokemon.relations.double} types={types}/>}
                            {pokemon.relations.quadruple.length > 0 &&
                                <PokemonRelation title="4" relations={pokemon.relations.quadruple} types={types}/>}


                        </div>
                    </div>

                </ItemContent>
                <ItemActions>
                </ItemActions>
            </Item>
        </>
    )
}

export default PokemonCard;
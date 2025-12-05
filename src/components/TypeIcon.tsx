import {cn} from "@/lib/utils.ts";
import type {Type} from "@/assets/types.ts";
import {usePokedex} from "@/stores/store.tsx";
import {useContext} from "react";
import {PokemonContext} from "@/pages/main-page/MainPage.tsx";

function TypeIcon({type, additionalClass, useClick = true}:{type:Type|string, additionalClass:string, useClick?:boolean}) {

    const setCurrentType = usePokedex((state) => state.setCurrentType);
    const {types} = useContext(PokemonContext);
    
    function OnClick(){
        if(!useClick)
            return;
        if(typeof type != "string"){
            setCurrentType(type);
        } else {
            setCurrentType(Object.values(types).find(x => x.name === type)!);
        }
    }
    return (
        <div className={"relative"}>
            <img
                data-type={typeof type !== "string" ? type.name : type}
                src={`./types-icons/${typeof type !== "string" ? type.name : type}.png`} alt="Logo"
                 className={cn("aspect-square", additionalClass)}
            onClick={() => OnClick()}/>
        </div>
    )
}

export default TypeIcon;
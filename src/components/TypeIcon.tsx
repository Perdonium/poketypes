import {Capitalize, cn} from "@/lib/utils.ts";
import type {Type} from "@/assets/types.ts";
import {usePokedex} from "@/stores/store.tsx";
import {useContext} from "react";
import {PokemonContext} from "@/pages/MainPage.tsx";

function TypeIcon({type, additionalClass, useClick = true, showName = false}:{type:Type|string, additionalClass:string, useClick?:boolean, showName?:boolean}) {

    const setCurrentType = usePokedex((state) => state.setCurrentType);
    const lang = usePokedex((state) => state.lang);
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
    
    let typeString = typeof type !== "string" ? type.name : type;
    let typeName = typeof type !== "string" ? type.names[lang] : type;
    return (
        <div className={"relative flex flex-col items-center text-[0.6rem] sm:text-[0.8rem]"}>
            <img
                data-type={typeString}
                src={`./types-icons/${typeString}.png`} alt="Logo"
                 className={cn("aspect-square", additionalClass)}
            onClick={() => OnClick()}/>
            {showName && <div className={"font-mono font-extrabold mt-1"}>{Capitalize(typeName)}</div>}
        </div>
    )
}

export default TypeIcon;
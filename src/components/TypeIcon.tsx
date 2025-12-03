import {cn} from "@/lib/utils.ts";
import type {Type} from "@/assets/types.ts";

function TypeIcon({type, additionalClass}:{type:Type|string, additionalClass:string}) {

    return (
        <>
            <img
                src={`./types-icons/${typeof type !== "string" ? type.name : type}.png`} alt="Logo"
                 className={cn("aspect-square", additionalClass)}/>
        </>
    )
}

export default TypeIcon;
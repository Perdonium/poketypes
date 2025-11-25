import type {Pokemon} from "@/pages/main-page/MainPage.tsx";
import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import type {Type} from "pokenode-ts";

function TypeIcon({type, additionalClass}:{type:Type, additionalClass:string}) {

    return (
        <>
            <img src={`./types-icons/${type.name}.png`} alt="Logo"
                 className={cn("aspect-square", additionalClass)}/>
        </>
    )
}

export default TypeIcon;
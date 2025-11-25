import type {Dictionary, Pokemon} from "@/pages/main-page/MainPage.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import PokemonCard from "@/components/PokemonCard.tsx";
import TypeIcon from "@/components/TypeIcon.tsx";
import {cn} from "@/lib/utils.ts";

function PokemonRelation({relations, title, types}) {

    return (
        <div className={"flex flex-col"}>
            <div className={"text-lg font-bold"}>
                x{title}
            </div>
            <div className={cn("grid gap-1 mx-auto mt-2",
                relations.length > 2 && "grid-flow-col grid-rows-2 ",
                relations.length == 2 && "grid-cols-2",
                relations.length == 1 && "grid-cols-1")}>
                {
                    relations.map((id) => {
                        return <TypeIcon type={types && types[id+1]} additionalClass={"w-8"}/>
                    })
                }
            </div>
        </div>
    )
}

export default PokemonRelation
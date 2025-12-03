import TypeIcon from "@/components/TypeIcon.tsx";
import {cn} from "@/lib/utils.ts";

function PokemonRelation({typeList, title}:{typeList:string[], title:string}) {

    return (
        <div className={"flex flex-col"}>
            <div className={"text-lg font-bold"}>
                x{title}
            </div>
            <div className={cn("grid gap-1 mx-auto mt-2",
                typeList.length > 2 && "grid-flow-col grid-rows-2",
                typeList.length == 2 && "grid-cols-2",
                typeList.length == 1 && "grid-cols-1")}>
                {
                    typeList.map((s) => {
                        return <TypeIcon key={s} type={s} additionalClass={"w-8"}/>
                    })
                }
            </div>
        </div>
    )
}

export default PokemonRelation
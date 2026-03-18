import TypeIcon from "@/components/TypeIcon.tsx";
import {cn, GetRelationBackgroundColor} from "@/lib/utils.ts";
import {Separator} from "@/components/ui/separator.tsx";

function PokemonRelation({typeList, title, orientation = "vertical", useClick = true}:{typeList:string[], title:string, orientation?:"horizontal"|"vertical", useClick?:boolean}) {

    return (
        <>

            <Separator className={cn("separator bg-white/40", orientation=="vertical" && "!h-auto")} orientation={orientation}/>
        <div className={"flex flex-col"}>

            <div className={cn("text-lg font-bold w-fit rounded-2xl px-3 mx-auto",
                GetRelationBackgroundColor(title))}>
                x{title}
               </div>
            <div className={cn("grid gap-1 mx-auto mt-2",
                typeList.length > 2 && "grid-flow-col grid-rows-2",
                typeList.length == 2 && "grid-cols-2",
                typeList.length == 1 && "grid-cols-1")}>
                {
                    typeList.map((s) => {
                        return <TypeIcon key={s} 
                                         type={s} 
                                         additionalClass={"w-8"}
                        useClick={useClick}/>
                    })
                }
            </div>
        </div>
            </>
    )
}

export default PokemonRelation
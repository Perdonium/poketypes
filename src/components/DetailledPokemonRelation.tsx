import TypeIcon from "@/components/TypeIcon.tsx";
import {cn} from "@/lib/utils.ts";
import {Separator} from "@/components/ui/separator.tsx";

function DetailledPokemonRelation({typeList, title, orientation = "vertical", useClick = true}: {
    typeList: string[],
    title: string,
    orientation?: "horizontal" | "vertical",
    useClick?: boolean
}) {

    return (
        <>
            <Separator className={cn("separator bg-white/40", orientation == "vertical" && "!h-auto")}
                       orientation={orientation}/>
            <div className={"flex my-4 items-center"}>

                <div className={"text-lg font-bold w-1/4 text-center"}>
                    x{title}
                </div>
                <div className={cn("grid gap-4 mx-auto my-2")}>
                    {
                        typeList.map((s, ind) => {
                            return <div className={"flex"}>
                                <TypeIcon key={s}
                                          type={s}
                                          additionalClass={"w-8 mr-8"}
                                          useClick={useClick}/>
                                <span className={"my-auto"}> Ceci est un exemple de tips pour mémoriser la résistance. </span>
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default DetailledPokemonRelation
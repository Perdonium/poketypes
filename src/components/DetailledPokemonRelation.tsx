import TypeIcon from "@/components/TypeIcon.tsx";
import {cn, GetTypesFromNames} from "@/lib/utils.ts";
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

                <div className={"text-lg font-bold w-1/8 text-center"}>
                    x{title}
                </div>
                <div className={cn("grid gap-4 my-2")}>
                    {
                        GetTypesFromNames(typeList).map((s) => {
                            return <div className={"grid grid-cols-4"}>
                                <div className={"grid-shri"}>
                                <TypeIcon key={s}
                                          type={s}
                                          additionalClass={"w-10"}
                                          useClick={useClick}
                                          showName={true}/>
                                </div>
                                <span className={"my-auto col-span-3"}> Ceci est un exemple de tips pour mémoriser la résistance. </span>
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default DetailledPokemonRelation
import TypeIcon from "@/components/TypeIcon.tsx";
import {cn, GetRelationBackgroundColor, GetTypesFromNames} from "@/lib/utils.ts";
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
            <div className={"flex my-4 items-center ml-2"}>

                <div className={cn("md:text-lg font-bold w-1/5 xl:w-1/8 text-center")}>
                    <h1 className={cn("w-fit mx-auto rounded-2xl px-3",
                        GetRelationBackgroundColor(title))}>
                    x{title}
                    </h1>
                </div>
                <div className={cn("grid gap-4 my-2 pr-4 w-4/5 xl:w-7/8")}>
                    {
                        GetTypesFromNames(typeList).map((s) => {
                            return <div className={"grid grid-cols-4"}>
                                <div className={"grid-shri"}>
                                <TypeIcon key={s.id}
                                          type={s}
                                          additionalClass={"w-7 xl:w-10"}
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
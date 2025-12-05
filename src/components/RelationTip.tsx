import {Capitalize} from "@/lib/utils.ts";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import type {Tip} from "@/assets/types.ts";

function RelationTip({tooltipOpen, tip, offset} : {tooltipOpen:boolean, tip:Tip|undefined, offset:number[]}) {

    return (
        <>
            {tip &&
            <Tooltip open={tooltipOpen}>
                <TooltipTrigger asChild>
                    <div
                        className={"absolute opacity-0"}
                        style={{
                            top: offset[1],
                            left: offset[0],
                        }}>
                        .
                    </div>
                </TooltipTrigger>
                <TooltipContent className={"flex flex-col items-center"}>
                    <p className={"font-bold mx-auto"}>{`${tip && Capitalize(tip.attacking)} => ${tip && Capitalize(tip.defending)}`}</p>
                    <p>{tip && tip.tip}</p>
                </TooltipContent>
            </Tooltip>
            }
        </> 
    )
}

export default RelationTip
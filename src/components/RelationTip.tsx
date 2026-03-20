import {Capitalize, GetTypeFromName} from "@/lib/utils.ts";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import type {Tip} from "@/assets/types.ts";
import {usePokedex} from "@/stores/store.tsx";

function RelationTip({tooltipOpen, tip, offset} : {tooltipOpen:boolean, tip:Tip|undefined, offset:number[]}) {
    const lang = usePokedex((state) => state.lang);

    let attackingName = "";
    let defendingName = "";
    if(tip){
        attackingName = GetTypeFromName(tip.attacking).names[lang];
        defendingName = GetTypeFromName(tip.defending).names[lang];
    }
    

    return (
        <>
            {tip &&
            <Tooltip open={tooltipOpen}>
                <TooltipTrigger asChild>
                    <div
                        className={"absolute opacity-0 pointer-events-none"}
                        style={{
                            top: offset[1],
                            left: offset[0],
                        }}>
                        .
                    </div>
                </TooltipTrigger>
                <TooltipContent className={"flex flex-col items-center"}>
                    <p className={"font-bold mx-auto"}>{`${tip && Capitalize(attackingName)} → ${tip && Capitalize(defendingName)}`}</p>
                    <p>{tip && tip.tip}</p>
                </TooltipContent>
            </Tooltip>
            }
        </> 
    )
}

export default RelationTip
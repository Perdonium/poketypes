import {cn} from "@/lib/utils.ts";
import type {Type} from "@/assets/types.ts";

function GameLogo({name, additionalClass}:{name:string, additionalClass:string}) {

    return (
        <>
            <img
                src={`/game-logos/${name}_EN.png`} alt={name}
                className={cn("w-18 md:w-[120px]", additionalClass)}/>
        </>
    )
}

export default GameLogo;
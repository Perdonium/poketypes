import {useEffect, useState} from "react";
import type {Type} from 'pokenode-ts';
import TypesTable from "@/components/TypesTable.tsx";

export interface Dictionary<T> {
    [Key: string]: T;
}

function MainPage() {
    const [types, setTypes] = useState<Dictionary<Type>>();

    useEffect(() => {
        fetch("./types.json").then((response: Response) => {
            return response.json();
        })
            .then(data => {
                console.log(data);
                setTypes(data as {[id:string]:Type});
            });    
    }, []);

    return (
        <>
            <h1>Pokemon Types</h1>
            <h1>{types && Object.keys(types).length} types</h1>
            <div className={"flex items-center justify-center"}>
            <TypesTable types={types}/>
            </div>
        </>
    )
}

export default MainPage
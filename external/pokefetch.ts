import {NamedAPIResource, NamedAPIResourceList, PokemonClient, Type} from 'pokenode-ts';
import * as fs from 'fs';
const api = new PokemonClient();

let typesDic = {}
async function GetType(typeName:string):Promise<Type> {
    let t:Type = await api.getTypeByName(typeName);
    console.log(t);
    const {moves, pokemon, ...cleanedType} = t;
    if(t.id < 100)
        typesDic[t.id] = cleanedType;
    return t;
}

async function OnTypes(types:NamedAPIResource[]){
    for(let type of types){
        await GetType(type.name)
    }

    fs.writeFile('types.json', JSON.stringify(typesDic), (error) => {
        if (error) {
            throw error;
        }
    });
}
(async () => {

    /*
    await api
        .getPokemonByName('luxray')
        .then((data) => console.log(data)) // will output "Luxray"
        .catch((error) => console.error(error));
        
     */
    
    await api
        .listTypes()
        .then((data) => OnTypes(data.results))
        .catch((error) => console.error(error));
})();


setInterval(() => {}, 1_000);
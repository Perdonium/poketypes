import {Button} from "@/components/ui/button.tsx";
import {CircleQuestionMark} from "lucide-react";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";

function HelpButton() {

    return (
        <>
            <Dialog>
                    <DialogTrigger asChild>
                        <Button className={"-translate-x-16 text-accent-foreground"} variant="ghost" size="icon" aria-label="Submit">
                            <CircleQuestionMark className={"size-8 text-shadow-input"}/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="border-0 border-t-2 bg-card" showCloseButton={false}>
                        <div className={"font-bold mx-auto text-2xl mb-10"}>PokeTypes.net</div>
                        <div>Le site PokeTypes.net a été créé pour pouvoir plus facilement connaître les résistances des Pokémons.</div>
                        <div>Malgré plus de 20 ans à jouer aux jeux Pokémon, j'ai encore du mal à me rappeler des types et faiblesses avec plus de 1000
                        espèces existantes.</div>
                        <br/>
                        <div>Sur le site, vous pouvez choisir votre version pour afficher la liste des Pokémons présents. Des astuces mnémotechniques 
                        pour se souvenir des relations entre les types sont également disponibles en cliquant sur un Pokémon, ou en survolant la table de types.</div>
                        <br/>
                        <div>Les données du site ont été obtenues via <a target="_blank" className={"text-blue-400 hover:underline"} href={"https://pokeapi.co/"}>PokeApi</a>.</div>
                        <div>N'hésitez pas à me contacter pour toute suggestion d'amélioration ou bug rencontré. Les traductions dans certains languages ayant été faites via 
                            Google Translate, n'hésitez pas à me remonter les erreurs.</div>
                        <br/>
                        <div className={"font-bold"}>Site créé par Matthieu P.</div>
                    </DialogContent>
            </Dialog>
        </>
    )
}

export default HelpButton;
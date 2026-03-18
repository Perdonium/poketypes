"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {usePokedex} from "@/stores/store.tsx";


const languages = [
    { code: 'fr', label: '🇫🇷 - Français' },
    { code: 'en', label: '🇬🇧 - English' },
    { code: 'de', label: '🇩🇪 - Deutsch' },
    { code: 'es', label: '🇪🇸 - Español' }
];


const LanguageSwitch = () => {
    const setLang = usePokedex((state) => state.setLang);
    const language = usePokedex((state) => state.lang);
  function OnSwitch(lang:string){
      setLang(lang);
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={"-mt-4"}>
          <Languages className="h-4 w-4" />
            {languages.find(x => x.code == language)!.label.split("-")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup onValueChange={OnSwitch} value={language}>
            {languages.map((item) => (
                <DropdownMenuRadioItem value={item.code}>
            <span className="flex items-center gap-2">
              <span>{item.label}</span>
            </span>
                </DropdownMenuRadioItem>
            ))}
         
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitch;

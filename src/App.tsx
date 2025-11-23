import {useState} from 'react'
import './App.css'
import {ThemeProvider} from "@/components/theme-provider"
import MainPage from "@/pages/main-page/MainPage.tsx";
import { Tooltip } from "./components/ui/tooltip";

function App() {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <MainPage/>
        </ThemeProvider>
    )
}

export default App

import {useState} from 'react'
import './App.css'
import {ThemeProvider} from "@/components/theme-provider"
import Home from "@/pages/home/Home.tsx";

function App() {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Home/>
        </ThemeProvider>
    )
}

export default App

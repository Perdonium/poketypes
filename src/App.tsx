import './App.css'
import {ThemeProvider} from "@/components/theme-provider"
import MainPage from "@/pages/main-page/MainPage.tsx";

function App() {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <MainPage/>
        </ThemeProvider>
    )
}

export default App

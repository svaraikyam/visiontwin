import { ThemeProvider, CssBaseline } from "@mui/material";
import MainLayout from "./components/Layout/MainLayout";
import { darkTheme } from "./theme/theme";

export default function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <MainLayout />
        </ThemeProvider>
    );
}
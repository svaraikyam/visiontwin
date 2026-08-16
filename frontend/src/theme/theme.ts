import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#1976d2",
        },
        background: {
            default: "#20242a",
            paper: "#252a30",
        },
        text: {
            primary: "#ffffff",
            secondary: "#b0b8c4",
        },
    },
    typography: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        backgroundColor: "#1976d2 !important",
                        color: "#ffffff",
                    },
                    "&:hover": {
                        backgroundColor: "#343a40",
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: "#1e2228",
                    borderRadius: "4px",
                },
            },
        },
    },
});

import {
    AppBar,
    Toolbar as MuiToolbar,
    Typography,
    Box,
} from "@mui/material";

import MainMenu from "../Menu/MainMenu";

export default function Toolbar() {
    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                height: "56px",
                backgroundColor: "#1976d2",
            }}
        >
            <MuiToolbar
                sx={{
                    height: "56px",
                    minHeight: "56px",

                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",

                    px: 2,

                    gap: 1,
                }}
            >

                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "18px",
                        fontWeight: 700,
                        letterSpacing: 0.5,

                        mr: 3,

                        whiteSpace: "nowrap",
                    }}
                >
                    VisionTwin
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",

                        height: "100%",

                        flex: 1,
                    }}
                >
                    <MainMenu />
                </Box>

            </MuiToolbar>
        </AppBar>
    );
}
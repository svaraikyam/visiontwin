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
                height: "48px",
                backgroundColor: "#1976d2",
            }}
        >
            <MuiToolbar
                variant="dense"
                sx={{
                    height: "48px",
                    minHeight: "48px",

                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",

                    px: 1,

                    gap: 0.5,
                }}
            >

                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "16px",
                        fontWeight: 600,

                        mr: 2,

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
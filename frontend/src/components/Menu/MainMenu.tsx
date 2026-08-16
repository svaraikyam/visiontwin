import {
    Menu,
    MenuItem,
    Button,
} from "@mui/material";

import {
    useState,
    type MouseEvent,
} from "react";

import {
    MAIN_MENUS,
    type MenuDefinition,
} from "./MenuDefinitions";

export default function MainMenu() {

    const [
        anchorEl,
        setAnchorEl,
    ] = useState<null | HTMLElement>(null);

    const [
        activeMenu,
        setActiveMenu,
    ] = useState<MenuDefinition | null>(null);

    const handleOpen = (
        event: MouseEvent<HTMLElement>,
        menu: MenuDefinition,
    ) => {

        setAnchorEl(event.currentTarget);
        setActiveMenu(menu);
    };

    const handleClose = () => {

        setAnchorEl(null);
        setActiveMenu(null);
    };

    const handleAction = (
        action?: string
    ) => {

        console.log(
            "VisionTwin action:",
            action
        );

        handleClose();
    };

    return (

        <>
            {MAIN_MENUS.map((menu) => (

                <Button
                    key={menu.label}
                    color="inherit"
                    onClick={(event) =>
                        handleOpen(
                            event,
                            menu
                        )
                    }
                    sx={{
                        textTransform: "none",
                        minWidth: "auto",
                        px: 1.2,
                    }}
                >
                    {menu.label}
                </Button>

            ))}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >

                {activeMenu?.items.map(
                    (item) => (

                        <MenuItem
                            key={item.label}
                            onClick={() =>
                                handleAction(
                                    item.action
                                )
                            }
                        >
                            {item.label}
                        </MenuItem>

                    )
                )}

            </Menu>
        </>
    );
}
import {
    Menu,
    MenuItem,
    Button,
} from "@mui/material";

import {
    useState,
    useRef,
    type MouseEvent,
    type ChangeEvent,
} from "react";

import {
    MAIN_MENUS,
    type MenuDefinition,
} from "./MenuDefinitions";
import { useSceneStore } from "../../store/sceneStore";
import { CameraObject } from "../../models/CameraObject";
import { ModelObject } from "../../models/ModelObject";
import { ObjectType } from "../../models/ObjectType";

export default function MainMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeMenu, setActiveMenu] = useState<MenuDefinition | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleOpen = (
        event: MouseEvent<HTMLElement>,
        menu: MenuDefinition
    ) => {
        setAnchorEl(event.currentTarget);
        setActiveMenu(menu);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setActiveMenu(null);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const url = URL.createObjectURL(file);
        const name = file.name.replace(/\.[^/.]+$/, "");

        const modelObj = new ModelObject(name, url);
        modelObj.position.set(0, 0, 0);
        modelObj.rotation.set(0, 0, 0);
        useSceneStore.getState().addObject(modelObj);

        e.target.value = "";
    };

    const handleAction = (action?: string) => {
        console.log("VisionTwin action:", action);

        if (!action) {
            handleClose();
            return;
        }

        const store = useSceneStore.getState();

        switch (action) {
            case "object.addCamera": {
                const count =
                    store.objects.filter((o) => o.type === ObjectType.CAMERA).length + 1;
                const cam = new CameraObject(`CCTV Camera ${String(count).padStart(2, "0")}`);
                cam.position.set(0, 3, 5);
                cam.rotation.set(-0.2, 0, 0);
                store.addObject(cam);
                break;
            }

            case "file.importModel":
            case "object.addModel": {
                fileInputRef.current?.click();
                break;
            }

            case "object.addBox":
            case "edit.addBox": {
                const count =
                    store.objects.filter((o) => o.type === ObjectType.MODEL).length + 1;
                const box = new ModelObject(`Box ${String(count).padStart(2, "0")}`, "");
                box.position.set(0, 0.5, 0);
                store.addObject(box);
                break;
            }

            case "edit.delete": {
                store.deleteSelectedObject();
                break;
            }

            default:
                break;
        }

        handleClose();
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                accept=".glb,.gltf"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            {MAIN_MENUS.map((menu) => (
                <Button
                    key={menu.label}
                    color="inherit"
                    onClick={(event) => handleOpen(event, menu)}
                    sx={{
                        textTransform: "none",
                        minWidth: "auto",
                        px: 1.8,
                        py: 0.8,
                        fontSize: "18px",
                        fontWeight: 500,
                        letterSpacing: 0.3,
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.12)",
                        },
                    }}
                >
                    {menu.label}
                </Button>
            ))}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: "#252a30",
                            color: "#ffffff",
                            border: "1px solid #343a40",
                        },
                    },
                }}
            >
                {activeMenu?.items.map((item) => (
                    <MenuItem
                        key={item.label}
                        onClick={() => handleAction(item.action)}
                        sx={{
                            fontSize: "14px",
                            py: 1,
                            px: 2,
                            "&:hover": {
                                backgroundColor: "#1976d2",
                            },
                        }}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
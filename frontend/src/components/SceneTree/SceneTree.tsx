import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import FolderIcon from "@mui/icons-material/Folder";
import SensorsIcon from "@mui/icons-material/Sensors";

import { useSceneStore } from "../../store/sceneStore";
import { ObjectType } from "../../models/ObjectType";

export default function SceneTree() {
    const objects = useSceneStore((state) => state.objects);
    const selected = useSceneStore((state) => state.selected);

    const getIcon = (type: string) => {
        switch (type) {
            case ObjectType.CAMERA:
                return <VideocamIcon fontSize="small" sx={{ color: "#4fc3f7" }} />;
            case ObjectType.MODEL:
                return <ViewInArIcon fontSize="small" sx={{ color: "#ffb74d" }} />;
            case ObjectType.LIGHT:
                return <LightbulbIcon fontSize="small" sx={{ color: "#fff176" }} />;
            case ObjectType.SENSOR:
                return <SensorsIcon fontSize="small" sx={{ color: "#81c784" }} />;
            default:
                return <FolderIcon fontSize="small" sx={{ color: "#90caf9" }} />;
        }
    };

    return (
        <Box
            sx={{
                height: "100%",
                overflow: "auto",
                color: "#ffffff",
            }}
        >
            <Typography
                variant="subtitle2"
                sx={{
                    px: 2,
                    py: 1.5,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    borderBottom: "1px solid #343a40",
                    color: "#ffffff",
                }}
            >
                Scene Tree
            </Typography>

            {objects.length === 0 ? (
                <Typography
                    variant="body2"
                    sx={{ p: 2, color: "#888888", fontStyle: "italic" }}
                >
                    No objects in scene.
                </Typography>
            ) : (
                <List dense disablePadding>
                    {objects.map((object) => {
                        const isSelected = selected === object.id;
                        return (
                            <ListItemButton
                                key={object.id}
                                selected={isSelected}
                                onClick={() => {
                                    useSceneStore.getState().selectObject(object.id);
                                }}
                                sx={{
                                    py: 0.8,
                                    px: 2,
                                    color: isSelected ? "#ffffff" : "#d0d7de",
                                    borderLeft: isSelected ? "3px solid #1976d2" : "3px solid transparent",
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                    {getIcon(object.type)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={object.name}
                                    secondary={object.type}
                                    slotProps={{
                                        primary: {
                                            style: {
                                                color: "#ffffff",
                                                fontWeight: isSelected ? 600 : 400,
                                                fontSize: "13px",
                                            },
                                        },
                                        secondary: {
                                            style: {
                                                color: isSelected ? "#e0e0e0" : "#8b949e",
                                                fontSize: "11px",
                                            },
                                        },
                                    }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            )}
        </Box>
    );
}
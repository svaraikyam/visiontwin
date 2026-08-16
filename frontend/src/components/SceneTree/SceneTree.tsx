import {
    List,
    ListItemButton,
    ListItemText,
    Typography,
    Box,
} from "@mui/material";

import { useSceneStore } from "../../store/sceneStore";

export default function SceneTree() {

    const objects = useSceneStore(
        (state) => state.objects
    );

    const selected = useSceneStore(
        (state) => state.selected
    );

    return (

        <Box
            sx={{
                height: "100%",
                overflow: "auto",
            }}
        >

            <Typography
                variant="subtitle2"
                sx={{
                    px: 2,
                    py: 1,
                    fontWeight: "bold",
                }}
            >
                Scene Tree
            </Typography>

            <List dense>

                {objects.map((object) => (

                    <ListItemButton
                        key={object.id}
                        selected={
                            selected === object.id
                        }
                        onClick={() => {

                            useSceneStore
                                .getState()
                                .selectObject(
                                    object.id
                                );

                        }}
                    >

                        <ListItemText
                            primary={object.name}
                            secondary={object.type}
                        />

                    </ListItemButton>

                ))}

            </List>

        </Box>
    );
}
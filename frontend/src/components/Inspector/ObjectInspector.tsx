import {
    Box,
    Divider,
    TextField,
    Typography,
} from "@mui/material";

import { useSceneStore } from "../../store/sceneStore";

export default function ObjectInspector() {

    const objects =
        useSceneStore(
            (state) => state.objects
        );

    const selected =
        useSceneStore(
            (state) => state.selected
        );

    const object =
        objects.find(
            (item) =>
                item.id === selected
        );

    if (!object) {

        return (

            <Box sx={{ p: 2 }}>

                <Typography variant="subtitle2">
                    Inspector
                </Typography>

                <Typography
                    variant="body2"
                    sx={{ mt: 2 }}
                >
                    Select an object.
                </Typography>

            </Box>
        );
    }

    return (

        <Box
            sx={{
                p: 2,
                overflow: "auto",
                height: "100%",
            }}
        >

            <Typography
                variant="subtitle2"
                sx={{
                    fontWeight: "bold",
                    mb: 2,
                }}
            >
                Object Inspector
            </Typography>

            <TextField
                fullWidth
                size="small"
                label="Name"
                value={object.name}
                margin="dense"
                onChange={(event) => {

                    object.name =
                        event.target.value;

                    useSceneStore
                        .getState()
                        .selectObject(
                            object.id
                        );
                }}
            />

            <TextField
                fullWidth
                size="small"
                label="Type"
                value={object.type}
                margin="dense"
                slotProps={{
                    input: {
                        readOnly: true,
                    },
                }}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="caption">
                Position
            </Typography>

            <TextField
                fullWidth
                size="small"
                label="X"
                type="number"
                value={object.position.x}
                margin="dense"
            />

            <TextField
                fullWidth
                size="small"
                label="Y"
                type="number"
                value={object.position.y}
                margin="dense"
            />

            <TextField
                fullWidth
                size="small"
                label="Z"
                type="number"
                value={object.position.z}
                margin="dense"
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="caption">
                Rotation
            </Typography>

            <TextField
                fullWidth
                size="small"
                label="Rotation X"
                type="number"
                value={object.rotation.x}
                margin="dense"
            />

            <TextField
                fullWidth
                size="small"
                label="Rotation Y"
                type="number"
                value={object.rotation.y}
                margin="dense"
            />

            <TextField
                fullWidth
                size="small"
                label="Rotation Z"
                type="number"
                value={object.rotation.z}
                margin="dense"
            />

        </Box>
    );
}
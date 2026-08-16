import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardActionArea,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import { CameraObject } from "../../models/CameraObject";
import { useSceneStore } from "../../store/sceneStore";

interface Props {
    open: boolean;
    onClose: () => void;
    camera: CameraObject;
}

const PRESETS = [
    { name: "Preset 1: Gate View", pan: 0, tilt: -15, zoom: 1.0, desc: "Main Entrance Monitoring" },
    { name: "Preset 2: Hall Overview", pan: 45, tilt: -30, zoom: 1.5, desc: "HVDC Main Hall Coverage" },
    { name: "Preset 3: Transformer 1", pan: -60, tilt: -10, zoom: 2.5, desc: "Close-up Thermal Inspection" },
    { name: "Preset 4: Valve Hall Cell A", pan: 90, tilt: -20, zoom: 2.0, desc: "Valve Hall Voltage Monitoring" },
];

export default function CameraPresetPopup({ open, onClose, camera }: Props) {
    const applyPreset = (preset: typeof PRESETS[0]) => {
        useSceneStore.getState().updateObject(camera.id, (obj) => {
            const cam = obj as CameraObject;
            // Apply pan/tilt as Euler Y/X rotations
            const radPan = (preset.pan * Math.PI) / 180;
            const radTilt = (preset.tilt * Math.PI) / 180;
            cam.rotation.set(radTilt, radPan, cam.rotation.z);
        });
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
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
            <DialogTitle sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
                <VideocamIcon color="primary" /> Camera Presets - {camera.name}
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: "#343a40" }}>
                <Typography variant="body2" sx={{ mb: 2, color: "#b0b8c4" }}>
                    Select a preset camera view to quickly orient and position the simulated CCTV camera frustum.
                </Typography>
                <Grid container spacing={2}>
                    {PRESETS.map((p) => (
                        <Grid size={6} key={p.name}>
                            <Card sx={{ backgroundColor: "#1e2228", border: "1px solid #3b4148" }}>
                                <CardActionArea onClick={() => applyPreset(p)} sx={{ p: 1.5 }}>
                                    <CardContent sx={{ p: 0 }}>
                                        <Typography variant="subtitle2" sx={{ color: "#4fc3f7", fontWeight: 600 }}>
                                            {p.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#90caf9", display: "block", mt: 0.5 }}>
                                            {p.desc}
                                        </Typography>
                                        <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                            <Typography variant="caption" sx={{ color: "#aaaaaa" }}>
                                                Pan: {p.pan}°
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#aaaaaa" }}>
                                                Tilt: {p.tilt}°
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#aaaaaa" }}>
                                                Zoom: {p.zoom}x
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" size="small">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

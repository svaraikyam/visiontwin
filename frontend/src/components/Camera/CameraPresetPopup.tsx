import { useState, useRef, useEffect } from "react";
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
    TextField,
    IconButton,
    Chip,
    Select,
    MenuItem,
    FormControl,
    Slider,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";

import { CameraObject } from "../../models/CameraObject";
import type { CameraPreset } from "../../models/CameraObject";
import { useSceneStore } from "../../store/sceneStore";
import CctvLiveFeedModal from "./CctvLiveFeedModal";

interface Props {
    open: boolean;
    onClose: () => void;
    camera: CameraObject;
}

const THERMAL_PALETTES = [
    { id: "ironbow", name: "Ironbow (Standard Thermal)" },
    { id: "rainbow", name: "Rainbow (High Dynamic)" },
    { id: "whitehot", name: "White Hot (Monochrome)" },
    { id: "blackhot", name: "Black Hot (Inverted)" },
    { id: "grayscale", name: "Grayscale (Normal)" },
];

export default function CameraPresetPopup({ open, onClose, camera }: Props) {
    const updateObject = useSceneStore((state) => state.updateObject);

    const [isCreatingPreset, setIsCreatingPreset] = useState(false);
    const [newPresetName, setNewPresetName] = useState("");
    const [newPresetDesc, setNewPresetDesc] = useState("");
    const [newPresetNotes, setNewPresetNotes] = useState("");

    // Live Feed Modal Toggle
    const [liveFeedOpen, setLiveFeedOpen] = useState(false);

    // Draggable Window State
    const [position, setPosition] = useState({ x: 80, y: 60 });
    const [isDraggingWindow, setIsDraggingWindow] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0, posX: 80, posY: 60 });

    const handleWindowMouseDown = (e: React.MouseEvent) => {
        setIsDraggingWindow(true);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            posX: position.x,
            posY: position.y,
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingWindow) {
                const dx = e.clientX - dragStartRef.current.x;
                const dy = e.clientY - dragStartRef.current.y;
                setPosition({
                    x: Math.max(10, dragStartRef.current.posX + dx),
                    y: Math.max(10, dragStartRef.current.posY + dy),
                });
            }
        };

        const handleMouseUp = () => {
            setIsDraggingWindow(false);
        };

        if (isDraggingWindow) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDraggingWindow]);

    // Apply Preset
    const applyPreset = (preset: CameraPreset) => {
        updateObject(camera.id, (obj) => {
            const cam = obj as CameraObject;
            const radPan = (preset.pan * Math.PI) / 180;
            const radTilt = (preset.tilt * Math.PI) / 180;
            cam.rotation.set(radTilt, radPan, cam.rotation.z);
            if (preset.zoom) cam.focalLength = preset.zoom;
            if (preset.depth) cam.targetDepth = preset.depth;
            if (preset.thermalPalette) cam.thermalPalette = preset.thermalPalette;
            if (preset.rois) cam.rois = [...preset.rois];
        });
    };

    // Save New Preset from current camera state
    const handleSaveNewPreset = () => {
        if (!newPresetName.trim()) return;

        const currentPanDeg = Math.round((camera.rotation.y * 180) / Math.PI);
        const currentTiltDeg = Math.round((camera.rotation.x * 180) / Math.PI);

        const newPreset: CameraPreset = {
            id: `preset-${Date.now()}`,
            name: newPresetName,
            pan: currentPanDeg,
            tilt: currentTiltDeg,
            zoom: camera.focalLength,
            depth: camera.targetDepth || 12,
            description: newPresetDesc || "User defined CCTV inspection preset",
            notes: newPresetNotes || "Target inspection location.",
            thermalPalette: camera.thermalPalette || "ironbow",
            rois: [...(camera.rois || [])],
        };

        updateObject(camera.id, (obj) => {
            const cam = obj as CameraObject;
            cam.presets = [...(cam.presets || []), newPreset];
        });

        setNewPresetName("");
        setNewPresetDesc("");
        setNewPresetNotes("");
        setIsCreatingPreset(false);
    };

    // Delete Preset
    const handleDeletePreset = (id: string) => {
        updateObject(camera.id, (obj) => {
            const cam = obj as CameraObject;
            cam.presets = (cam.presets || []).filter((p) => p.id !== id);
        });
    };

    // PTZ Nudge
    const handleNudge = (dPan: number, dTilt: number, dFocal: number) => {
        updateObject(camera.id, (obj) => {
            const cam = obj as CameraObject;
            const newTilt = cam.rotation.x + (dTilt * Math.PI) / 180;
            const newPan = cam.rotation.y + (dPan * Math.PI) / 180;
            cam.rotation.set(newTilt, newPan, cam.rotation.z);
            if (dFocal !== 0) {
                cam.focalLength = Math.max(1.0, Math.min(100.0, cam.focalLength + dFocal));
            }
        });
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                hideBackdrop={true}
                disableEnforceFocus={true}
                maxWidth="md"
                fullWidth
                style={{ pointerEvents: "none" }}
                slotProps={{
                    paper: {
                        sx: {
                            position: "fixed",
                            left: `${position.x}px`,
                            top: `${position.y}px`,
                            margin: 0,
                            backgroundColor: "rgba(30, 34, 40, 0.95)",
                            backdropFilter: "blur(12px)",
                            color: "#ffffff",
                            border: "1px solid #3b4148",
                            boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
                            pointerEvents: "auto",
                            zIndex: 1300,
                        },
                    },
                }}
            >
                <DialogTitle
                    onMouseDown={handleWindowMouseDown}
                    sx={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justify: "space-between",
                        cursor: isDraggingWindow ? "grabbing" : "grab",
                        userSelect: "none",
                        backgroundColor: "#161b22",
                        borderBottom: "1px solid #343a40",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <DragHandleIcon sx={{ color: "#8b949e", cursor: "grab" }} />
                        <VideocamIcon color="primary" />
                        <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: 600 }}>
                            Camera Preset & ROI Management — {camera.name}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<PhotoCameraIcon />}
                            onClick={() => setLiveFeedOpen(true)}
                            sx={{ backgroundColor: "#1976d2", textTransform: "none", fontSize: "11px" }}
                        >
                            Open Live View & Capture
                        </Button>
                        <IconButton size="small" onClick={onClose} sx={{ color: "#8b949e" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers sx={{ borderColor: "#343a40", p: 2 }}>
                    <Grid container spacing={2}>
                        {/* Left: Saved Presets List */}
                        <Grid size={7}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#4fc3f7" }}>
                                    Saved Inspection Presets ({(camera.presets || []).length})
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => setIsCreatingPreset(!isCreatingPreset)}
                                    sx={{ textTransform: "none", fontSize: "11px", color: "#76ff03", borderColor: "#76ff03" }}
                                >
                                    Save Current View as Preset
                                </Button>
                            </Box>

                            {/* Create New Preset Form */}
                            {isCreatingPreset && (
                                <Box sx={{ p: 1.5, backgroundColor: "#252a30", borderRadius: "6px", mb: 2, border: "1px solid #3b4148" }}>
                                    <Typography variant="caption" sx={{ color: "#76ff03", fontWeight: 700, display: "block", mb: 1 }}>
                                        Save Current PTZ State as Preset
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Preset Name (e.g. Bushing T1)"
                                                value={newPresetName}
                                                onChange={(e) => setNewPresetName(e.target.value)}
                                                slotProps={{ inputLabel: { style: { color: "#b0b8c4" } }, htmlInput: { style: { color: "#ffffff", fontSize: "12px" } } }}
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Description"
                                                value={newPresetDesc}
                                                onChange={(e) => setNewPresetDesc(e.target.value)}
                                                slotProps={{ inputLabel: { style: { color: "#b0b8c4" } }, htmlInput: { style: { color: "#ffffff", fontSize: "12px" } } }}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Inspection Notes"
                                                value={newPresetNotes}
                                                onChange={(e) => setNewPresetNotes(e.target.value)}
                                                slotProps={{ inputLabel: { style: { color: "#b0b8c4" } }, htmlInput: { style: { color: "#ffffff", fontSize: "12px" } } }}
                                            />
                                        </Grid>
                                        <Grid size={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 0.5 }}>
                                            <Button size="small" onClick={() => setIsCreatingPreset(false)} sx={{ color: "#8b949e", fontSize: "11px" }}>
                                                Cancel
                                            </Button>
                                            <Button size="small" variant="contained" onClick={handleSaveNewPreset} sx={{ fontSize: "11px" }}>
                                                Save Preset
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Preset Cards Grid */}
                            <Grid container spacing={1.5} sx={{ maxHeight: "360px", overflowY: "auto" }}>
                                {(camera.presets || []).map((p) => (
                                    <Grid size={6} key={p.id}>
                                        <Card sx={{ backgroundColor: "#252a30", border: "1px solid #3b4148", position: "relative" }}>
                                            <CardActionArea onClick={() => applyPreset(p)} sx={{ p: 1.5 }}>
                                                <CardContent sx={{ p: 0 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                        <Typography variant="subtitle2" sx={{ color: "#4fc3f7", fontWeight: 600, fontSize: "13px" }}>
                                                            {p.name}
                                                        </Typography>
                                                        <Chip label={`${(p.rois || []).length} ROIs`} size="small" sx={{ height: 16, fontSize: "8px", backgroundColor: "#1976d2" }} />
                                                    </Box>
                                                    <Typography variant="caption" sx={{ color: "#90caf9", display: "block", mt: 0.5 }}>
                                                        {p.description}
                                                    </Typography>

                                                    <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                                                        <Chip label={`Pan: ${p.pan}°`} size="small" sx={{ height: 18, fontSize: "9px", backgroundColor: "#1e2228", color: "#aaaaaa" }} />
                                                        <Chip label={`Tilt: ${p.tilt}°`} size="small" sx={{ height: 18, fontSize: "9px", backgroundColor: "#1e2228", color: "#aaaaaa" }} />
                                                        <Chip label={`Focal: ${p.zoom}mm`} size="small" sx={{ height: 18, fontSize: "9px", backgroundColor: "#1e2228", color: "#aaaaaa" }} />
                                                        <Chip label={`Depth: ${p.depth || 10}m`} size="small" sx={{ height: 18, fontSize: "9px", backgroundColor: "#1e2228", color: "#00e5ff" }} />
                                                    </Box>

                                                    {p.notes && (
                                                        <Typography variant="caption" sx={{ color: "#8b949e", fontStyle: "italic", display: "block", mt: 1 }}>
                                                            Note: {p.notes}
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                            </CardActionArea>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePreset(p.id);
                                                }}
                                                sx={{ position: "absolute", top: 4, right: 4, color: "#8b949e", "&:hover": { color: "#f44336" } }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        {/* Right: Live PTZ Control & Depth Management */}
                        <Grid size={5}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#ffb74d", mb: 1 }}>
                                Live PTZ & Target Depth Control
                            </Typography>

                            {/* Live Depth Slider */}
                            <Box sx={{ px: 1.5, py: 1.5, backgroundColor: "#252a30", borderRadius: "6px", mb: 2, border: "1px solid #3b4148" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: "#b0b8c4" }}>
                                        Target Depth (Distance):
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#00e5ff", fontWeight: 700 }}>
                                        {camera.targetDepth || 12} meters
                                    </Typography>
                                </Box>
                                <Slider
                                    size="small"
                                    min={1}
                                    max={50}
                                    value={camera.targetDepth || 12}
                                    onChange={(_, val) => {
                                        const d = val as number;
                                        updateObject(camera.id, (obj) => {
                                            (obj as CameraObject).targetDepth = d;
                                        });
                                    }}
                                    sx={{ color: "#00e5ff" }}
                                />
                            </Box>

                            {/* Thermography Palette Selector */}
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#81c784", mb: 1 }}>
                                Thermography Color Palette
                            </Typography>
                            <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                                <Select
                                    value={camera.thermalPalette || "ironbow"}
                                    onChange={(e) => {
                                        const pal = e.target.value;
                                        updateObject(camera.id, (obj) => {
                                            (obj as CameraObject).thermalPalette = pal;
                                        });
                                    }}
                                    sx={{ fontSize: "12px", color: "#ffffff", backgroundColor: "#252a30" }}
                                >
                                    {THERMAL_PALETTES.map((p) => (
                                        <MenuItem key={p.id} value={p.id} sx={{ fontSize: "12px" }}>
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* PTZ Nudge Pad */}
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, backgroundColor: "#252a30", p: 1.5, borderRadius: "6px", border: "1px solid #3b4148" }}>
                                <IconButton size="small" onClick={() => handleNudge(0, 5, 0)} sx={{ color: "#ffffff" }}>
                                    <ArrowUpwardIcon fontSize="small" />
                                </IconButton>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <IconButton size="small" onClick={() => handleNudge(5, 0, 0)} sx={{ color: "#ffffff" }}>
                                        <ArrowBackIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleNudge(-5, 0, 0)} sx={{ color: "#ffffff" }}>
                                        <ArrowForwardIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <IconButton size="small" onClick={() => handleNudge(0, -5, 0)} sx={{ color: "#ffffff" }}>
                                    <ArrowDownwardIcon fontSize="small" />
                                </IconButton>
                                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                    <Button size="small" variant="outlined" startIcon={<ZoomInIcon />} onClick={() => handleNudge(0, 0, -0.5)} sx={{ fontSize: "10px", color: "#4fc3f7" }}>
                                        Zoom In
                                    </Button>
                                    <Button size="small" variant="outlined" startIcon={<ZoomOutIcon />} onClick={() => handleNudge(0, 0, 0.5)} sx={{ fontSize: "10px", color: "#4fc3f7" }}>
                                        Zoom Out
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 2, py: 1.5 }}>
                    <Button onClick={onClose} variant="contained" size="small">
                        Close Window
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Live Feed & Snapshot Modal */}
            {liveFeedOpen && (
                <CctvLiveFeedModal
                    open={liveFeedOpen}
                    onClose={() => setLiveFeedOpen(false)}
                    camera={camera}
                />
            )}
        </>
    );
}

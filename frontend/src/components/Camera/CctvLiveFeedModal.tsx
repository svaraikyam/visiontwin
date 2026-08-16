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
    IconButton,
    Select,
    MenuItem,
    FormControl,
    Slider,
    Chip,
    TextField,
    Paper,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PaletteIcon from "@mui/icons-material/Palette";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CameraObject } from "../../models/CameraObject";
import type { CameraROI } from "../../models/CameraObject";
import { ModelObject } from "../../models/ModelObject";
import { ObjectType } from "../../models/ObjectType";
import { useSceneStore } from "../../store/sceneStore";
import GLBModel from "../Scene/Renderers/GLBModel";

interface Props {
    open: boolean;
    onClose: () => void;
    camera: CameraObject;
}

const THERMAL_PALETTES = [
    { id: "ironbow", name: "Ironbow (Standard Thermal)", filter: "sepia(1) hue-rotate(280deg) saturate(3) contrast(1.3)" },
    { id: "rainbow", name: "Rainbow (High Dynamic)", filter: "hue-rotate(180deg) saturate(4) contrast(1.5)" },
    { id: "whitehot", name: "White Hot (Monochrome)", filter: "grayscale(1) contrast(1.4) brightness(1.1)" },
    { id: "blackhot", name: "Black Hot (Inverted)", filter: "grayscale(1) invert(1) contrast(1.4)" },
    { id: "grayscale", name: "Grayscale (Normal)", filter: "none" },
];

function CameraViewRenderer({ camera }: { camera: CameraObject }) {
    const { camera: threeCam } = useThree();
    const objects = useSceneStore((state) => state.objects);

    useFrame(() => {
        threeCam.position.copy(camera.position);
        threeCam.rotation.copy(camera.rotation);
        if ((threeCam as THREE.PerspectiveCamera).fov) {
            const pCam = threeCam as THREE.PerspectiveCamera;
            const hFovDeg = (camera.horizontalFov * 180) / Math.PI;
            if (Math.abs(pCam.fov - hFovDeg) > 0.1) {
                pCam.fov = hFovDeg;
                pCam.updateProjectionMatrix();
            }
        }
    });

    return (
        <>
            <ambientLight intensity={1.8} />
            <directionalLight position={[20, 30, 10]} intensity={2.5} castShadow />
            <gridHelper args={[500, 500, "#1976d2", "#444a54"]} position={[0, -0.01, 0]} />

            {/* Render Scene Objects & GLB Models inside CCTV Camera View */}
            {objects.map((obj) => {
                if (obj.id === camera.id) return null; // Don't render self mesh in camera view
                return (
                    <group
                        key={obj.id}
                        position={[obj.position.x, obj.position.y, obj.position.z]}
                        rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
                        scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
                    >
                        {obj.type === ObjectType.MODEL && (obj as ModelObject).modelPath ? (
                            <GLBModel url={(obj as ModelObject).modelPath!} />
                        ) : obj.type === ObjectType.MODEL ? (
                            <mesh>
                                <boxGeometry args={[1, 1, 1]} />
                                <meshStandardMaterial color="#e65100" roughness={0.4} metalness={0.2} />
                            </mesh>
                        ) : null}
                    </group>
                );
            })}
        </>
    );
}

export default function CctvLiveFeedModal({ open, onClose, camera }: Props) {
    const updateObject = useSceneStore((state) => state.updateObject);
    const canvasRef = useRef<HTMLDivElement>(null);

    const [activePalette, setActivePalette] = useState(camera.thermalPalette || "ironbow");
    const [showRois, setShowRois] = useState(true);
    const [targetDepth, setTargetDepth] = useState(camera.targetDepth || 12);
    const [selectedRoiId, setSelectedRoiId] = useState<string | null>(null);

    // Draggable Window State
    const [position, setPosition] = useState({ x: 40, y: 40 });
    const [isDraggingWindow, setIsDraggingWindow] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0, posX: 40, posY: 40 });

    // Interactive Drag Pan/Tilt on CCTV Feed Box
    const isDraggingFeed = useRef(false);
    const feedDragStart = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });

    // New ROI Form state
    const [isAddingRoi, setIsAddingRoi] = useState(false);
    const [newRoiName, setNewRoiName] = useState("");
    const [newRoiStatus, setNewRoiStatus] = useState<"normal" | "warning" | "critical">("normal");

    // Sync thermal palette state
    useEffect(() => {
        if (camera.thermalPalette) {
            setActivePalette(camera.thermalPalette);
        }
    }, [camera.thermalPalette]);

    // Handle Window Dragging
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

    // Feed Video Box Pointer Drag Pan/Tilt
    const handleFeedPointerDown = (e: React.PointerEvent) => {
        isDraggingFeed.current = true;
        feedDragStart.current = {
            x: e.clientX,
            y: e.clientY,
            rotX: camera.rotation.x,
            rotY: camera.rotation.y,
        };
    };

    const handleFeedPointerMove = (e: React.PointerEvent) => {
        if (!isDraggingFeed.current) return;
        const dx = e.clientX - feedDragStart.current.x;
        const dy = e.clientY - feedDragStart.current.y;

        const sensitivity = 0.004;
        const newPan = feedDragStart.current.rotY - dx * sensitivity;
        const newTilt = feedDragStart.current.rotX - dy * sensitivity;

        updateObject(camera.id, (obj) => {
            obj.rotation.set(newTilt, newPan, obj.rotation.z);
        });
    };

    const handleFeedPointerUp = () => {
        isDraggingFeed.current = false;
    };

    // Optics & Surveillance Math
    const hFovRad = camera.horizontalFov;
    const vFovRad = camera.verticalFov;

    const hFovDeg = (hFovRad * 180) / Math.PI;
    const vFovDeg = (vFovRad * 180) / Math.PI;

    const footprintW = (2 * targetDepth * Math.tan(hFovRad / 2)).toFixed(2);
    const footprintH = (2 * targetDepth * Math.tan(vFovRad / 2)).toFixed(2);

    const sensorResW = 1920; // 1080p surveillance standard
    const ppm = (sensorResW / parseFloat(footprintW)).toFixed(0);

    let doriQuality = "Detection (PPM < 62)";
    const numericPpm = parseFloat(ppm);
    if (numericPpm >= 250) doriQuality = "Identification (PPM ≥ 250)";
    else if (numericPpm >= 125) doriQuality = "Recognition (PPM ≥ 125)";
    else if (numericPpm >= 62) doriQuality = "Observation (PPM ≥ 62)";

    // PTZ Control Nudge
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

    // Snapshot Capture
    const handleCaptureSnapshot = () => {
        const domCanvas = canvasRef.current?.querySelector("canvas");
        if (!domCanvas) return;

        const imageUri = domCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `cctv_snapshot_${camera.name.replace(/\s+/g, "_")}_${Date.now()}.png`;
        link.href = imageUri;
        link.click();
    };

    // ROI Actions
    const handleAddRoi = () => {
        if (!newRoiName.trim()) return;
        const newRoi: CameraROI = {
            id: `roi-${Date.now()}`,
            name: newRoiName,
            x: 35,
            y: 35,
            width: 25,
            height: 25,
            color: newRoiStatus === "critical" ? "#f44336" : newRoiStatus === "warning" ? "#ffb74d" : "#00e5ff",
            status: newRoiStatus,
        };

        updateObject(camera.id, (obj) => {
            const cam = obj as CameraObject;
            cam.rois = [...(cam.rois || []), newRoi];
        });

        setNewRoiName("");
        setIsAddingRoi(false);
    };

    const handleDeleteRoi = (id: string) => {
        updateObject(camera.id, (obj) => {
            const cam = obj as CameraObject;
            cam.rois = (cam.rois || []).filter((r) => r.id !== id);
        });
    };

    const selectedPaletteObj = THERMAL_PALETTES.find((p) => p.id === activePalette) || THERMAL_PALETTES[0];

    return (
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
                        zIndex: 1400,
                    },
                },
            }}
        >
            {/* Draggable Title Header */}
            <DialogTitle
                onMouseDown={handleWindowMouseDown}
                sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justify: "space-between",
                    pb: 1,
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
                        Live CCTV Feed & Optics — {camera.name}
                    </Typography>
                    <Chip label="FLOATING VIEW" size="small" sx={{ height: 18, fontSize: "9px", backgroundColor: "#1976d2", color: "#ffffff", ml: 1 }} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<PhotoCameraIcon />}
                        onClick={handleCaptureSnapshot}
                        sx={{ backgroundColor: "#1976d2", textTransform: "none", fontSize: "11px" }}
                    >
                        Capture Snapshot
                    </Button>
                    <IconButton size="small" onClick={onClose} sx={{ color: "#8b949e" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: "#343a40", p: 2 }}>
                <Grid container spacing={2}>
                    {/* Left: 3D CCTV Video Feed with ROI Overlay & Thermal Filters */}
                    <Grid size={7}>
                        <Paper
                            ref={canvasRef}
                            onPointerDown={handleFeedPointerDown}
                            onPointerMove={handleFeedPointerMove}
                            onPointerUp={handleFeedPointerUp}
                            sx={{
                                position: "relative",
                                width: "100%",
                                height: "320px",
                                backgroundColor: "#000000",
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: "1px solid #3b4148",
                                cursor: "crosshair",
                                filter: selectedPaletteObj.filter,
                            }}
                        >
                            <Canvas
                                camera={{
                                    position: [camera.position.x, camera.position.y, camera.position.z],
                                    fov: hFovDeg,
                                }}
                                gl={{ preserveDrawingBuffer: true }}
                            >
                                <CameraViewRenderer camera={camera} />
                            </Canvas>

                            {/* Live HUD Overlay */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 10,
                                    left: 10,
                                    backgroundColor: "rgba(0,0,0,0.75)",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: "4px",
                                    pointerEvents: "none",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                }}
                            >
                                <Typography variant="caption" sx={{ color: "#76ff03", fontWeight: 700, display: "block" }}>
                                    ● LIVE REAL-TIME FEED
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#ffffff", fontSize: "10px" }}>
                                    Depth: {targetDepth}m | PPM: {ppm} ({doriQuality.split(" ")[0]})
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#b0b8c4", fontSize: "9px", display: "block" }}>
                                    Drag on video to Pan/Tilt CCTV
                                </Typography>
                            </Box>

                            {/* ROI Bounding Box Overlays */}
                            {showRois &&
                                (camera.rois || []).map((roi) => (
                                    <Box
                                        key={roi.id}
                                        onClick={() => setSelectedRoiId(roi.id)}
                                        sx={{
                                            position: "absolute",
                                            left: `${roi.x}%`,
                                            top: `${roi.y}%`,
                                            width: `${roi.width}%`,
                                            height: `${roi.height}%`,
                                            border: `2px dashed ${roi.color || "#00e5ff"}`,
                                            backgroundColor: "rgba(0, 229, 255, 0.08)",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                            "&:hover": {
                                                borderColor: "#ffffff",
                                                backgroundColor: "rgba(0, 229, 255, 0.2)",
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                position: "absolute",
                                                top: "-20px",
                                                left: 0,
                                                backgroundColor: roi.color || "#00e5ff",
                                                color: "#000000",
                                                px: 0.8,
                                                py: 0.2,
                                                fontSize: "9px",
                                                fontWeight: 700,
                                                borderRadius: "2px",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {roi.name} ({roi.status?.toUpperCase()})
                                        </Typography>
                                    </Box>
                                ))}
                        </Paper>

                        {/* Thermal Palette Picker */}
                        <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                            <PaletteIcon fontSize="small" sx={{ color: "#ffb74d" }} />
                            <Typography variant="caption" sx={{ color: "#b0b8c4", fontWeight: 600 }}>
                                Thermography Palette:
                            </Typography>
                            <FormControl size="small" fullWidth sx={{ ml: 1 }}>
                                <Select
                                    value={activePalette}
                                    onChange={(e) => {
                                        const pal = e.target.value;
                                        setActivePalette(pal);
                                        updateObject(camera.id, (obj) => {
                                            (obj as CameraObject).thermalPalette = pal;
                                        });
                                    }}
                                    sx={{
                                        fontSize: "12px",
                                        color: "#ffffff",
                                        backgroundColor: "#252a30",
                                        "& .MuiSelect-icon": { color: "#ffffff" },
                                    }}
                                >
                                    {THERMAL_PALETTES.map((p) => (
                                        <MenuItem key={p.id} value={p.id} sx={{ fontSize: "12px" }}>
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    {/* Right: PTZ Nudge Pad, Target Depth Slider & Live Optics Summary */}
                    <Grid size={5}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#4fc3f7", mb: 1 }}>
                            Live Optics & Target Depth
                        </Typography>

                        {/* Target Depth Slider */}
                        <Box sx={{ px: 1, py: 1, backgroundColor: "#252a30", borderRadius: "6px", mb: 2 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="caption" sx={{ color: "#b0b8c4" }}>
                                    Target Distance (Depth):
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#00e5ff", fontWeight: 700 }}>
                                    {targetDepth} meters
                                </Typography>
                            </Box>
                            <Slider
                                size="small"
                                min={1}
                                max={50}
                                value={targetDepth}
                                onChange={(_, val) => {
                                    const d = val as number;
                                    setTargetDepth(d);
                                    updateObject(camera.id, (obj) => {
                                        (obj as CameraObject).targetDepth = d;
                                    });
                                }}
                                sx={{ color: "#00e5ff" }}
                            />
                        </Box>

                        {/* Optics Metrics Grid */}
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            <Grid size={6}>
                                <Paper sx={{ p: 1, backgroundColor: "#252a30", border: "1px solid #343a40" }}>
                                    <Typography variant="caption" sx={{ color: "#8b949e", display: "block" }}>
                                        Field of View (H / V)
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#ffffff" }}>
                                        {hFovDeg.toFixed(1)}° / {vFovDeg.toFixed(1)}°
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid size={6}>
                                <Paper sx={{ p: 1, backgroundColor: "#252a30", border: "1px solid #343a40" }}>
                                    <Typography variant="caption" sx={{ color: "#8b949e", display: "block" }}>
                                        Footprint (W x H)
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#ffffff" }}>
                                        {footprintW}m × {footprintH}m
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid size={12}>
                                <Paper sx={{ p: 1, backgroundColor: "#252a30", border: "1px solid #343a40" }}>
                                    <Typography variant="caption" sx={{ color: "#8b949e", display: "block" }}>
                                        Pixel Density & DORI Level
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#76ff03" }}>
                                        {ppm} PPM — {doriQuality}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* PTZ Nudge Control Pad */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#ffb74d", mb: 1 }}>
                            Live PTZ Nudge Control
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, backgroundColor: "#252a30", p: 1, borderRadius: "6px" }}>
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
                            <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                                <Button size="small" variant="outlined" startIcon={<ZoomInIcon />} onClick={() => handleNudge(0, 0, -0.5)} sx={{ fontSize: "10px", color: "#4fc3f7" }}>
                                    Zoom In
                                </Button>
                                <Button size="small" variant="outlined" startIcon={<ZoomOutIcon />} onClick={() => handleNudge(0, 0, 0.5)} sx={{ fontSize: "10px", color: "#4fc3f7" }}>
                                    Zoom Out
                                </Button>
                            </Box>
                        </Box>
                    </Grid>

                    {/* ROIs Management List */}
                    <Grid size={12}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1, mb: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#ffffff" }}>
                                    Regions of Interest (ROIs) on Target
                                </Typography>
                                <Chip label={`${(camera.rois || []).length} Active`} size="small" color="primary" sx={{ height: 20, fontSize: "10px" }} />
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={showRois ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    onClick={() => setShowRois(!showRois)}
                                    sx={{ textTransform: "none", fontSize: "11px" }}
                                >
                                    {showRois ? "Hide Overlays" : "Show Overlays"}
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setIsAddingRoi(!isAddingRoi)}
                                    sx={{ textTransform: "none", fontSize: "11px", backgroundColor: "#76ff03", color: "#000000", "&:hover": { backgroundColor: "#64dd17" } }}
                                >
                                    Add ROI Target
                                </Button>
                            </Box>
                        </Box>

                        {/* Add ROI Form */}
                        {isAddingRoi && (
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5, p: 1, backgroundColor: "#252a30", borderRadius: "4px" }}>
                                <TextField
                                    size="small"
                                    placeholder="ROI Target Name (e.g. Thyristor Cell B)"
                                    value={newRoiName}
                                    onChange={(e) => setNewRoiName(e.target.value)}
                                    sx={{ flex: 1, "& .MuiInputBase-input": { color: "#ffffff", fontSize: "12px" } }}
                                />
                                <FormControl size="small" sx={{ width: 120 }}>
                                    <Select
                                        value={newRoiStatus}
                                        onChange={(e) => setNewRoiStatus(e.target.value as any)}
                                        sx={{ fontSize: "12px", color: "#ffffff" }}
                                    >
                                        <MenuItem value="normal">Normal</MenuItem>
                                        <MenuItem value="warning">Warning</MenuItem>
                                        <MenuItem value="critical">Critical</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button size="small" variant="contained" onClick={handleAddRoi} sx={{ fontSize: "11px" }}>
                                    Save ROI
                                </Button>
                            </Box>
                        )}

                        {/* ROI Chip Cards */}
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {(camera.rois || []).map((roi) => (
                                <Paper
                                    key={roi.id}
                                    sx={{
                                        p: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        backgroundColor: selectedRoiId === roi.id ? "rgba(0, 229, 255, 0.15)" : "#252a30",
                                        border: `1px solid ${roi.color || "#3b4148"}`,
                                        borderRadius: "6px",
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#ffffff", fontSize: "12px" }}>
                                        {roi.name}
                                    </Typography>
                                    <Chip
                                        label={roi.status?.toUpperCase()}
                                        size="small"
                                        sx={{
                                            height: 18,
                                            fontSize: "9px",
                                            backgroundColor: roi.status === "critical" ? "#f44336" : roi.status === "warning" ? "#ffb74d" : "#76ff03",
                                            color: "#000000",
                                            fontWeight: 700,
                                        }}
                                    />
                                    <IconButton size="small" onClick={() => handleDeleteRoi(roi.id)} sx={{ color: "#8b949e", "&:hover": { color: "#f44336" } }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Paper>
                            ))}
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
    );
}

import { useState } from "react";
import {
    Box,
    Divider,
    TextField,
    Typography,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    IconButton,
    FormControlLabel,
    Switch,
    Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import VideocamIcon from "@mui/icons-material/Videocam";
import TuneIcon from "@mui/icons-material/Tune";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { useSceneStore } from "../../store/sceneStore";
import { ObjectType } from "../../models/ObjectType";
import { CameraObject } from "../../models/CameraObject";
import { useEditorStore } from "../../store/editorStore";
import CameraPresetPopup from "../Camera/CameraPresetPopup";


import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function ObjectInspector() {
    const objects = useSceneStore((state) => state.objects);
    const selected = useSceneStore((state) => state.selected);
    const updateObject = useSceneStore((state) => state.updateObject);

    const showCameraFrustum = useEditorStore((state) => state.showCameraFrustum);
    const toggleCameraFrustum = useEditorStore((state) => state.toggleCameraFrustum);
    const toggleInspector = useEditorStore((state) => state.toggleInspector);

    const [presetOpen, setPresetOpen] = useState(false);
    const [wallMounted, setWallMounted] = useState(true);

    const object = objects.find((item) => item.id === selected);

    if (!object) {
        return (
            <Box sx={{ p: 2, color: "#ffffff" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Object Inspector
                    </Typography>
                    <Tooltip title="Hide Inspector Panel">
                        <IconButton size="small" onClick={toggleInspector} sx={{ color: "#8b949e" }}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Typography variant="body2" sx={{ color: "#8b949e", fontStyle: "italic", mt: 2 }}>
                    Select an object in the scene or tree to view and edit properties.
                </Typography>
            </Box>
        );
    }

    const isCamera = object.type === ObjectType.CAMERA;
    const cameraObj = isCamera ? (object as CameraObject) : null;

    // Convert Euler radians to degrees for UI display
    const rotDegX = Math.round((object.rotation.x * 180) / Math.PI);
    const rotDegY = Math.round((object.rotation.y * 180) / Math.PI);
    const rotDegZ = Math.round((object.rotation.z * 180) / Math.PI);

    const handlePosChange = (axis: "x" | "y" | "z", val: number) => {
        updateObject(object.id, (obj) => {
            obj.position[axis] = isNaN(val) ? 0 : val;
        });
    };

    const handleRotChange = (axis: "x" | "y" | "z", deg: number) => {
        updateObject(object.id, (obj) => {
            const rad = ((isNaN(deg) ? 0 : deg) * Math.PI) / 180;
            obj.rotation[axis] = rad;
        });
    };

    const handleScaleChange = (axis: "x" | "y" | "z", val: number) => {
        updateObject(object.id, (obj) => {
            obj.scale[axis] = isNaN(val) || val <= 0 ? 1 : val;
        });
    };

    const handleCameraPropChange = (key: keyof CameraObject, val: number) => {
        if (!cameraObj) return;
        updateObject(object.id, (obj) => {
            const cam = obj as CameraObject;
            (cam as any)[key] = isNaN(val) ? 0.1 : val;
        });
    };

    const nudgePTZ = (dPan: number, dTilt: number, dFocal: number) => {
        if (!cameraObj) return;
        updateObject(object.id, (obj) => {
            const cam = obj as CameraObject;
            const newTilt = cam.rotation.x + (dTilt * Math.PI) / 180;
            const newPan = cam.rotation.y + (dPan * Math.PI) / 180;
            cam.rotation.set(newTilt, newPan, cam.rotation.z);
            if (dFocal !== 0) {
                cam.focalLength = Math.max(1.0, Math.min(100.0, cam.focalLength + dFocal));
            }
        });
    };

    // Calculate computed FOVs for camera
    const hFovDeg = cameraObj
        ? ((cameraObj.horizontalFov * 180) / Math.PI).toFixed(1)
        : "0";
    const vFovDeg = cameraObj
        ? (
              (2 * Math.atan(cameraObj.sensorHeight / (2 * cameraObj.focalLength)) * 180) /
              Math.PI
          ).toFixed(1)
        : "0";

    return (
        <Box sx={{ height: "100%", overflowY: "auto", color: "#ffffff" }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: "1px solid #343a40", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
                        Object Inspector
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#8b949e", display: "block" }}>
                        ID: {object.id.substring(0, 8)}...
                    </Typography>
                </Box>
                <Tooltip title="Hide Inspector Panel">
                    <IconButton size="small" onClick={toggleInspector} sx={{ color: "#8b949e", "&:hover": { color: "#ffffff" } }}>
                        <ChevronRightIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Section 1: Object Identity */}
            <Accordion defaultExpanded sx={{ backgroundColor: "#252a30", color: "#ffffff" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "13px" }}>
                        Identity
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Name"
                        value={object.name}
                        margin="dense"
                        onChange={(e) => updateObject(object.id, { name: e.target.value })}
                        slotProps={{
                            inputLabel: { style: { color: "#b0b8c4" } },
                            htmlInput: { style: { color: "#ffffff" } },
                        }}
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Type"
                        value={object.type}
                        margin="dense"
                        slotProps={{
                            input: { readOnly: true },
                            inputLabel: { style: { color: "#b0b8c4" } },
                            htmlInput: { style: { color: "#90caf9" } },
                        }}
                    />
                </AccordionDetails>
            </Accordion>

            {/* Section 2: Transform Coordinates (Position, Rotation, Scale) */}
            <Accordion defaultExpanded sx={{ backgroundColor: "#252a30", color: "#ffffff" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <OpenWithIcon fontSize="small" sx={{ color: "#ffb74d" }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "13px" }}>
                            Transform
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                    {/* Position X, Y, Z */}
                    <Typography variant="caption" sx={{ color: "#4fc3f7", fontWeight: 600, display: "block", mb: 0.5 }}>
                        Position (X, Y, Z)
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid size={4}>
                            <TextField
                                size="small"
                                label="X"
                                type="number"
                                value={parseFloat(object.position.x.toFixed(2))}
                                onChange={(e) => handlePosChange("x", parseFloat(e.target.value))}
                                slotProps={{
                                    inputLabel: { style: { color: "#b0b8c4" } },
                                    htmlInput: { style: { color: "#ffffff" }, step: 0.1 },
                                }}
                            />
                        </Grid>
                        <Grid size={4}>
                            <TextField
                                size="small"
                                label="Y"
                                type="number"
                                value={parseFloat(object.position.y.toFixed(2))}
                                onChange={(e) => handlePosChange("y", parseFloat(e.target.value))}
                                slotProps={{
                                    inputLabel: { style: { color: "#b0b8c4" } },
                                    htmlInput: { style: { color: "#ffffff" }, step: 0.1 },
                                }}
                            />
                        </Grid>
                        <Grid size={4}>
                            <TextField
                                size="small"
                                label="Z"
                                type="number"
                                value={parseFloat(object.position.z.toFixed(2))}
                                onChange={(e) => handlePosChange("z", parseFloat(e.target.value))}
                                slotProps={{
                                    inputLabel: { style: { color: "#b0b8c4" } },
                                    htmlInput: { style: { color: "#ffffff" }, step: 0.1 },
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 1.5, borderColor: "#343a40" }} />

                    {/* Rotation X, Y, Z (Degrees) */}
                    <Typography variant="caption" sx={{ color: "#ffb74d", fontWeight: 600, display: "block", mb: 0.5 }}>
                        Rotation (Degrees RX, RY, RZ)
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid size={4}>
                            <TextField
                                size="small"
                                label="RX °"
                                type="number"
                                value={rotDegX}
                                onChange={(e) => handleRotChange("x", parseFloat(e.target.value))}
                                slotProps={{
                                    inputLabel: { style: { color: "#b0b8c4" } },
                                    htmlInput: { style: { color: "#ffffff" }, step: 1 },
                                }}
                            />
                        </Grid>
                        <Grid size={4}>
                            <TextField
                                size="small"
                                label="RY °"
                                type="number"
                                value={rotDegY}
                                onChange={(e) => handleRotChange("y", parseFloat(e.target.value))}
                                slotProps={{
                                    inputLabel: { style: { color: "#b0b8c4" } },
                                    htmlInput: { style: { color: "#ffffff" }, step: 1 },
                                }}
                            />
                        </Grid>
                        <Grid size={4}>
                            <TextField
                                size="small"
                                label="RZ °"
                                type="number"
                                value={rotDegZ}
                                onChange={(e) => handleRotChange("z", parseFloat(e.target.value))}
                                slotProps={{
                                    inputLabel: { style: { color: "#b0b8c4" } },
                                    htmlInput: { style: { color: "#ffffff" }, step: 1 },
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* Quick Rotation Alignment Action Buttons */}
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                        <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                updateObject(object.id, (obj) => {
                                    obj.rotation.set(0, 0, 0);
                                });
                            }}
                            sx={{
                                fontSize: "11px",
                                color: "#ffb74d",
                                borderColor: "#ffb74d",
                                "&:hover": { borderColor: "#ffa726", backgroundColor: "rgba(255, 183, 77, 0.08)" },
                            }}
                        >
                            Zero Rotation
                        </Button>
                        <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                updateObject(object.id, (obj) => {
                                    obj.rotation.set(-Math.PI / 2, 0, 0);
                                });
                            }}
                            sx={{
                                fontSize: "11px",
                                color: "#4fc3f7",
                                borderColor: "#4fc3f7",
                                "&:hover": { borderColor: "#29b6f6", backgroundColor: "rgba(79, 195, 247, 0.08)" },
                            }}
                        >
                            Align Flat (-90° X)
                        </Button>
                    </Box>

                    <Divider sx={{ my: 1.5, borderColor: "#343a40" }} />

                    {/* Scale X, Y, Z */}
                    <Typography variant="caption" sx={{ color: "#81c784", fontWeight: 600, display: "block", mb: 0.5 }}>
                        Scale (X, Y, Z)
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid size={4}>
                            <TextField
                                size="small"
                                label="SX"
                                type="number"
                                value={parseFloat(object.scale.x.toFixed(2))}
                                onChange={(e) => handleScaleChange("x", parseFloat(e.target.value))}
                                slotProps={{
                                    inputLabel: { style: { color: "#b0b8c4" } },
                                    htmlInput: { style: { color: "#ffffff" }, step: 0.1 },
                                }}
                            />
                        </Grid>
                        <Grid size={4}>
                            <TextField
                                size="small"
                                label="SY"
                                type="number"
                                value={parseFloat(object.scale.y.toFixed(2))}
                                onChange={(e) => handleScaleChange("y", parseFloat(e.target.value))}
                                slotProps={{
                                    inputLabel: { style: { color: "#b0b8c4" } },
                                    htmlInput: { style: { color: "#ffffff" }, step: 0.1 },
                                }}
                            />
                        </Grid>
                        <Grid size={4}>
                            <TextField
                                size="small"
                                label="SZ"
                                type="number"
                                value={parseFloat(object.scale.z.toFixed(2))}
                                onChange={(e) => handleScaleChange("z", parseFloat(e.target.value))}
                                slotProps={{
                                    inputLabel: { style: { color: "#b0b8c4" } },
                                    htmlInput: { style: { color: "#ffffff" }, step: 0.1 },
                                }}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* Camera Specific Menus/Panels */}
            {isCamera && cameraObj && (
                <>
                    {/* Camera Optics Menu */}
                    <Accordion defaultExpanded sx={{ backgroundColor: "#252a30", color: "#ffffff" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <VideocamIcon fontSize="small" sx={{ color: "#4fc3f7" }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "13px" }}>
                                    Optical Simulation
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <Grid container spacing={1}>
                                <Grid size={6}>
                                    <TextField
                                        size="small"
                                        label="Focal Length (mm)"
                                        type="number"
                                        value={cameraObj.focalLength}
                                        onChange={(e) => handleCameraPropChange("focalLength", parseFloat(e.target.value))}
                                        slotProps={{
                                            inputLabel: { style: { color: "#b0b8c4" } },
                                            htmlInput: { style: { color: "#ffffff" }, step: 0.5 },
                                        }}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        size="small"
                                        label="Sensor Width (mm)"
                                        type="number"
                                        value={cameraObj.sensorWidth}
                                        onChange={(e) => handleCameraPropChange("sensorWidth", parseFloat(e.target.value))}
                                        slotProps={{
                                            inputLabel: { style: { color: "#b0b8c4" } },
                                            htmlInput: { style: { color: "#ffffff" }, step: 0.1 },
                                        }}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        size="small"
                                        label="Sensor Height (mm)"
                                        type="number"
                                        value={cameraObj.sensorHeight}
                                        onChange={(e) => handleCameraPropChange("sensorHeight", parseFloat(e.target.value))}
                                        slotProps={{
                                            inputLabel: { style: { color: "#b0b8c4" } },
                                            htmlInput: { style: { color: "#ffffff" }, step: 0.1 },
                                        }}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        size="small"
                                        label="Far Clip (m)"
                                        type="number"
                                        value={cameraObj.far}
                                        onChange={(e) => handleCameraPropChange("far", parseFloat(e.target.value))}
                                        slotProps={{
                                            inputLabel: { style: { color: "#b0b8c4" } },
                                            htmlInput: { style: { color: "#ffffff" }, step: 5 },
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {/* Calculated FOVs & Frustum Toggle */}
                            <Box sx={{ mt: 1.5, p: 1, backgroundColor: "#1e2228", borderRadius: "4px" }}>
                                <Typography variant="caption" sx={{ color: "#81c784", display: "block" }}>
                                    Computed Field of View:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "#4fc3f7", mb: 1 }}>
                                    HFOV: {hFovDeg}° | VFOV: {vFovDeg}°
                                </Typography>
                                <Divider sx={{ borderColor: "#3b4148", my: 1 }} />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={showCameraFrustum}
                                            onChange={toggleCameraFrustum}
                                            size="small"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ color: "#ffffff", fontSize: "12px" }}>
                                            Show Camera FOV Frustum
                                        </Typography>
                                    }
                                />
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* Camera Mounting Menu */}
                    <Accordion sx={{ backgroundColor: "#252a30", color: "#ffffff" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <TuneIcon fontSize="small" sx={{ color: "#ce93d8" }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "13px" }}>
                                    Mounting & Placement
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={wallMounted}
                                        onChange={(e) => setWallMounted(e.target.checked)}
                                        size="small"
                                    />
                                }
                                label={<Typography variant="body2">Wall Mounted</Typography>}
                            />
                            <Button
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ mt: 1, textTransform: "none", color: "#90caf9", borderColor: "#3b4148" }}
                                onClick={() => {
                                    updateObject(object.id, (obj) => {
                                        obj.position.y = Math.max(obj.position.y, 3.0);
                                    });
                                }}
                            >
                                Snap to Wall Structure
                            </Button>
                        </AccordionDetails>
                    </Accordion>

                    {/* PTZ Controls Menu */}
                    <Accordion defaultExpanded sx={{ backgroundColor: "#252a30", color: "#ffffff" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "13px" }}>
                                PTZ Simulation Controls
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0, textAlign: "center" }}>
                            <Box sx={{ display: "inline-block", backgroundColor: "#1e2228", p: 1, borderRadius: "8px" }}>
                                <Grid container spacing={0.5} sx={{ justifyContent: "center", alignItems: "center" }}>
                                    <Grid size={12}>
                                        <Tooltip title="Tilt Up">
                                            <IconButton size="small" onClick={() => nudgePTZ(0, -5, 0)} sx={{ color: "#ffffff" }}>
                                                <ArrowUpwardIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid size={4}>
                                        <Tooltip title="Pan Left">
                                            <IconButton size="small" onClick={() => nudgePTZ(-5, 0, 0)} sx={{ color: "#ffffff" }}>
                                                <ArrowBackIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid size={4}>
                                        <Tooltip title="Zoom In">
                                            <IconButton size="small" onClick={() => nudgePTZ(0, 0, -1)} sx={{ color: "#4fc3f7" }}>
                                                <ZoomInIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid size={4}>
                                        <Tooltip title="Pan Right">
                                            <IconButton size="small" onClick={() => nudgePTZ(5, 0, 0)} sx={{ color: "#ffffff" }}>
                                                <ArrowForwardIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid size={12}>
                                        <Tooltip title="Tilt Down">
                                            <IconButton size="small" onClick={() => nudgePTZ(0, 5, 0)} sx={{ color: "#ffffff" }}>
                                                <ArrowDownwardIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box sx={{ mt: 1 }}>
                                <Tooltip title="Zoom Out">
                                    <Button
                                        size="small"
                                        startIcon={<ZoomOutIcon />}
                                        onClick={() => nudgePTZ(0, 0, 1)}
                                        sx={{ textTransform: "none", color: "#b0b8c4" }}
                                    >
                                        Zoom Out
                                    </Button>
                                </Tooltip>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* Camera Presets Menu */}
                    <Accordion defaultExpanded sx={{ backgroundColor: "#252a30", color: "#ffffff" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <BookmarkIcon fontSize="small" sx={{ color: "#ffb74d" }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "13px" }}>
                                    Presets & Positioning
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<BookmarkIcon />}
                                sx={{ textTransform: "none" }}
                                onClick={() => setPresetOpen(true)}
                            >
                                Open Camera Presets
                            </Button>
                        </AccordionDetails>
                    </Accordion>

                    {/* Preset Modal */}
                    <CameraPresetPopup
                        open={presetOpen}
                        onClose={() => setPresetOpen(false)}
                        camera={cameraObj}
                    />
                </>
            )}
        </Box>
    );
}
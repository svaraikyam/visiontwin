import {
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
    Tooltip,
    Divider,
    Box,
} from "@mui/material";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import VideocamIcon from "@mui/icons-material/Videocam";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { useEditorStore, type TransformMode } from "../../store/editorStore";
import { useSceneStore } from "../../store/sceneStore";
import { ObjectType } from "../../models/ObjectType";
import { SceneObject } from "../../models/SceneObject";
import { CameraObject } from "../../models/CameraObject";
import { ModelObject } from "../../models/ModelObject";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useState } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CameraPresetPopup from "../Camera/CameraPresetPopup";
import CctvLiveFeedModal from "../Camera/CctvLiveFeedModal";

export default function ObjectToolbar() {
    const transformMode = useEditorStore((state) => state.transformMode);
    const setTransformMode = useEditorStore((state) => state.setTransformMode);
    const setActiveCameraId = useEditorStore((state) => state.setActiveCameraId);
    const showCameraFrustum = useEditorStore((state) => state.showCameraFrustum);
    const toggleCameraFrustum = useEditorStore((state) => state.toggleCameraFrustum);

    const objects = useSceneStore((state) => state.objects);
    const selectedId = useSceneStore((state) => state.selected);
    const deleteSelectedObject = useSceneStore((state) => state.deleteSelectedObject);
    const addObject = useSceneStore((state) => state.addObject);
    const updateObject = useSceneStore((state) => state.updateObject);

    const [presetOpen, setPresetOpen] = useState(false);
    const [liveFeedOpen, setLiveFeedOpen] = useState(false);

    const selectedObj = objects.find((o) => o.id === selectedId);
    const isCamera = selectedObj?.type === ObjectType.CAMERA;
    const cameraObj = isCamera ? (selectedObj as CameraObject) : null;

    const handleModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newMode: TransformMode | null
    ) => {
        if (newMode !== null) {
            setTransformMode(newMode);
        }
    };

    const handleClone = () => {
        if (!selectedObj) return;
        let clone: SceneObject;
        if (selectedObj.type === ObjectType.CAMERA) {
            const cam = new CameraObject(`${selectedObj.name} (Copy)`);
            cam.position.copy(selectedObj.position).addScalar(1);
            cam.rotation.copy(selectedObj.rotation);
            clone = cam;
        } else {
            const model = new ModelObject(
                `${selectedObj.name} (Copy)`,
                (selectedObj as ModelObject).modelPath || ""
            );
            model.position.copy(selectedObj.position).addScalar(1);
            model.rotation.copy(selectedObj.rotation);
            model.scale.copy(selectedObj.scale);
            clone = model;
        }
        addObject(clone);
    };

    const handleResetTransform = () => {
        if (!selectedObj) return;
        updateObject(selectedObj.id, (obj) => {
            obj.position.set(0, 0.5, 0);
            obj.rotation.set(0, 0, 0);
            obj.scale.set(1, 1, 1);
        });
    };

    return (
        <>
            <Paper
                elevation={8}
                sx={{
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,

                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 0.5,

                    backgroundColor: "rgba(30, 34, 40, 0.85)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid #3b4148",
                    borderRadius: "32px",

                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
            >
                {/* Transform Modes: Move, Rotate, Scale */}
                <ToggleButtonGroup
                    value={transformMode}
                    exclusive
                    onChange={handleModeChange}
                    size="small"
                    sx={{
                        "& .MuiToggleButton-root": {
                            color: "#b0b8c4",
                            border: "none",
                            borderRadius: "20px !important",
                            px: 1.5,
                            py: 0.5,
                            "&.Mui-selected": {
                                backgroundColor: "#1976d2 !important",
                                color: "#ffffff !important",
                            },
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.08)",
                            },
                        },
                    }}
                >
                    <ToggleButton value="translate">
                        <Tooltip title="Move Tool (Translate)">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <OpenWithIcon fontSize="small" />
                            </Box>
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="rotate">
                        <Tooltip title="Rotate Tool">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <RotateRightIcon fontSize="small" />
                            </Box>
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="scale">
                        <Tooltip title="Scale Tool">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <OpenInFullIcon fontSize="small" />
                            </Box>
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>

                <Divider orientation="vertical" flexItem sx={{ borderColor: "#3b4148", my: 1 }} />

                {/* Camera Frustum Toggle Action */}
                <Tooltip title={showCameraFrustum ? "Hide Camera FOV Frustum" : "Show Camera FOV Frustum"}>
                    <IconButton
                        size="small"
                        onClick={toggleCameraFrustum}
                        sx={{
                            color: showCameraFrustum ? "#00e5ff" : "#8b949e",
                            backgroundColor: showCameraFrustum ? "rgba(0,229,255,0.15)" : "transparent",
                            "&:hover": { backgroundColor: "rgba(0,229,255,0.25)" },
                        }}
                    >
                        {showCameraFrustum ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>

                {/* CCTV Camera Specific Actions */}
                {isCamera && (
                    <>
                        <Tooltip title="Open Live CCTV Camera Feed & Image Capture Window">
                            <IconButton
                                size="small"
                                onClick={() => setLiveFeedOpen(true)}
                                sx={{ color: "#76ff03", "&:hover": { backgroundColor: "rgba(118,255,3,0.15)" } }}
                            >
                                <PhotoCameraIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Camera Preset & ROI Management">
                            <IconButton
                                size="small"
                                onClick={() => setPresetOpen(true)}
                                sx={{ color: "#ffb74d", "&:hover": { backgroundColor: "rgba(255,183,77,0.15)" } }}
                            >
                                <BookmarkIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Simulate CCTV Camera Perspective in Main Viewport">
                            <IconButton
                                size="small"
                                onClick={() => setActiveCameraId(selectedObj.id)}
                                sx={{ color: "#4fc3f7", "&:hover": { backgroundColor: "rgba(79,195,247,0.15)" } }}
                            >
                                <VideocamIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </>
                )}

                {/* Quick Actions: Reset, Duplicate, Delete */}
                <Tooltip title="Reset Transform (Position & Rotation)">
                    <span>
                        <IconButton
                            size="small"
                            disabled={!selectedObj}
                            onClick={handleResetTransform}
                            sx={{ color: "#ffffff" }}
                        >
                            <RestartAltIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>

                <Tooltip title="Duplicate Selected Object">
                    <span>
                        <IconButton
                            size="small"
                            disabled={!selectedObj}
                            onClick={handleClone}
                            sx={{ color: "#ffffff" }}
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>

                <Tooltip title="Delete Selected Object">
                    <span>
                        <IconButton
                            size="small"
                            disabled={!selectedObj}
                            onClick={deleteSelectedObject}
                            sx={{ color: "#f44336", "&:hover": { backgroundColor: "rgba(244,67,54,0.15)" } }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
            </Paper>

            {/* Dialog Popups */}
            {cameraObj && presetOpen && (
                <CameraPresetPopup
                    open={presetOpen}
                    onClose={() => setPresetOpen(false)}
                    camera={cameraObj}
                />
            )}

            {cameraObj && liveFeedOpen && (
                <CctvLiveFeedModal
                    open={liveFeedOpen}
                    onClose={() => setLiveFeedOpen(false)}
                    camera={cameraObj}
                />
            )}
        </>
    );
}

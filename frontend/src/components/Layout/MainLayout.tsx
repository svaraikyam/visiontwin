import Toolbar from "../Toolbar/Toolbar";
import SceneTree from "../SceneTree/SceneTree";
import ObjectInspector from "../Inspector/ObjectInspector";
import SceneCanvas from "../Scene/SceneCanvas";
import { useEditorStore } from "../../store/editorStore";
import { IconButton, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import "./MainLayout.css";

export default function MainLayout() {
    const showInspector = useEditorStore((state) => state.showInspector);
    const toggleInspector = useEditorStore((state) => state.toggleInspector);

    return (
        <div className="visiontwin-editor">
            {/* Top menu */}
            <header className="visiontwin-toolbar">
                <Toolbar />
            </header>

            {/* Main editor area */}
            <main className={`visiontwin-workspace ${showInspector ? "with-inspector" : "no-inspector"}`}>
                {/* Left scene tree */}
                <aside className="visiontwin-scene-tree">
                    <SceneTree />
                </aside>

                {/* Center 3D viewport */}
                <section className="visiontwin-viewport" style={{ position: "relative" }}>
                    <SceneCanvas />
                    {!showInspector && (
                        <Tooltip title="Show Inspector Panel">
                            <IconButton
                                size="small"
                                onClick={toggleInspector}
                                sx={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    zIndex: 20,
                                    backgroundColor: "rgba(30,34,40,0.85)",
                                    color: "#ffffff",
                                    border: "1px solid #3b4148",
                                    "&:hover": { backgroundColor: "#1976d2" },
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </section>

                {/* Right inspector */}
                {showInspector && (
                    <aside className="visiontwin-inspector">
                        <ObjectInspector />
                    </aside>
                )}
            </main>

            {/* Bottom status bar */}
            <footer className="visiontwin-statusbar">
                <span>VisionTwin</span>
                <span>Objects: 0</span>
                <span>Ready</span>
            </footer>
        </div>
    );
}
import Toolbar from "../Toolbar/Toolbar";
import SceneTree from "../SceneTree/SceneTree";
import ObjectInspector from "../Inspector/ObjectInspector";
import SceneCanvas from "../Scene/SceneCanvas";

import "./MainLayout.css";

export default function MainLayout() {
    return (
        <div className="visiontwin-editor">

            {/* Top menu */}
            <header className="visiontwin-toolbar">
                <Toolbar />
            </header>

            {/* Main editor area */}
            <main className="visiontwin-workspace">

                {/* Left scene tree */}
                <aside className="visiontwin-scene-tree">
                    <SceneTree />
                </aside>

                {/* Center 3D viewport */}
                <section className="visiontwin-viewport">
                    <SceneCanvas />
                </section>

                {/* Right inspector */}
                <aside className="visiontwin-inspector">
                    <ObjectInspector />
                </aside>

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
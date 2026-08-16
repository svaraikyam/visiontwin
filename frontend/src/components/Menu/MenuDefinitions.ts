export interface MenuItemDefinition {
    label: string;
    action?: string;
    separator?: boolean;
}

export interface MenuDefinition {
    label: string;
    items: MenuItemDefinition[];
}

export const MAIN_MENUS: MenuDefinition[] = [

    {
        label: "File",
        items: [
            { label: "New Project", action: "file.new" },
            { label: "Open Project", action: "file.open" },
            { label: "Save Project", action: "file.save" },
            { label: "Close Project", action: "file.close" },
            { label: "Import Model", action: "file.importModel" },
            { label: "Render Image", action: "file.renderImage" },
            { label: "Export JSON", action: "file.exportJson" },
        ],
    },

    {
        label: "Edit",
        items: [
            { label: "Undo", action: "edit.undo" },
            { label: "Redo", action: "edit.redo" },
            { label: "Cut", action: "edit.cut" },
            { label: "Copy", action: "edit.copy" },
            { label: "Paste", action: "edit.paste" },
            { label: "Delete", action: "edit.delete" },
            { label: "Clone", action: "edit.clone" },
            { label: "Add Box", action: "edit.addBox" },
        ],
    },

    {
        label: "View",
        items: [
            { label: "Reset View", action: "view.reset" },
            { label: "Fit Selected", action: "view.fitSelected" },
            { label: "Open Video Wall", action: "view.videoWall" },
            { label: "Pop Out Video Wall", action: "view.videoWallPopout" },
            { label: "Zoom Out", action: "view.zoomOut" },
            { label: "Fit Grid", action: "view.fitGrid" },
            { label: "Show / Hide Grid", action: "view.toggleGrid" },
            { label: "Show / Hide Axes", action: "view.toggleAxes" },
        ],
    },

    {
        label: "Object",
        items: [
            { label: "Add Camera", action: "object.addCamera" },
            { label: "Add Model", action: "object.addModel" },
            { label: "Add Box", action: "object.addBox" },
            { label: "Rename / Define", action: "object.rename" },
            { label: "Object Properties", action: "object.properties" },
            { label: "Lock / Unlock", action: "object.lock" },
        ],
    },

    {
        label: "Preferences",
        items: [
            { label: "Preferences...", action: "preferences.open" },
            { label: "Reset Preferences", action: "preferences.reset" },
        ],
    },

    {
        label: "Measurement Tools",
        items: [
            { label: "Calibrate Scale", action: "measurement.calibrate" },
            { label: "Measure Distance", action: "measurement.distance" },
            { label: "Loupe Magnification", action: "measurement.loupe" },
            { label: "Cancel Active Tool", action: "measurement.cancel" },
            { label: "Clear Measurements", action: "measurement.clear" },
        ],
    },

    {
        label: "Report",
        items: [
            { label: "Generate Report", action: "report.generate" },
            { label: "Report Settings", action: "report.settings" },
            { label: "Open Report Options", action: "report.options" },
        ],
    },

    {
        label: "Help",
        items: [
            { label: "Documentation", action: "help.documentation" },
            { label: "About VisionTwin", action: "help.about" },
        ],
    },
];
import { SceneObject } from "./SceneObject";
import { ObjectType } from "./ObjectType";

export interface CameraROI {
    id: string;
    name: string;
    x: number; // percentage X (0..100)
    y: number; // percentage Y (0..100)
    width: number; // percentage width
    height: number; // percentage height
    color?: string;
    status?: "normal" | "warning" | "critical";
    notes?: string;
}

export interface CameraPreset {
    id: string;
    name: string;
    pan: number; // degrees
    tilt: number; // degrees
    zoom: number; // focal length multiplier or mm
    depth: number; // target distance in meters
    description?: string;
    notes?: string;
    thermalPalette?: string;
    rois?: CameraROI[];
}

export class CameraObject extends SceneObject {
    focalLength: number;
    sensorWidth: number;
    sensorHeight: number;
    near: number;
    far: number;
    targetDepth: number; // Target distance in meters (e.g. 10m)
    thermalPalette: string; // "ironbow" | "rainbow" | "whitehot" | "blackhot" | "grayscale"
    presets: CameraPreset[];
    rois: CameraROI[];

    constructor(name: string) {
        super(name, ObjectType.CAMERA);

        this.focalLength = 4.0;
        this.sensorWidth = 6.4;
        this.sensorHeight = 3.6;
        this.near = 0.1;
        this.far = 100.0;
        this.targetDepth = 12.0;
        this.thermalPalette = "ironbow";

        this.presets = [
            {
                id: "preset-1",
                name: "Gate View",
                pan: 0,
                tilt: -15,
                zoom: 4.0,
                depth: 10,
                description: "Main Entrance Monitoring & Gate Perimeter Inspection",
                notes: "Inspect gate lock mechanism and barrier arm status.",
                thermalPalette: "ironbow",
                rois: [
                    { id: "roi-1", name: "Main Gate Barrier", x: 20, y: 30, width: 25, height: 35, color: "#00e5ff", status: "normal", notes: "Hydraulic actuator" },
                    { id: "roi-2", name: "Security Keypad Unit", x: 55, y: 40, width: 15, height: 20, color: "#76ff03", status: "normal", notes: "Biometric reader" },
                ],
            },
            {
                id: "preset-2",
                name: "Hall Overview",
                pan: 45,
                tilt: -30,
                zoom: 6.0,
                depth: 20,
                description: "HVDC Main Hall & Overhead Crane Area",
                notes: "Wide area surveillance for high voltage equipment.",
                thermalPalette: "rainbow",
                rois: [
                    { id: "roi-3", name: "Overhead Crane Rail", x: 10, y: 15, width: 80, height: 15, color: "#ffb74d", status: "warning", notes: "Vibration inspection" },
                ],
            },
            {
                id: "preset-3",
                name: "Transformer 1",
                pan: -60,
                tilt: -10,
                zoom: 12.0,
                depth: 15,
                description: "Close-up Thermal & Bushing Inspection",
                notes: "Monitor bushing T1 temperature delta and oil level gauge.",
                thermalPalette: "ironbow",
                rois: [
                    { id: "roi-4", name: "Thyristor Stack A", x: 30, y: 25, width: 20, height: 30, color: "#f44336", status: "critical", notes: "Overheating check" },
                    { id: "roi-5", name: "HV Bushing B1", x: 60, y: 20, width: 18, height: 40, color: "#ff9800", status: "warning", notes: "Insulation check" },
                ],
            },
            {
                id: "preset-4",
                name: "Valve Hall Cell A",
                pan: 90,
                tilt: -20,
                zoom: 8.0,
                depth: 18,
                description: "Valve Hall Voltage & Electrical Cell Monitoring",
                notes: "Valve cell A thyristor cooling loop and electrical contacts.",
                thermalPalette: "whitehot",
                rois: [
                    { id: "roi-6", name: "Valve Cell Module 01", x: 35, y: 35, width: 30, height: 30, color: "#00e5ff", status: "normal", notes: "Semiconductor stack" },
                ],
            },
        ];

        this.rois = [...this.presets[0].rois!];
    }

    get horizontalFov(): number {
        return 2 * Math.atan(this.sensorWidth / (2 * this.focalLength));
    }

    get verticalFov(): number {
        return 2 * Math.atan(this.sensorHeight / (2 * this.focalLength));
    }
}
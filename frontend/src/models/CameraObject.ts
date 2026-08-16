import { SceneObject } from "./SceneObject";
import { ObjectType } from "./ObjectType";

export class CameraObject extends SceneObject {

    focalLength: number;

    sensorWidth: number;

    sensorHeight: number;

    near: number;

    far: number;

    constructor(name: string) {

        super(
            name,
            ObjectType.CAMERA
        );

        this.focalLength = 4.0;

        this.sensorWidth = 6.4;

        this.sensorHeight = 3.6;

        this.near = 0.1;

        this.far = 100.0;
    }

    get horizontalFov(): number {

        return (
            2 *
            Math.atan(
                this.sensorWidth /
                (2 * this.focalLength)
            )
        );
    }
}
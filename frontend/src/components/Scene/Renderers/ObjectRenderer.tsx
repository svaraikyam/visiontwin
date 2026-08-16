import { SceneObject } from "../../../models/SceneObject";
import { ObjectType } from "../../../models/ObjectType";
import ModelRenderer from "./ModelRenderer";
import CameraRenderer from "./CameraRenderer";

interface Props {
    object: SceneObject;
}

export default function ObjectRenderer({ object }: Props) {
    switch (object.type) {
        case ObjectType.MODEL:
            return <ModelRenderer object={object} />;

        case ObjectType.CAMERA:
            return <CameraRenderer object={object} />;

        default:
            return null;
    }
}
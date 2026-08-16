export const ObjectType = {
    GROUP: "GROUP",
    MODEL: "MODEL",
    CAMERA: "CAMERA",
    LIGHT: "LIGHT",
    SENSOR: "SENSOR",
    PERSON: "PERSON",
    ROBOT: "ROBOT",
    DRONE: "DRONE",
    ZONE: "ZONE",
} as const;

export type ObjectType = (typeof ObjectType)[keyof typeof ObjectType];
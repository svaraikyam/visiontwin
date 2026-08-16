import { SceneObject } from "./SceneObject";
import { ObjectType } from "./ObjectType";

export class ModelObject extends SceneObject{

    modelPath:string;

    constructor(name:string,path:string){

        super(name,ObjectType.MODEL);

        this.modelPath=path;

    }

}
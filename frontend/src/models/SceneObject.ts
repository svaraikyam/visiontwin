import { Vector3, Euler } from "three";
import { ObjectType } from "./ObjectType";
import { v4 as uuid } from "uuid";

export class SceneObject {

    readonly id:string;

    name:string;

    type:ObjectType;

    position:Vector3;

    rotation:Euler;

    scale:Vector3;

    visible:boolean;

    selected:boolean;

    parent:string | null;

    children:string[];

    constructor(
        name:string,
        type:ObjectType
    ){

        this.id=uuid();

        this.name=name;

        this.type=type;

        this.position=new Vector3();

        this.rotation=new Euler();

        this.scale=new Vector3(1,1,1);

        this.visible=true;

        this.selected=false;

        this.parent=null;

        this.children=[];

    }

}
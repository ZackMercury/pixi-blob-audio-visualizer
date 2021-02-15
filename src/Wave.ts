import { Graphics, Matrix, Texture } from "pixi.js";
import Float from "./utils/Float";

const APP_WIDTH = 512;

export enum WaveEvent { FINISHED="finished" }

export default class Wave extends Graphics
{  
    private static STRIPES_TEXTURE:Texture;
    private radius:number;
    private startAngle:number;
    private endAngle:number;
    private lifetime:number = 0;
    private appWidth:number;
    private mx:Matrix;

    constructor(radius:number, startAngle:number, endAngle:number, appWidth:number)
    {
        super();
        if(!Wave.STRIPES_TEXTURE)
            Wave.STRIPES_TEXTURE = Texture.from("res/stripes.png");
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.appWidth = appWidth;
        this.mx = Matrix.IDENTITY.clone().rotate(Math.random()*2*Math.PI);
        this.update(0);
    }
    public update(delta:number):void
    {
        this
            .clear()
            .lineTextureStyle({
                alignment:0,
                width:2,
                alpha:1,
                texture:Wave.STRIPES_TEXTURE,
                matrix: this.mx
            })
            .arc(0, 0, this.radius, this.startAngle, this.endAngle);
        this.radius += 1.5 * delta;

        if(this.radius > this.appWidth * 1.41421356237)
            this.emit(WaveEvent.FINISHED, this);
    }
}
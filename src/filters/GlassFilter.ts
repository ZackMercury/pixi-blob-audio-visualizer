import { Filter, Point } from "pixi.js";
import shaderFrag from "./glass.frag";

class DisplacementFilter extends Filter {
    scale:Point;
    backdropUniformName:string;
    clearColor:number[];

    constructor(scale:number) {
        super(
            null,
            shaderFrag
        );

        this.uniforms.scale = {x: 1, y: 1};

        if (scale === null || scale === undefined) {
            scale = 20;
        }

        this.scale = new Point(scale, scale);

        this.backdropUniformName = 'backdropSampler';
    }

    public apply(filterManager, input, output) {
        this.uniforms.scale.x = this.scale.x;
        this.uniforms.scale.y = this.scale.y;

        // draw the filter...
        filterManager.applyFilter(this, input, output);

        this.clearColor = [0.5, 0.5, 0.5, 1.0];
    }
}
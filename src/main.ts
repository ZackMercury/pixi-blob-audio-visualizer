import { Application, Graphics } from 'pixi.js'
import Float from './utils/Float'
import Vector2 from './utils/Vector2';
import Wave, { WaveEvent } from './Wave';

const APP_WIDTH = 512;
const APP_HEIGHT = 512;

const app:Application = new Application({
    width: APP_WIDTH,
    height: APP_HEIGHT,
    antialias: true
});
app.renderer.backgroundColor = 0x161616;
app.loader.add("res/stripes.png").load();

document.body.appendChild(app.view);
//buttons
let playBtn = document.getElementById("play");

//handlers
playBtn.onclick = ()=>{
    let a:HTMLAudioElement = document.getElementById("ss") as HTMLAudioElement;
    let ctx = new AudioContext();
    let analyzer = ctx.createAnalyser();
    analyzer.fftSize = 32;
    let song = ctx.createMediaElementSource(a);
    song.connect(analyzer);
    song.connect(ctx.destination);
    let data = new Uint8Array(analyzer.frequencyBinCount);
    a.onplay = ()=>ctx.resume();

    let g = new Graphics();

    const BLOB_SUBDIVISIONS:number = 100;
    const BLOB_RADIUS:number = 128;
    const BLOB_OFFSET:number = 40;
    const WAVE_SPAN:number = Math.PI * 0.8 / 2;
    const FREQ = 2;
    const waves:Wave[] = [];
    
    let rotation = 0;
    let lastWaveFramesAgo = 0;
    let vec:Vector2 = new Vector2();

    app.ticker.add((delta)=>{
        analyzer.getByteFrequencyData(data);
        let val = data[5];
        g.clear();
        g.beginFill(0xff5e00);
        for(let i = 0; i <= BLOB_SUBDIVISIONS; i++)
        {
            let angle:number = i / BLOB_SUBDIVISIONS * 2 * Math.PI;
            let radius = BLOB_RADIUS + BLOB_OFFSET * val/128.0 * Math.cos(angle*FREQ); 
            if(i == 0)
                g.moveTo(radius * Math.cos(angle), radius * Math.sin(angle))
            else
                g.lineTo(radius * Math.cos(angle), radius * Math.sin(angle))
        }

        if(val > 70 && lastWaveFramesAgo > 20)
        {
            //generate wave
            for(let i = 0; i < FREQ; i ++)
            {
                let angle = rotation + i / FREQ * 2 * Math.PI;
                let wave = new Wave(BLOB_RADIUS*0.7, angle - WAVE_SPAN, angle + WAVE_SPAN, APP_WIDTH);
                vec.x = Math.sqrt(val) * 6 * Math.cos(angle);
                vec.y = Math.sqrt(val) * 6 * Math.sin(angle);
                wave.position = Vector2.fromPoint(g.position).add(vec);
                
                app.stage.addChildAt(wave, 0);
                waves.push(wave);
                wave.addListener(WaveEvent.FINISHED, (w:Wave)=>{
                    waves.splice(waves.indexOf(w), 1);
                    app.stage.removeChild(w);
                    w.removeListener(WaveEvent.FINISHED);
                });
            }

            lastWaveFramesAgo = 0;
        }
        g.endFill();

        waves.forEach(wave=>wave.update(delta));
        g.rotation = rotation;
        rotation += 0.01 * delta;

        lastWaveFramesAgo += delta;
    });
    g.position.x = APP_WIDTH/2;
    g.position.y = APP_HEIGHT/2;
    app.stage.addChild(g);
    a.play();
};
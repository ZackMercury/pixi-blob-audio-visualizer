varying vec2 vTextureCoord;

uniform vec2 scale;

uniform sampler2D uSampler;
uniform sampler2D backdropSampler;

uniform vec4 filterArea;
uniform vec4 filterClamp;

void main(void)
{
  vec4 map =  texture2D(uSampler, vTextureCoord);

  map -= 0.5;
  map.xy *= scale / filterArea.xy;

  vec2 dis = clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), filterClamp.xy, filterClamp.zw);
  gl_FragColor = texture2D(backdropSampler, dis);
}
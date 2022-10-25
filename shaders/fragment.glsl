uniform sampler2D uTexture;

void main() {
 	vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
 	vec4 textureColor = texture2D(uTexture, uv);

	if(textureColor.a < .4) discard;
	vec3 color = vec3(.788, .3, .3);
 	gl_FragColor = vec4(textureColor.xyz * color, 1.0); 
}
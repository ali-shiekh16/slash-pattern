	attribute vec3 prevPosition;

  uniform mat4 uRotationMatrix;

  uniform float uSize;
  uniform float uTime;
	uniform vec2 uCursor;

  void main() {
    vec4 rotatedPosition = uRotationMatrix * vec4(position, 1.0);
    vec4 modelPosition = modelMatrix * rotatedPosition;


    // vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // * For assmebling all points at cursor position. 
    // modelPosition.xy = mix(modelPosition.xy, uCursor.xy, lerpPoint);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize;
    gl_PointSize *= (1.0 / -viewPosition.z);
  }
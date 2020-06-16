
export const vertexShader = `
uniform mat4 transformMatrix;
attribute vec2 vertexCoords;

uniform float pointSize;
void main() {
   gl_Position = transformMatrix  * vec4(vertexCoords.xy,0.0,1.0); 
   gl_PointSize = 10.0; // pointSize;
}
`

export const fragmentShader = `
//precision mediump float;
//uniform bool antialiased;
/*
void main() {
   float dist = distance( gl_PointCoord, vec2(0.5) );
   if (!antialiased) {
      if (dist > 0.5)
         discard;
         gl_FragColor = vec4(1,0,0,1);
      }
      else {
   float alpha = 1.0 - smoothstep(0.45,0.5,dist);
   gl_FragColor = vec4(1,0,0,alpha);
   //}
}
*/
void main(){
   gl_FragColor = vec4(1.0,0.0,0.0,1);
}
`

//
// Initialize a shader program, so WebGL knows how to draw our data
//
export function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
export function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}


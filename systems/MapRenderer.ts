import * as L from "leaflet"
import {State} from "../State"
import {vertexShader,fragmentShader, initShaderProgram} from "../webgl"


const EARTH_EQUATOR = 40075016.68557849
const EARTH_RADIUS = 6378137.0
const TILE_SIZE = 256.0

export const MapRendererFactory = (S:State, map:any)=>{
let FIRST = true;
   // Map setup

   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       maxZoom: 19,
       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map);

   let canvas:any = L.DomUtil.create('canvas', 'leaflet-canvas-overlay');
   var size = map.getSize();
   canvas.width = size.x;
   canvas.height = size.y;

   map._panes.overlayPane.appendChild(canvas);        
   let topLeft = map.containerPointToLayerPoint([0, 0]);
   L.DomUtil.setPosition(canvas, topLeft);

   L.DomUtil.addClass(canvas, 'leaflet-zoom-hide');

   //let ctx = canvas.getContext("2d")

   const gl = canvas.getContext("webgl")
   const shaderProgram = initShaderProgram(gl,vertexShader,fragmentShader)
   const programInfo = {
      program: shaderProgram,
      attributes: {
         vertexCoords: gl.getAttribLocation(shaderProgram, 'vertexCoords'),
      },
      uniforms: {
         transformMatrix: gl.getUniformLocation(shaderProgram, 'transformMatrix'),
      },
   }
   console.log(programInfo)

   gl.useProgram(shaderProgram)

   let vertexAttributeBuffer = gl.createBuffer()

   let pixelsToWebGLMatrix = new Float32Array(16)

   gl.viewport(0,0,canvas.width,canvas.height)
   let mapMatrix = new Float32Array(16);

   // Debug stuff
   // Ago
   map.setView([8,8],7)

   return function(){

      //let topleft = L.Lat
      let bounds = map.getBounds()
      let topleft = new L.LatLng(
         bounds.getNorth(),bounds.getWest()
      )
      //console.log(topleft)

      //let offset = map.latLngToContainerPoint(topleft)
      mapMatrix.set(projection(canvas.width,canvas.height))

      // Rescale
      let scale = Math.pow(2,map.getZoom())
      scaleMatrix(mapMatrix,scale,scale)
      
      // Window position
      let offset = LatLongToPixelXY(topleft.lat+1,topleft.lng)
      translateMatrix(mapMatrix,-offset.x,-offset.y)
      
      // Proper centering
      let llzero = LatLongToPixelXY(0,0)
      translateMatrix(mapMatrix,llzero.x,llzero.y)
    
      if(FIRST){
         console.log(bounds)
         console.log(topleft)
         console.log(llzero)
         console.log(mapMatrix)
         console.log(offset)
         FIRST = !FIRST
      }


      gl.clearColor(0,0,0,0.1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      let topLeft = map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, topLeft);

      //ctx.clearRect(0,0,canvas.width,canvas.height)

      let allPoints = S.Components.Point.filter(n=>n)
      let pbuf = new Float32Array(allPoints.length*2)

      allPoints.forEach((pts,idx)=>{
         pbuf[idx*2] = pts[0]
         pbuf[(idx*2)+1] = pts[1] * -1
      })


      S.Components.Point.forEach((p,idx)=>{
         //let cp = map.latLngToContainerPoint({lon:p[0],lat:p[1]})

         //let size = S.Components.Size[idx]
         //let color = S.Components.Style[idx]

         //ctx.fillStyle = color
         //ctx.fillRect(cp.x-(size/2),cp.y-(size/2),size,size)
      })

      /*
      if(FIRST && pbuf.length > 2){
         console.log(pbuf)
         FIRST = !FIRST
      }
      */


      //var coord = gl.getAttribLocation(shaderProgram, "vertexCoords");

      gl.bindBuffer(gl.ARRAY_BUFFER,vertexAttributeBuffer);

      gl.vertexAttribPointer(programInfo.attributes.vertexCoords, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(programInfo.attributes.vertexCoords)

      gl.bufferData(gl.ARRAY_BUFFER, pbuf, gl.DYNAMIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER,null)

      gl.uniformMatrix4fv(programInfo.uniforms.transformMatrix,
         false,
         mapMatrix)

      gl.drawArrays(gl.POINTS, 0, pbuf.length/2);
   }
}

/*
function LatLongToPixelXY(latitude, longitude) {
   var pi_180 = Math.PI / 180.0;
   var pi_4 = Math.PI * 4;
   var sinLatitude = Math.sin(latitude * pi_180);
   var pixelY = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (pi_4)) * 256;
   var pixelX = ((longitude + 180) / 360) * 256;

   var pixel = { x: pixelX, y: pixelY };

   return pixel;
}
function LatLongToPixelXY(lat, lon) {
   let initialResolution = 2 * Math.PI * 6378137 / 256; // at zoomlevel 0
   let originShift = 2 * Math.PI * 6378137 / 2;

   // -- to meters
   var mx = lon * originShift / 180;
   var my = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
   my = my * originShift / 180;


   // -- to pixels at zoom level 0

   var res = initialResolution;
   let x = (mx + originShift) / res;
   let y = (my + originShift) / res;


   return { x: x, y: 256- y };
}
*/

let matrixStuff = {
   translation: function(tx,ty){
      return [
         1, 0, 0, 0,
         0, 1, 0, 0,
         0, 0, 1, 0,
         tx,ty,0, 1,

      ]
   },
   rotation: function(rad){
      var c = Math.cos(rad)
      var s = Math.sin(rad)
      return [
          c,-s, 0, 0,
          s, c, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,
      ]
   },
   scaling: function(sx,sy){
      return [
        sx, 0, 0, 0,
         0,sy, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1,
      ]
   }
}

function LatLongToPixelXY(lat,lng) {
   let p = {lat:lat,lng:lng}
   var sinLat = Math.sin(p.lat * Math.PI / 180.0);
   var pixelX = ((p.lng + 180) / 360) * TILE_SIZE;
   var pixelY = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (Math.PI * 4)) * TILE_SIZE;
   return {x:pixelX, y:pixelY};
}

function translateMatrix(matrix, tx, ty) {
   // translation is in last column of matrix
   matrix[12] += matrix[0] * tx + matrix[4] * ty;
   matrix[13] += matrix[1] * tx + matrix[5] * ty;
   matrix[14] += matrix[2] * tx + matrix[6] * ty;
   matrix[15] += matrix[3] * tx + matrix[7] * ty;
}

function scaleMatrix(matrix, scaleX, scaleY) {
   // scaling x and y, which is just scaling first two columns of matrix
   matrix[0] *= scaleX;
   matrix[1] *= scaleX;
   matrix[2] *= scaleX;
   matrix[3] *= scaleX;

   matrix[4] *= scaleY;
   matrix[5] *= scaleY;
   matrix[6] *= scaleY;
   matrix[7] *= scaleY;
}

function projection(w,h){
   return [
       2/w, 0  , 0  , 0  ,
       0  ,-2/h, 0  , 0  ,
       0  , 0  , 0  , 0  ,
      -1  , 1  , 0  , 1  ,
   ]
}

function mercatorToPixels(p){
   return { 
      x: (p.x + (EARTH_EQUATOR / 2.0)) / (EARTH_EQUATOR / TILE_SIZE),
      y: (p.y - (EARTH_EQUATOR / 2.0)) / (EARTH_EQUATOR / - TILE_SIZE)
   }
}

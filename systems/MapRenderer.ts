import * as L from "leaflet"
import {State} from "../State"

export const MapRendererFactory = (S:State, map:any)=>{
   // Map setup
   // Should this be here?
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       maxZoom: 19,
       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map);

   // Canvas setup
   let canvas:any = L.DomUtil.create('canvas', 'leaflet-canvas-overlay');

   const fitCanvas = ()=>{
      console.log("fitting")
      var size = map.getSize();
      console.log(size)
      canvas.width = size.x;
      canvas.height = size.y;
   }
   
   fitCanvas()
   map.addEventListener("resize",fitCanvas)

   map._panes.overlayPane.appendChild(canvas);        
   let topLeft = map.containerPointToLayerPoint([0, 0]);
   L.DomUtil.setPosition(canvas, topLeft);

   L.DomUtil.addClass(canvas, 'leaflet-zoom-hide');

   let ctx = canvas.getContext("2d")

   // Debug stuff
   // Ago
   map.setView([8,8],7)

   return function(){
      let topLeft = map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, topLeft);

      ctx.clearRect(0,0,canvas.width,canvas.height)
      /*
       * Debug rectangle
      ctx.fillStyle="rgba(1,1,0,0.5)"
      ctx.fillRect(0,0,canvas.width,canvas.height)
      */

      S.Components.Point.forEach((p,idx)=>{
         let cp = map.latLngToContainerPoint({lon:p[0],lat:p[1]})

         let size = S.Components.Size[idx]
         let color = S.Components.Style[idx]

         ctx.fillStyle = color
         ctx.fillRect(cp.x-(size/2),cp.y-(size/2),size,size)
      })
   }
}

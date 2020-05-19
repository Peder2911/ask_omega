import * as L from "leaflet"
import {State} from "../State"

export const MapRendererFactory = (S:State, el:string)=>{
   // Map setup
   let map:any = new L.Map(el,{zoomAnimation: false})

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

   let ctx = canvas.getContext("2d")

   // Debug stuff
   // Ago
   map.setView([-12,18],7)

   return function(){
      let topLeft = map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, topLeft);

      ctx.clearRect(0,0,canvas.width,canvas.height)

      S.Components.Point.forEach((p,idx)=>{
         let cp = map.latLngToContainerPoint({lon:p.coordinates[0],lat:p.coordinates[1]})


         let fatalities = S.Components.Fatalities[idx]
         if(fatalities){
            ctx.fillStyle = "#f0a00099"
         } else {
            ctx.fillStyle = "#00a0b099"
         }

         let size = fatalities ? Math.log(fatalities)*4 : 8
         ctx.fillRect(cp.x,cp.y,size,size)
      })
   }
}

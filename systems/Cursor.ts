
import {State} from "../State"

/*
const distance = (a:[number,number],b:[number,number])=>{
   const sqr = (x)=> Math.pow(x,2)
   return Math.sqrt(
      sqr(a[0] - b[0]) + sqr(a[1] - b[1])
   )

}

const nearestNeighbour = (a:[number,number],points:[number,number][]):number=>{
   let distances = points.map(b=>distance(a,b))
   return distances.findIndex(d=>d==Math.min(...distances))
}
*/

export const CursorFactory = (S:State,map: L.Map)=>{
   let cursorIdx = S.Index.get()
   S.Components.Point[cursorIdx] = new Float32Array([0,0])/*{
      "type": "Point",
      "coordinates": [0,0]
   }*/

   let mapPos: number[] 
   document.addEventListener("mousemove",evt=>{
      mapPos = Object.values(map.containerPointToLatLng([evt.clientX,evt.clientY]))
      mapPos.reverse()
   })

   return () =>{
      if(mapPos){
         S.Components.KDBush.forEach(bush=>{
            let highlighted = bush.within(mapPos[0],mapPos[1],0.5)
            
            /*
            let points = highlighted.map(idx=>S.Components.Point[idx].coordinates)
            let nearest = nearestNeighbour(mapPos,points)
            let nearestIdx = highlighted[nearest]
            let nearestPt = S.Components.Point[nearestIdx]
            let d = distance(mapPos,nearestPt.coordinates)
            */

            S.Components.Highlighted.forEach((_,idx)=>{
               S.Components.Highlighted[idx] = false
            })

            highlighted.forEach((idx:number)=>{
               S.Components.Highlighted[idx]=true
            })

            //if(d<0.01){
               //S.Components.Highlighted[nearestIdx] = true
            //}
         })
      }
   }
}

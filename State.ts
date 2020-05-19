
import {MultiPolygon,Point} from "geojson"

export class State {
   Components = new Components()

   Entities: number[] = []
   Index = new Index(this)

   Systems: any[] = []
}

class Components {
   // Grouping
   Layer: number[] = []

   // Rendering 
   Style: string[] = []
   Visible: boolean[] = []

   // Geometry

   Point: Point[] = []
   Polygon: MultiPolygon[] = []

   In: number[][] = []

   // Metadata
   Name: string[] = []
   EventType: string[] = []
   Fatalities: number[] = []

   Datestring: string[] = []
}

class Index {
   state: State

   constructor(state){
      this.state = state
   }

   idx = 0
   get() {
      let idx

      if(this.idx <= 9007199254740991){
         idx = this.idx ++
      } else {
         console.log("WARNING reset index!!")
         idx = this.idx = 1
      }
      
      this.state.Entities.push(idx)
      return idx
   }
}

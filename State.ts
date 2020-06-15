
import {MultiPolygon,Point} from "geojson"
import KDBush from "kdbush"

export class State {
   Components = new Components()

   Entities: number[] = []


   Systems: any[] = []

   Index = new Index(this)
}

class Components {
   // Grouping
   Layer: number[] = []

   // Rendering 
   Style: string[] = []
   Visible: boolean[] = []
   Size: number[] = []
   Highlighted: boolean[] = []
   Refresh: boolean[] = []

   // Geometry

   Point: Point[] = []
   Polygon: MultiPolygon[] = []
   SpIndex: number[] = []
   KDBush: KDBush[] = []

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

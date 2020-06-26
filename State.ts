
import {MultiPolygon} from "geojson"
import {SparseKDBush} from "./shims"

export class State {
   Entities: number[] = []
   Components = new Components()
   Systems: (()=>void)[] = []

   Index = new Index(this)

   Flags = new Flags() 

   Iterate(){
      this.Systems.forEach(s=>s())
      this.Flags.update()
   }
}

type flagkeys = keyof Flags["_flags"]

class Flags {
   /*
    * This class is a bit contrived, basically just a wrapper
    * around a map of booleans. However, the housekeeping 
    * around these functions is important, because it makes
    * the flags only toggle after a full iteration. That way,
    * systems can check/uncheck/toggle flags while not
    * affecting the other systems in that iteration.
    */

   _flags = {
      RefreshAll: false,
      NewData: false
   }


   _todo: (()=>void)[] = [] 

   _operations = {
      check: (flag:flagkeys)=>{
         console.log(`Checking ${flag}`)
         return ()=>this._flags[flag] = true
      },
      uncheck: (flag:flagkeys)=>{
         console.log(`Unchecking ${flag}`)
         return ()=>this._flags[flag] = false
      },
      toggle: (flag:flagkeys)=>{
         console.log(`Toggling ${flag}`)
         return ()=>this._flags[flag] = !this._flags[flag] 
      }
   }

   get(flag:flagkeys){
      return this._flags[flag]
   }

   check(flag:flagkeys){
      this._todo.push(this._operations.check(flag))
   }
   uncheck(flag:flagkeys){
      this._todo.push(this._operations.uncheck(flag))
   }
   toggle(flag:flagkeys){
      this._todo.push(this._operations.toggle(flag))
   }
   update(){
      this._todo.forEach((fn)=>fn())
      this._todo = []
   }
}

class Components {
   // Grouping
   Layer: number[] = []

   // Rendering 
   Style: string[] = []
   Visible: boolean[] = []
   Size: number[] = []

   Highlighted: boolean[] = []
   Selected: boolean[] = []
   Refresh: boolean[] = []

   // Geometry

   Point: Float32Array[] = []
   Polygon: MultiPolygon[] = []
   SpIndex: number[] = []
   KDBush: SparseKDBush[] = []

   In: number[][] = []

   // Metadata
   Name: string[] = []
   EventType: string[] = []
   Fatalities: number[] = []

   EvtDate: Date[] = []
}

class Index {
   state: State

   constructor(state:State){
      this.state = state
   }

   idx = 0
   get() {
      let idx: number

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

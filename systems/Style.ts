
import {State} from "../State"
import {indicesOf} from "../utils"
import {color} from "d3"
//import {sum} from "ramda"

export const StyleFactory = (S:State)=>{

   return () => {
      if(S.Flags.get("RefreshAll")){
         console.log("Styling points")
         // TODO change to indicesOf "visible"
         let todo = indicesOf(S.Components.Refresh,true)
         todo.forEach(idx=>{

            let size = 5 
            let col = color("red") 
            col.opacity = 0.
            
            if(S.Components.Fatalities){
               let fat = S.Components.Fatalities[idx]
               if(fat){size += Math.log(fat)*4}
            }

            if(S.Components.Selected[idx]){
               col.opacity=1
            }
            S.Components.Size[idx] = size 
            S.Components.Style[idx] = col.toString()
         })
         S.Flags.uncheck("RefreshAll")
      }
   }
}

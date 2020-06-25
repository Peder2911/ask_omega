
import {State} from "../State"
import {indicesOf} from "../utils"
import {color} from "d3"
//import {sum} from "ramda"

export const StyleFactory = (S:State)=>{

   return () => {
      let todo = indicesOf(S.Components.Refresh,true)

      todo.forEach(idx=>{

         let size = 5 
         let col = color("red") 
         
         if(S.Components.Fatalities){
            let fat = S.Components.Fatalities[idx]
            if(fat){size += Math.log(fat)*4}
         }

         if(!S.Components.Highlighted[idx]){
            col.opacity=0.1
         } else {
            //size += 10
         }

         S.Components.Size[idx] = size 
         S.Components.Style[idx] = col.toString()
         S.Components.Refresh[idx] = false
      })
   }
}


import {State} from "../State"
import {indicesOf} from "../utils"
import {color} from "d3"
//import {sum} from "ramda"

export const StyleFactory = (S:State)=>{

   return () => {
      let todo = indicesOf(S.Components.Refresh,true)

      todo.forEach(idx=>{

         let size = 5 
         if(S.Components.Fatalities){
            let fat = S.Components.Fatalities[idx]
            if(fat){size += Math.log(fat)*4}
         }

         let col = color("red") 
         /*
         let anyHighlighted = sum(S.Components.Highlighted) > 0
         */
         if(!S.Components.Highlighted[idx]){
            col.opacity=0.1
         } else {
            //size += 10
         }

         /*
         if(S.Components.EventType[idx]){
            switch(S.Components.EventType[idx]){
               case "Riots": 
                  color = "red"; break
               case "Special": 
                  color = "teal"; break
               default:
                  color = "blue"

            }
         } else {
            color = "green"
         }

         if(S.Components.Highlighted[idx]){
            size += 30 
            color = "purple"
         }
         */

         S.Components.Size[idx] = size 
         S.Components.Style[idx] = col.formatRgb()
      })
   }
}

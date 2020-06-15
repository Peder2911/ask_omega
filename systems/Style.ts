
import {State} from "../State"
import {indicesOf} from "../utils"

export const StyleFactory = (S:State)=>{
    

   return () => {
      let todo = indicesOf(S.Components.Refresh,true)
      //let s = 0
      todo.forEach(idx=>{
         //s++

         let size = 5 
         if(S.Components.Fatalities){
            let fat = S.Components.Fatalities[idx]
            if(fat){size += Math.log(fat)*4}
         }

         let color
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

         S.Components.Size[idx] = size 
         S.Components.Style[idx] = color
         //S.Components.Refresh[idx] = false
      })

      /*
      if( s > 0 ){
         console.log(`Styled ${s} things`)
      }
      */
   }
}

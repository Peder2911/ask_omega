import {State} from "../State"

export const FilterFactory = (S:State):(()=>void)=>{

   return function(){
      if(S.Flags.Filter){

      }
   }
}

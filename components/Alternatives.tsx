
import {h} from "preact"
import {curry} from "ramda"

export default function Alternatives(onchange:any,alternatives:string[]){
   let css = `
      div.alternatives-component {
         display: grid;
      }
   `
   
   return (
      <div class="alternatives-component">
         {alternatives.map((al:string)=>{
            return (
               <button onClick={curry(onchange)(al)}>
                  {al}
               </button>
            )
         })}
         <style scoped>
            {css}
         </style>
      </div>
   )
}

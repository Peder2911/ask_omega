
import {h} from "preact"

export default function selector(alternatives:string[],callback:((x?:string)=>void)){
   const css = `
   .wrapper{
      display:grid;
      grid-template-columns: 1fr
   }
   `

   return (
      <div class="wrapper">
         <button onClick={()=>callback()}>All</button>
         {alternatives.map((alt:string)=>{
            return (
               <button onClick={()=>callback(alt)}>{alt}</button>
            )
         })}
         <style scope>{css}</style>
      </div>
   )
}

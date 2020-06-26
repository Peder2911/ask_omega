
import {State} from "../State"
import {h,render} from "preact"
import "../sass/ui.sass"
import {indicesOf} from "../utils"

//import TodoList from "../components/todo"
import Selector from "../components/Selector"

export const UiFactory = (S:State):(()=>void)=>{
   let uiRoot = document.querySelector("div#overlay")

   let App: any 
   let alternatives: string[]

   function filter(target?:string){
      console.log(target)
      let which = indicesOf(S.Components.EventType,target)
      let mask = Array(S.Components.EventType.length)
      if(target){
         which.forEach((idx)=>mask[idx]=true)
         S.Components.Selected = mask
      } else {
         console.log("select all")
         S.Components.Selected = S.Components.EventType.map(()=>true)
      }
      S.Flags.check("RefreshAll")
   }

   alternatives = []

   return ()=>{
      if(S.Flags.get("NewData")){
         filter()
         console.log("Setting alternatives")
         alternatives = [... new Set(S.Components.EventType)]
         alternatives = alternatives.filter(e=>e)
         S.Flags.uncheck("NewData")
      }
      App = (
         <div id="ui-root">
            <div id="header" class="row">
               Head
            </div>
            <div id="content" class="row">
               <div class="col">
                  {Selector(alternatives,filter)}
               </div>
               <div class="col">
               </div>
           </div>
            <div id="footer" class="row">
               Foot
            </div>
         </div>
      )

      render(App,uiRoot)
   }
}

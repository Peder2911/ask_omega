
import {State} from "../State"
import {h,render} from "preact"
import "../sass/ui.sass"

//import TodoList from "../components/todo"
import Alternatives from "../components/Alternatives"

export const UiFactory = (S:State):(()=>void)=>{
   let uiRoot = document.querySelector("div#overlay")
   const log = ()=>{
      console.log("something happened!")
   }

   const App = (
      <div id="ui-root">
         <div id="header" class="row">
            Head
         </div>
         <div id="content" class="row">
            <div class="col">
               {Alternatives((e:string,evt:MouseEvent)=>console.log(e), 
                              ["a","b","c"]
               )}
            </div>
            <div class="col">
            </div>
            <div class="col">
               Right
            </div>
         </div>
         <div id="footer" class="row">
            Foot
         </div>
      </div>
   )
   
   render(App,uiRoot)

   return ()=>{
   }
}

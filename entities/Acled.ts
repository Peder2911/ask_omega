
import {Point,Feature} from "geojson"
import {State} from "../State"

type AcledFeature = {
   "geometry": Point,
   "properties": {
      "eventType":string,
      "date":string,
      "fatalities":number
      }
   }

export const createAcledEvent = function(S: State,SpIndex: number, r: Feature & AcledFeature):number{
      let index = S.Index.get()

      S.Components.Point[index] = r.geometry 
      S.Components.EventType[index] = r.properties.eventType
      S.Components.Fatalities[index] = r.properties.fatalities
      S.Components.Datestring[index] = r.properties.date

      S.Components.Refresh[index] = true 

      return index
}

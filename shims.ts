
import KDBush from "kdbush"

export class SparseKDBush {
   // The KDBush implementation does not work with
   // sparse matrices, which is the foundation of the
   // ECS system used here. Therefore, i wrap it
   // and make it return indices mapped to the indices
   // in the sparse matrix which contains the actual entities. 
   _indices: number[] = []
   _bush: KDBush<any>

   constructor(indices: number[],data:any,fna:any,fnb:any){
      this._bush = new KDBush(data,fna,fnb)
      this._indices = indices
   }

   within(x:number,y:number,r:number){
      return this._realIndices(
         this._bush.within(x,y,r)
      )
   }

   range(minx:number,miny:number,maxx:number,maxy:number){
      return this._realIndices(
         this._bush.range(minx,miny,maxx,maxy)
      )
   }

   _realIndices(bushindices:number[]){
      return bushindices.map((idx:number)=>this._indices[idx])
   }
}

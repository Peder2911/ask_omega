
// Find all indices corresponding to e in a.
export const indicesOf = (a: any[], e: any): number[]=>{
   let idxs = []
   let first = a.indexOf(e)
   if(first === -1){
      return []
   }

   let last = a.lastIndexOf(e)
   if(first === last){
      return [first]
   }

   idxs.push(first)

   let current = first
   while(current != last){
      current = a.indexOf(e, current + 1)
      idxs.push(current)
   }

   return idxs
}

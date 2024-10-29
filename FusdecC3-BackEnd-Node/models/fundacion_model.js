const mongoose = require ("mongoose"); 
const { Schema } = mongoose; 

const fundacionSchema =new Schema ({ 
   /*fundacionId: { 
    Type: Schema.Types.objectId,
    default: () => new mongoose.Types.objectId (),  
   },*/ 
   nombreFundacion: { 
    type: String, 
    required: true,
   }, 
   estadoFundacion: {
      type: Boolean,
      default: true,
      required: true,
    },
comando:[
    {
         type: Schema.Types.ObjectId,
         ref: "Comando",
    },
], 

}); 
 
const Fundacion= mongoose.model("Fundacion",fundacionSchema);
module.exports= Fundacion; 

const mongoose = require ("mongoose"); 
const { Schema } = mongoose; 

const Fundacionschema =new Schema ({ 
   /*fundacionId: { 
    Type: Schema.Types.objectId,
    default: () => new mongoose.Types.objectId (),  
   },*/ 
   nombreFundacion: { 
    type: String, 
    opcional: true,
   }, 
   estadoFundacion: {
      type: Boolean,
      default: true,
      opcional: true,
    },
comandos:[
    {
         type: Schema.Types.ObjectId,
         ref: "Comando",
    },
], 

}); 
 
const Fundacion= mongoose.model("Fundacion",Fundacionschema);
module.exports= Fundacion; 

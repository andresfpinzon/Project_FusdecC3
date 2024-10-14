const mongoose = require ("mongoose"); 
const { Schema } = mongoose; 

const fundacionschema =new Schema ({ 
   fundacionId: { 
    Type: Schema.Types.objectId,
    default: () => new mongoose.Types.objectId (),  
   }, 
   nombreFundacion: { 
    type: String, 
    required: true,
   }, 

comandos:[
    {
         type: Types.schema.objectId,
         ref: "Comandos",
    },
], 

}); 
 
   const Fundacion= mongoose.model("Fundacion",ComandosSchema);
   module.exports= Fundacion; 

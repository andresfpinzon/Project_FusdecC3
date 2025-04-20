const mongoose = require ("mongoose"); 
const { Schema } = mongoose; 

const fundacionSchema =new Schema ({ 

   nombreFundacion: { 
    type: String, 
   }, 
   estadoFundacion: {
      type: Boolean,
      default: true,
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

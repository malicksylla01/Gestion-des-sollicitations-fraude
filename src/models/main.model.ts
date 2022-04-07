import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    nom: {
        type: String,
        required:false
    },
    prenoms:{
        type: String,
        required:false
    },
   numero_de_telephone:{
       type: String,
       required: true,
       minLength:10,
       maxLength: 10
   },
   mail:{
       type: String,
       required: false
   },

   description:{
       type: String,
       required:true

   },


},
{timestamps: true});

/*
|--------------------------------------------
| ADDITIONAL SCHEMAS APPEAR HERE
|--------------------------------------------
*/
export const User = mongoose.model("User", clientSchema);
clientSchema.path('_id')

const mongoose =  require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const userShema = new Schema({
    name: {type:String, require:true},
    email: {type:String, require:true,unique: true},
    password: {type:String, require:true, minlength:6},
    image: {type:String, require:true},
    places: [{ type: mongoose.Types.ObjectId, require: true, ref:'Place'}],
})

userShema.plugin(uniqueValidator)

module.exports=mongoose.model('User',userShema)
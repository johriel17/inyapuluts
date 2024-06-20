import mongoose from "mongoose";

const liquorSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
  }, { timestamps: true });
  
const Liquor = mongoose.model('Liquor', liquorSchema);

export default Liquor
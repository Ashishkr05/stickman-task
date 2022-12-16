import { model, Schema } from "mongoose";

const DataSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

export default model("Data", DataSchema);

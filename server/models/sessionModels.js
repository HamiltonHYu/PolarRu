const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sessionId: String,
  userId: String,
})

const Session = mongoose.model("Session". sessionSchema);

module.export = {
  Session,
}

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopLawyersListSchema = new Schema({
  name: {
    type: String,
  },

  image: {
    type: String,
  },
  description: {
    type: String,
  },
});

const TopLawyersList = mongoose.model("TopLawyerList", TopLawyersListSchema);

module.exports = TopLawyersList;

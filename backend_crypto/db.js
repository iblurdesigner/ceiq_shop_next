const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://adminceiq:DAgXZT1oh0tCDINy@clusterceiqcrypto.hiplbbo.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const paymentSchema = new mongoose.Schema({
  id: String,
  itemId: String,
  paid: Boolean,
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = {
  Payment,
};

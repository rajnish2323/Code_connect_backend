const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref : "User"
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"User"
  },
  status: {
    type: String,
    required: true,
    enum: ['ignored', 'interested', 'accepted', 'rejected']
  }
}, {
  timestamps: true
});

// ✅ Register the schema with a model name
const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;

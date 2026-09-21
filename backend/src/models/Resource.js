import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: [
        "Playbook",
        "Whitepaper",
        "Industry Report",
        "Enterprise Technology Trends",
        "Buyer Insights",
      ],
    },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    fileUrl: { type: String },
    externalUrl: { type: String },
    status: { type: String, enum: ["Draft", "Published"], default: "Published" },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;

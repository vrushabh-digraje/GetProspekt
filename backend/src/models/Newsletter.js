import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issueNumber: { type: Number },
    frequency: { type: String, enum: ["Weekly", "Monthly"], default: "Weekly" },
    releaseDate: { type: String, default: () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
    summary: { type: String, required: true },
    content: { type: String },
    subscriberCount: { type: Number, default: 0 },
    status: { type: String, enum: ["Draft", "Sent", "Scheduled"], default: "Draft" },
  },
  {
    timestamps: true,
  }
);

const Newsletter = mongoose.model("Newsletter", newsletterSchema);
export default Newsletter;

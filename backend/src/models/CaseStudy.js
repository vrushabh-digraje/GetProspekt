import mongoose from "mongoose";

const caseStudySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    label: { type: String, default: "Case Study" },
    description: { type: String, required: true },
    image: { type: String, required: true },
    stats: [[{ type: String }]], // e.g. [["125", "BANT-qualified leads delivered"], ...]
    profile: { type: String, required: true },
    objective: { type: String, required: true },
    spec: [{ type: String }],
    executed: [{ type: String }],
    owned: { type: String },
    client: { type: String },
    status: { type: String, enum: ["Draft", "Published"], default: "Published" },
  },
  {
    timestamps: true,
  }
);

const CaseStudy = mongoose.model("CaseStudy", caseStudySchema);
export default CaseStudy;

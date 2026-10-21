import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, trim: true },
    telephone: { type: String, trim: true },
    country: { type: String, trim: true },
    companySize: { type: String, trim: true },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    industry: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    resourceId: { type: String, trim: true },
    resourceTitle: { type: String, trim: true },
    assetTitle: { type: String, trim: true },
    assetType: { type: String, trim: true },
    downloadFileType: { type: String, trim: true },
    type: {
      type: String,
      enum: ["contact", "download", "subscription"],
      default: "contact",
    },
    optInMarketing: { type: Boolean, default: false },
    optInPartner: { type: Boolean, default: false },
    subject: {
      type: String,
      required: true,
      default: "General Enquiry",
    },
    message: { type: String, required: false, default: "" },
    customFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["New", "Read", "Replied", "Archived"],
      default: "New",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;

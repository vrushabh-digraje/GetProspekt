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
    optInMarketing: { type: Boolean, default: false },
    optInPartner: { type: Boolean, default: false },
    subject: {
      type: String,
      required: true,
      default: "General Enquiry",
    },
    message: { type: String, required: false, default: "" },
    status: {
      type: String,
      enum: ["New", "Read", "Replied", "Archived"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;

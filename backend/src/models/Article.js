import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    paragraphs: [{ type: String }],
    bullets: [{ type: String }],
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true },
    author: { type: String, default: "GETprospeKt" },
    date: { type: String, default: () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
    description: { type: String, required: true },
    heroImage: { type: String },
    heroAuthorImage: { type: String },
    heroAuthorName: { type: String },
    heroAuthorRole: { type: String },
    company: { type: String },
    isGuestAuthor: { type: Boolean, default: false },
    intro: { type: String },
    sections: [sectionSchema],
    authorBio: { type: String },
    status: { type: String, enum: ["Draft", "Published"], default: "Published" },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;

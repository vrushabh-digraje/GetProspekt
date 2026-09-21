import CaseStudy from "../models/CaseStudy.js";

// GET /api/case-studies
export const getCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find().sort({ createdAt: -1 });
    res.json(caseStudies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch case studies", error: error.message });
  }
};

// GET /api/case-studies/:slug
export const getCaseStudyBySlug = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findOne({ slug: req.params.slug });
    if (!caseStudy) {
      return res.status(404).json({ message: "Case study not found" });
    }
    res.json(caseStudy);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch case study", error: error.message });
  }
};

// POST /api/case-studies (Protected)
export const createCaseStudy = async (req, res) => {
  try {
    const { title, slug, label, description, image, stats, profile, objective, spec, executed, owned, client } = req.body;
    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const caseStudy = await CaseStudy.create({
      title,
      slug: generatedSlug,
      label: label || "Case Study",
      description,
      image: image || "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90",
      stats: stats || [],
      profile: profile || "",
      objective: objective || "",
      spec: spec || [],
      executed: executed || [],
      owned: owned || "",
      client: client || "",
    });

    res.status(201).json(caseStudy);
  } catch (error) {
    res.status(400).json({ message: "Failed to create case study", error: error.message });
  }
};

// PUT /api/case-studies/:id (Protected)
export const updateCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!caseStudy) {
      return res.status(404).json({ message: "Case study not found" });
    }
    res.json(caseStudy);
  } catch (error) {
    res.status(400).json({ message: "Failed to update case study", error: error.message });
  }
};

// DELETE /api/case-studies/:id (Protected)
export const deleteCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ message: "Case study not found" });
    }
    res.json({ message: "Case study deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete case study", error: error.message });
  }
};

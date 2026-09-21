import Newsletter from "../models/Newsletter.js";

// GET /api/newsletters
export const getNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch newsletters", error: error.message });
  }
};

// POST /api/newsletters (Protected)
export const createNewsletter = async (req, res) => {
  try {
    const { title, issueNumber, frequency, summary, content } = req.body;
    const newsletter = await Newsletter.create({
      title,
      issueNumber,
      frequency,
      summary,
      content,
    });
    res.status(201).json(newsletter);
  } catch (error) {
    res.status(400).json({ message: "Failed to create newsletter", error: error.message });
  }
};

// PUT /api/newsletters/:id (Protected)
export const updateNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!newsletter) return res.status(404).json({ message: "Newsletter not found" });
    res.json(newsletter);
  } catch (error) {
    res.status(400).json({ message: "Failed to update newsletter", error: error.message });
  }
};

// DELETE /api/newsletters/:id (Protected)
export const deleteNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
    if (!newsletter) return res.status(404).json({ message: "Newsletter not found" });
    res.json({ message: "Newsletter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete newsletter", error: error.message });
  }
};

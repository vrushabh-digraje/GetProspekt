import Resource from "../models/Resource.js";

// GET /api/resources
export const getResources = async (req, res) => {
  try {
    const { type, category } = req.query;
    const query = {};
    if (type) query.type = type;
    if (category) query.category = new RegExp(category, "i");

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resources", error: error.message });
  }
};

// POST /api/resources (Protected)
export const createResource = async (req, res) => {
  try {
    const { title, type, category, summary, fileUrl, externalUrl } = req.body;
    const resource = await Resource.create({
      title,
      type,
      category,
      summary,
      fileUrl,
      externalUrl,
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: "Failed to create resource", error: error.message });
  }
};

// PUT /api/resources/:id (Protected)
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: "Failed to update resource", error: error.message });
  }
};

// DELETE /api/resources/:id (Protected)
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete resource", error: error.message });
  }
};

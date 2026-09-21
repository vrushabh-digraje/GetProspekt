import Article from "../models/Article.js";

// GET /api/articles
export const getArticles = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category) {
      query.category = new RegExp(category, "i");
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { author: new RegExp(search, "i") },
      ];
    }

    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch articles", error: error.message });
  }
};

// GET /api/articles/:slug
export const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch article", error: error.message });
  }
};

// POST /api/articles (Protected)
export const createArticle = async (req, res) => {
  try {
    const { title, slug, category, author, description, heroImage, intro, sections, authorBio, isGuestAuthor } = req.body;

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const article = await Article.create({
      title,
      slug: generatedSlug,
      category,
      author: author || "GETprospeKt",
      description,
      heroImage: heroImage || "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=90",
      intro,
      sections: sections || [],
      authorBio,
      isGuestAuthor: Boolean(isGuestAuthor),
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: "Failed to create article", error: error.message });
  }
};

// PUT /api/articles/:id (Protected)
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    res.status(400).json({ message: "Failed to update article", error: error.message });
  }
};

// DELETE /api/articles/:id (Protected)
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete article", error: error.message });
  }
};

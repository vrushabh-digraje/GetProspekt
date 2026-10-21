import Enquiry from "../models/Enquiry.js";

// POST /api/enquiries (Public)
export const createEnquiry = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      company,
      telephone,
      country,
      companySize,
      city,
      address,
      postalCode,
      industry,
      jobTitle,
      resourceId,
      resourceTitle,
      assetTitle,
      assetType,
      downloadFileType,
      type,
      optInMarketing,
      optInPartner,
      subject,
      message,
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const resolvedAssetTitle = assetTitle || resourceTitle || "";
    const resolvedType =
      type ||
      (resourceId || resourceTitle || assetTitle
        ? "download"
        : subject && /subscribe|newsletter/i.test(subject)
        ? "subscription"
        : "contact");

    const defaultMsg =
      message ||
      (resolvedAssetTitle
        ? `Downloaded ${assetType || "resource"}: ${resolvedAssetTitle}`
        : resolvedType === "subscription"
        ? "Newsletter Subscription"
        : "General Enquiry");

    const enquiry = await Enquiry.create({
      firstName,
      lastName,
      email,
      company: company || "",
      telephone: telephone || "",
      country: country || "",
      companySize: companySize || "",
      city: city || "",
      address: address || "",
      postalCode: postalCode || "",
      industry: industry || "",
      jobTitle: jobTitle || "",
      resourceId: resourceId || "",
      resourceTitle: resourceTitle || resolvedAssetTitle || "",
      assetTitle: resolvedAssetTitle,
      assetType: assetType || (resourceId ? "Resource" : ""),
      downloadFileType: downloadFileType || "PDF",
      type: resolvedType,
      optInMarketing: Boolean(optInMarketing),
      optInPartner: Boolean(optInPartner),
      customFields: req.body.customFields || {},
      subject:
        subject ||
        (resolvedAssetTitle
          ? `Resource Download: ${resolvedAssetTitle}`
          : resolvedType === "subscription"
          ? "Newsletter Subscription"
          : "General Enquiry"),
      message: defaultMsg,
    });

    res.status(201).json({
      message: "Enquiry submitted successfully. We will get back to you shortly.",
      enquiry,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit enquiry", error: error.message });
  }
};

// GET /api/enquiries (Protected)
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enquiries", error: error.message });
  }
};

// PATCH /api/enquiries/:id (Protected)
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.json(enquiry);
  } catch (error) {
    res.status(400).json({ message: "Failed to update enquiry", error: error.message });
  }
};

// DELETE /api/enquiries/:id (Protected)
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete enquiry", error: error.message });
  }
};

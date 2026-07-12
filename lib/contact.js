const REQUIRED_FIELDS = ["name", "phone", "email", "business", "message"];

export function sanitizeContactPayload(payload = {}) {
  const values = {};

  for (const field of REQUIRED_FIELDS) {
    const rawValue = payload[field];
    const safeValue = typeof rawValue === "string" ? rawValue.trim() : "";
    values[field] = safeValue;
  }

  return {
    ...values,
    email: values.email.toLowerCase(),
    message: values.message.replace(/\s+/g, " ").trim(),
  };
}

export function validateContactPayload(payload = {}) {
  const sanitized = sanitizeContactPayload(payload);
  const errors = {};

  if (!sanitized.name) {
    errors.name = "Name is required.";
  }

  if (!sanitized.phone) {
    errors.phone = "Phone number is required.";
  }

  if (!sanitized.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!sanitized.business) {
    errors.business = "Business name is required.";
  }

  if (!sanitized.message) {
    errors.message = "Please share your requirement.";
  }

  return { sanitized, errors };
}

export function buildInquiryMessage(payload = {}) {
  const details = sanitizeContactPayload(payload);

  return [
    "Hello GKS Digital,",
    "",
    "I would like a website.",
    "",
    "Name:",
    details.name,
    "",
    "Phone:",
    details.phone,
    "",
    "Email:",
    details.email,
    "",
    "Business:",
    details.business,
    "",
    "Requirement:",
    details.message,
    "",
    "Looking forward to hearing from you.",
  ].join("\n");
}

export function buildWhatsAppUrl(phoneNumber, payload = {}) {
  const formattedNumber = phoneNumber ? phoneNumber.replace(/[^\d+]/g, "") : "";
  const message = encodeURIComponent(buildInquiryMessage(payload));

  return formattedNumber
    ? `https://wa.me/${formattedNumber}?text=${message}`
    : `https://wa.me/?text=${message}`;
}

export function buildInquiryEmailHtml(payload = {}) {
  const details = sanitizeContactPayload(payload);

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 12px; color: #0f172a;">New Website Inquiry</h2>
      <p style="margin: 0 0 20px; color: #475569;">A new lead has arrived from the GKS Digital portfolio website.</p>
      <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #f8fafc;">
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${details.name || "—"}</p>
        <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${details.phone || "—"}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${details.email || "—"}</p>
        <p style="margin: 0 0 8px;"><strong>Business:</strong> ${details.business || "—"}</p>
        <p style="margin: 8px 0 0;"><strong>Requirement:</strong><br />${(details.message || "—").replace(/\n/g, "<br />")}</p>
      </div>
      <p style="margin-top: 18px; color: #64748b; font-size: 12px;">Sent from the GKS Digital Portfolio Website</p>
    </div>
  `;
}

export function getFriendlyErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

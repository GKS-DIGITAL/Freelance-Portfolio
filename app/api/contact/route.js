import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  buildInquiryEmailHtml,
  buildInquiryMessage,
  getFriendlyErrorMessage,
  validateContactPayload,
} from "../../../lib/contact";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function getOwnerEmail() {
  return process.env.OWNER_EMAIL || "guruuu2468@gmail.com";
}

async function sendInquiryEmail(payload) {
  if (!resend) {
    throw new Error("Resend is not configured. Set RESEND_API_KEY in your environment.");
  }

  const result = await resend.emails.send({
    from: "GKS Digital <onboarding@resend.dev>",
    to: [getOwnerEmail()],
    subject: "🚀 New Website Inquiry - GKS Digital",
    html: buildInquiryEmailHtml(payload),
    text: buildInquiryMessage(payload),
  });

  return result;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sanitized, errors } = validateContactPayload(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
          errors,
        },
        { status: 400 }
      );
    }

    const emailResponse = await sendInquiryEmail(sanitized);

    if (emailResponse?.error) {
      return NextResponse.json(
        {
          success: false,
          message: getFriendlyErrorMessage(emailResponse.error),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Inquiry sent successfully." });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: getFriendlyErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

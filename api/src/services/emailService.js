export const emailService = {
  sendVerificationOtp: async (email, otp) => {
    if (!process.env.BREVO_API_KEY) {
      // In development / testing without active Brevo credentials
      console.log(`[EmailService] Verification OTP email dispatched to recipient: ${email}`);
      return { success: true, simulated: true };
    }

    const response = await fetch(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_SENDER_NAME || 'ShowMySkills',
            email: process.env.BREVO_SENDER_EMAIL || 'admin@showmyskills.com'
          },
          to: [
            {
              email
            }
          ],
          subject: 'ShowMySkills Email Verification',
          textContent: `Your ShowMySkills verification OTP is ${otp}. This OTP is valid for 10 minutes.`
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Brevo email failed: ${errorData}`);
    }

    return response.json();
  },

  sendOfficialAdminOtp: async (officialEmail, otp, applicantEmail) => {
    if (!process.env.BREVO_API_KEY) {
      console.log(`[EmailService] Official authorization OTP dispatched to fixed address for applicant: ${applicantEmail}`);
      return { success: true, simulated: true };
    }

    const response = await fetch(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_SENDER_NAME || 'ShowMySkills System',
            email: process.env.BREVO_SENDER_EMAIL || 'admin@showmyskills.com'
          },
          to: [
            {
              email: officialEmail
            }
          ],
          subject: 'ShowMySkills Admin Access Request - Official Authorization Code',
          textContent: `An admin access application was initiated by applicant ${applicantEmail}.\n\nThe official authorization OTP code is: ${otp}\n\nThis OTP is valid for 10 minutes. If this application was not authorized, do not share this code.`
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Brevo email failed: ${errorData}`);
    }

    return response.json();
  },

  sendApplicationApprovedEmail: async (email, name) => {
    if (!process.env.BREVO_API_KEY) {
      console.log(`[EmailService] Admin approval confirmation dispatched to: ${email}`);
      return { success: true, simulated: true };
    }

    const response = await fetch(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_SENDER_NAME || 'ShowMySkills',
            email: process.env.BREVO_SENDER_EMAIL || 'admin@showmyskills.com'
          },
          to: [{ email }],
          subject: 'Your ShowMySkills Admin Access Application has been Approved',
          textContent: `Hello ${name},\n\nYour application for ShowMySkills Administrator access has been reviewed and approved by a core administrator. Your account has been activated, and your submitted photo has been set as your public admin profile icon with your consent.\n\nYou may now log in to the admin portal.`
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Brevo email failed: ${errorData}`);
    }

    return response.json();
  }
};
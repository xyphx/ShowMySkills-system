export const emailService = {
  sendVerificationOtp: async (email, otp) => {
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
            name: process.env.BREVO_SENDER_NAME,
            email: process.env.BREVO_SENDER_EMAIL
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
  }
};
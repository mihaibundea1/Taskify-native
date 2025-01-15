import emailjs from '@emailjs/browser';

export const sendEmail = async (to, subject, text) => {
  try {
    const response = await emailjs.send(
      process.env.VITE_EMAILJS_SERVICE_ID,
      process.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_email: to,
        subject: subject,
        message: text,
      },
      process.env.VITE_EMAILJS_PUBLIC_KEY
    );

    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

export const verifyCaptcha = async (captchaToken) => {
  if (!captchaToken) {
    throw new Error("CAPTCHA token is required.");
  }

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      }),
    }
  );

  const result = await response.json();

  if (!result.success) {
    throw new Error("CAPTCHA verification failed.");
  }

  return true;
};
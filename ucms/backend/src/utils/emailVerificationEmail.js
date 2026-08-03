const emailVerificationEmail = ({ name, verificationLink }) => {
  return {
    subject: "Verify your email address",

    text: `
Hello ${name},

Welcome to the University LMS!

Please verify your email by visiting the link below:

${verificationLink}

This link expires in 24 hours.
`,

    html: `
      <h2>Welcome to the University LMS</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>Thank you for registering.</p>

      <p>
        <a href="${verificationLink}">
          Verify Email
        </a>
      </p>

      <p>This verification link expires in <strong>24 hours</strong>.</p>
    `,
  };
};

export default emailVerificationEmail;

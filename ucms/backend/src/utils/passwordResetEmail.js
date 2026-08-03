const passwordResetEmail = ({ name, resetLink }) => {
  return {
    subject: "Reset your password",

    text: `
Hello ${name},

We received a request to reset your password.

Reset your password here:

${resetLink}

This link will expire in 15 minutes.

If you didn't request a password reset, you can safely ignore this email.
`,

    html: `
      <h2>Password Reset</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>We received a request to reset your password.</p>

      <p>
        <a href="${resetLink}">
          Reset Password
        </a>
      </p>

      <p>This link expires in <strong>15 minutes</strong>.</p>

      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  };
};

export default passwordResetEmail;

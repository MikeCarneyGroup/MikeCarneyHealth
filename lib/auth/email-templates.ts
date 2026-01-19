export function generateEmailHTML({ url }: { url: string }): string {
  const brandColor = '#0284c7';
  const color = {
    background: '#f9fafb',
    text: '#1f2937',
    mainBackground: '#ffffff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: '#ffffff',
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background: ${color.background}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: 40px auto; border-radius: 8px;">
    <tr>
      <td align="center"
        style="padding: 40px 20px 20px 20px; font-size: 24px; font-weight: bold; color: ${color.text};">
        Sign in to Mike Carney Wellbeing Hub
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px; color: ${color.text};">
        <p style="font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
          Click the button below to sign in to your account.
        </p>
        <a href="${url}"
          style="background-color: ${color.buttonBackground}; color: ${color.buttonText}; 
          padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; 
          font-weight: 600; font-size: 16px;">
          Sign in
        </a>
        <p style="font-size: 14px; line-height: 20px; margin: 20px 0 0 0; color: #6b7280;">
          If you did not request this email, you can safely ignore it.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export function generateEmailText({ url }: { url: string }): string {
  return `Sign in to Mike Carney Wellbeing Hub\n\nClick the link below to sign in:\n${url}\n\nIf you did not request this email, you can safely ignore it.\n`;
}

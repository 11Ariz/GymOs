/**
 * Generates a styled HTML email for membership reminders.
 * @param {{ name: string, plan: string, expiryDate: string, feeStatus: string }} member
 * @param {string} gymName
 */
function emailTemplate(member, gymName = 'GymOS') {
  const expiry = new Date(member.expiryDate);
  const today = new Date();
  const diffDays = Math.round((expiry - today) / (1000 * 60 * 60 * 24));

  let statusLine = '';
  let accentColor = '#7c3aed';
  if (diffDays < 0) {
    statusLine = `Your membership <strong>expired ${Math.abs(diffDays)} day(s) ago</strong>.`;
    accentColor = '#ef4444';
  } else if (diffDays === 0) {
    statusLine = `Your membership <strong>expires today!</strong>`;
    accentColor = '#f59e0b';
  } else {
    statusLine = `Your membership expires in <strong>${diffDays} day(s)</strong> on <strong>${expiry.toLocaleDateString('en-US', { dateStyle: 'long' })}</strong>.`;
    accentColor = diffDays <= 3 ? '#f59e0b' : '#06b6d4';
  }

  const feeNote = member.feeStatus === 'Pending'
    ? `<p style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;color:#b91c1c;font-size:14px;margin:16px 0 0;">
        ⚠️ You also have a <strong>pending fee</strong>. Please clear it when you renew.
      </p>`
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Membership Reminder – ${gymName}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${accentColor};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
                🏋️ ${gymName}
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Membership Reminder</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="font-size:16px;color:#1e293b;margin:0 0 8px;">Hi <strong>${member.name}</strong>,</p>
              <p style="font-size:15px;color:#475569;margin:0 0 24px;line-height:1.6;">
                ${statusLine}
              </p>

              <!-- Details card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;">
                    <span style="font-size:13px;color:#94a3b8;">Plan</span><br/>
                    <span style="font-size:15px;font-weight:600;color:#1e293b;">${member.plan}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;border-top:1px solid #e2e8f0;">
                    <span style="font-size:13px;color:#94a3b8;">Expiry Date</span><br/>
                    <span style="font-size:15px;font-weight:600;color:#1e293b;">${expiry.toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;border-top:1px solid #e2e8f0;">
                    <span style="font-size:13px;color:#94a3b8;">Fee Status</span><br/>
                    <span style="font-size:15px;font-weight:600;color:${member.feeStatus === 'Paid' ? '#16a34a' : '#dc2626'};">${member.feeStatus}</span>
                  </td>
                </tr>
              </table>

              ${feeNote}

              <p style="font-size:14px;color:#64748b;margin:24px 0 0;line-height:1.6;">
                Please contact us or visit the gym to renew your membership. We'd love to keep you on track!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
              <p style="font-size:12px;color:#94a3b8;margin:0;">
                This is an automated reminder from <strong>${gymName}</strong>. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { emailTemplate };

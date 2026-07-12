import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Ensure environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    return res.status(500).json({ message: 'Server configuration error: Missing Environment Variables.' });
  }

  const { leaderEmail, password, teamName, teamId, leaderName, leaderReg, extraMembersData } = req.body;

  if (!leaderEmail || !teamName) {
    return res.status(400).json({ message: 'Missing required fields (leaderEmail or teamName)' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    let html = `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SVH 2026 — Registration Confirmed</title>
    <style type="text/css">
        body {
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #334155;
            -webkit-font-smoothing: antialiased;
        }

        table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        a {
            text-decoration: none;
            color: #ea580c;
        }

        a:hover {
            text-decoration: underline !important;
        }

        .main-button:hover {
            background-color: #d97706 !important;
            text-decoration: none !important;
        }

        .secondary-button:hover {
            background-color: #f1f5f9 !important;
            text-decoration: none !important;
        }

        @media only screen and (max-width: 640px) {
            .container {
                width: 100% !important;
                padding: 10px !important;
            }

            .content-padding {
                padding: 20px !important;
            }

            .mobile-stack {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }

            .mobile-margin {
                margin-bottom: 15px !important;
            }
        }
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f8fafc;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 30px 0;">
        <tr>
            <td align="center">
                <table class="container" width="650" border="0" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">

                    <!-- Tricolour Accent Line -->
                    <tr>
                        <td>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="height: 4px;">
                                <tr>
                                    <td width="33.33%"
                                        style="background-color: #ea580c; height: 4px; font-size: 1px; line-height: 1px;">
                                        &nbsp;</td>
                                    <td width="33.33%"
                                        style="background-color: #ffffff; height: 4px; font-size: 1px; line-height: 1px;">
                                        &nbsp;</td>
                                    <td width="33.33%"
                                        style="background-color: #16a34a; height: 4px; font-size: 1px; line-height: 1px;">
                                        &nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Header -->
                    <tr>
                        <td style="background-color: #0f2942; padding: 35px 40px; text-align: center;">
                            <p
                                style="margin: 0 0 8px 0; color: #ea580c; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
                                Blockchain Club, VIT Bhopal</p>
                            <h1
                                style="margin: 0 0 10px 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
                                SVH 2026</h1>
                            <p style="margin: 0; color: #94a3b8; font-size: 16px; font-weight: 500;">Registration
                                Confirmed ✅</p>
                        </td>
                    </tr>

                    <!-- Intro Section -->
                    <tr>
                        <td class="content-padding" style="padding: 40px 45px; border-bottom: 1px solid #f1f5f9;">
                            <h2 style="margin: 0 0 15px 0; color: #0f2942; font-size: 20px; font-weight: 700;">You're
                                In, {{TEAM_NAME}}!</h2>
                            <p
                                style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569; text-align: justify;">
                                Congratulations! Your team's registration for the <strong>Smart VIT Hackathon (SVH)
                                    2026</strong> has been successfully verified and confirmed. Below are your official
                                team credentials for the SVH portal — please save this email for future reference.
                            </p>
                        </td>
                    </tr>

                    <!-- Credentials Card -->
                    <tr>
                        <td class="content-padding"
                            style="padding: 40px 45px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                            <h3
                                style="margin: 0 0 20px 0; color: #0f2942; font-size: 18px; font-weight: 700; border-left: 3px solid #ea580c; padding-left: 10px;">
                                Your Team Credentials</h3>

                            <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 6px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td valign="top" style="padding-bottom: 16px;">
                                                    <strong
                                                        style="color: #64748b; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Team
                                                        ID</strong>
                                                    <span
                                                        style="font-size: 20px; color: #0f2942; font-weight: 800; font-family: 'Courier New', monospace; letter-spacing: 0.5px;">{{TEAM_ID}}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td valign="top" style="padding-bottom: 16px;">
                                                    <strong
                                                        style="color: #64748b; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Portal
                                                        Password</strong>
                                                    <span
                                                        style="font-size: 20px; color: #0f2942; font-weight: 800; font-family: 'Courier New', monospace; letter-spacing: 0.5px;">{{PASSWORD}}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td valign="top">
                                                    <strong
                                                        style="color: #64748b; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Registered
                                                        Leader Email (Login ID)</strong>
                                                    <span
                                                        style="font-size: 16px; color: #0f2942; font-weight: 700;">{{LEADER_EMAIL}}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 15px 0 0 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                                🔒 Keep these credentials confidential and shared only within your team. Do not forward
                                this email outside your group.
                            </p>
                        </td>
                    </tr>

                    <!-- Team Details -->
                    <tr>
                        <td class="content-padding"
                            style="padding: 40px 45px; background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                            <h3
                                style="margin: 0 0 20px 0; color: #0f2942; font-size: 18px; font-weight: 700; border-left: 3px solid #0f2942; padding-left: 10px;">
                                Team Details on Record</h3>
                            <p style="margin: 0 0 15px 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                                Please verify the details below against your submitted registration form. If you spot
                                any discrepancy, contact us immediately via the WhatsApp group before submissions
                                begin.
                            </p>

                            <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                                <tr style="background-color: #0f2942;">
                                    <td style="padding: 10px 16px; font-size: 12px; color: #ffffff; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                        #</td>
                                    <td style="padding: 10px 16px; font-size: 12px; color: #ffffff; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                        Member Name</td>
                                    <td style="padding: 10px 16px; font-size: 12px; color: #ffffff; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                        Registration Number</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #0f2942; font-weight: 700; border-bottom: 1px solid #f1f5f9;">
                                        1</td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569; border-bottom: 1px solid #f1f5f9;">
                                        {{MEMBER_1_NAME}} <span style="color: #ea580c; font-weight: 700;">(Leader)</span></td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569; font-family: 'Courier New', monospace; border-bottom: 1px solid #f1f5f9;">
                                        {{MEMBER_1_REGNO}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #0f2942; font-weight: 700; border-bottom: 1px solid #f1f5f9;">
                                        2</td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569; border-bottom: 1px solid #f1f5f9;">
                                        {{MEMBER_2_NAME}}</td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569; font-family: 'Courier New', monospace; border-bottom: 1px solid #f1f5f9;">
                                        {{MEMBER_2_REGNO}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #0f2942; font-weight: 700; border-bottom: 1px solid #f1f5f9;">
                                        3</td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569; border-bottom: 1px solid #f1f5f9;">
                                        {{MEMBER_3_NAME}}</td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569; font-family: 'Courier New', monospace; border-bottom: 1px solid #f1f5f9;">
                                        {{MEMBER_3_REGNO}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #0f2942; font-weight: 700; border-bottom: 1px solid #f1f5f9;">
                                        4</td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569; border-bottom: 1px solid #f1f5f9;">
                                        {{MEMBER_4_NAME}}</td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569; font-family: 'Courier New', monospace; border-bottom: 1px solid #f1f5f9;">
                                        {{MEMBER_4_REGNO}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #0f2942; font-weight: 700; border-bottom: 1px solid #f1f5f9;">
                                        5</td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569; border-bottom: 1px solid #f1f5f9;">
                                        {{MEMBER_5_NAME}}</td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569; font-family: 'Courier New', monospace; border-bottom: 1px solid #f1f5f9;">
                                        {{MEMBER_5_REGNO}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #0f2942; font-weight: 700;">
                                        6</td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569;">
                                        {{MEMBER_6_NAME}}</td>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #475569; font-family: 'Courier New', monospace;">
                                        {{MEMBER_6_REGNO}}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Login Instructions -->
                    <tr>
                        <td class="content-padding"
                            style="padding: 40px 45px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                            <h3
                                style="margin: 0 0 20px 0; color: #0f2942; font-size: 18px; font-weight: 700; border-left: 3px solid #16a34a; padding-left: 10px;">
                                How to Login</h3>

                            <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                            style="font-size: 14px; color: #475569; line-height: 1.6;">
                                            <tr>
                                                <td valign="top" width="26" style="padding-bottom: 10px; color: #ea580c; font-weight: 800;">1.</td>
                                                <td valign="top" style="padding-bottom: 10px;">Visit the official SVH
                                                    website: <a href="https://svh-2026.vercel.app/" target="_blank"
                                                        style="color: #ea580c; font-weight: 600; text-decoration: underline;">svh-2026.vercel.app</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td valign="top" style="padding-bottom: 10px; color: #ea580c; font-weight: 800;">2.</td>
                                                <td valign="top" style="padding-bottom: 10px;">Click on the <strong>Team
                                                        Login / Dashboard</strong> option.</td>
                                            </tr>
                                            <tr>
                                                <td valign="top" style="padding-bottom: 10px; color: #ea580c; font-weight: 800;">3.</td>
                                                <td valign="top" style="padding-bottom: 10px;">Enter your <strong>Team
                                                        ID</strong> and <strong>Password</strong> given above.</td>
                                            </tr>
                                            <tr>
                                                <td valign="top" style="color: #ea580c; font-weight: 800;">4.</td>
                                                <td valign="top">Only the <strong>Team Leader</strong> ({{LEADER_EMAIL}})
                                                    should log in and operate the dashboard on behalf of the team.</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Website Button -->
                            <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                                <tr>
                                    <td align="center" style="background-color: #0f2942; border-radius: 6px;">
                                        <a class="main-button" href="https://svh-2026.vercel.app/" target="_blank"
                                            style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 6px;">Go
                                            to SVH Portal</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Important Notice: Submission -->
                    <tr>
                        <td class="content-padding"
                            style="padding: 40px 45px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                            <h3
                                style="margin: 0 0 15px 0; color: #0f2942; font-size: 18px; font-weight: 700; border-left: 3px solid #ea580c; padding-left: 10px;">
                                A Quick Note on Submissions</h3>

                            <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 6px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p
                                            style="margin: 0 0 10px 0; font-size: 14px; color: #c2410c; font-weight: 700; line-height: 1.5;">
                                            ⚠️ PPT submission has <u>not started yet</u>.
                                        </p>
                                        <p style="margin: 0; font-size: 14px; color: #7c2d12; line-height: 1.6;">
                                            We will send a separate email and WhatsApp announcement the moment
                                            submissions open. Please do not attempt to submit before that
                                            notification — the window will be clearly communicated with the deadline.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 15px 0 0 0; font-size: 14px; line-height: 1.6; color: #475569;">
                                Also note: once submissions open, <strong>only the Team Leader</strong> is authorized
                                to submit the PPT on the dashboard. Submissions made by any other team member will not
                                be considered valid.
                            </p>
                        </td>
                    </tr>

                    <!-- Need Help Section -->
                    <tr>
                        <td class="content-padding"
                            style="padding: 40px 45px; background-color: #f8fafc; text-align: center;">
                            <h3 style="margin: 0 0 15px 0; color: #0f2942; font-size: 18px; font-weight: 700;">Facing
                                an Issue on the Dashboard?</h3>
                            <p
                                style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569; text-align: justify;">
                                If you run into any login issues, discrepancies in your team details, or technical
                                glitches on the portal, reach out to our tech team directly on the official WhatsApp
                                group — we're monitoring it actively for quick resolutions.
                            </p>
                            <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                                <tr>
                                    <td align="center" style="background-color: #16a34a; border-radius: 6px;">
                                        <a class="main-button"
                                            href="https://chat.whatsapp.com/L7lXF9VZQRDCx0aXXwBhGw?s=sw&p=a&mlu=2"
                                            target="_blank"
                                            style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 6px;">Join
                                            Official WhatsApp Group</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.4;">
                                Our tech team and coordinators respond here for live support.
                            </p>
                        </td>
                    </tr>

                    <!-- Contact & Queries -->
                    <tr>
                        <td class="content-padding"
                            style="padding: 40px 45px; background-color: #ffffff; text-align: left; border-top: 1px solid #f1f5f9;">
                            <h3 style="margin: 0 0 15px 0; color: #0f2942; font-size: 16px; font-weight: 700;">Student
                                Event Coordinators</h3>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                style="font-size: 14px; color: #475569; line-height: 1.6;">
                                
                                <tr>
                                    <td style="padding: 4px 0;"><strong>Priya</strong></td>
                                    <td align="right" style="padding: 4px 0;"><a href="tel:+91 92347 29992"
                                            style="color: #ea580c; font-weight: 600;">9234729992</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0;"><strong>Ayush Tiwari</strong></td>
                                    <td align="right" style="padding: 4px 0;"><a href="tel:+91 89623 01907"
                                            style="color: #ea580c; font-weight: 600;">8962301907</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 0 4px 0; border-top: 1px solid #f1f5f9;"><strong>Official
                                            Support Email</strong></td>
                                    <td align="right" style="padding: 15px 0 4px 0; border-top: 1px solid #f1f5f9;">
                                        <a href="mailto:blockchainclub@vitbhopal.ac.in"
                                            style="color: #ea580c; font-weight: 600;">blockchainclub@vitbhopal.ac.in</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Technical Support Team -->
                    <tr>
                        <td class="content-padding"
                            style="padding: 40px 45px; background-color: #f8fafc; text-align: left;">
                            <h3 style="margin: 0 0 15px 0; color: #0f2942; font-size: 16px; font-weight: 700;">
                                Technical Support Team</h3>
                            <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5; color: #475569;">
                                For portal login issues, dashboard errors, or submission-related technical glitches,
                                reach out to our tech team directly:
                            </p>

                            <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                style="font-size: 14px; color: #475569; line-height: 1.6;">
                                <tr>
                                    <td style="padding: 4px 0;"><strong>Abhilash</strong></td>
                                    <td align="right" style="padding: 4px 0;"><a href="tel:+91 95114 54951"
                                            style="color: #ea580c; font-weight: 600;">9511454951</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0;"><strong>Soum</strong></td>
                                    <td align="right" style="padding: 4px 0;"><a href="tel:+91 93324 04107"
                                            style="color: #ea580c; font-weight: 600;">9332404107</a></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="background-color: #0f2942; padding: 30px 40px; text-align: center; border-top: 1px solid #1e293b;">
                            <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">
                                © 2026 Blockchain Club, VIT Bhopal. All rights reserved.<br />
                                This is an automated confirmation email. Please do not reply directly to this
                                address.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>\`;

    // --- REPLACE ALL PLACEHOLDERS ---
    html = html.replace(/{{TEAM_NAME}}/g, teamName || '');
    html = html.replace(/{{TEAM_ID}}/g, teamId || '');
    html = html.replace(/{{PASSWORD}}/g, password || '');
    html = html.replace(/{{LEADER_EMAIL}}/g, leaderEmail || '');
    
    html = html.replace(/{{MEMBER_1_NAME}}/g, leaderName || '');
    html = html.replace(/{{MEMBER_1_REGNO}}/g, leaderReg || '');
    
    // Replace remaining 5 members safely
    for (let i = 0; i < 5; i++) {
      const mem = extraMembersData && extraMembersData[i] ? extraMembersData[i] : null;
      const num = i + 2; 
      
      if (mem && mem.name) {
        html = html.replace(new RegExp(\`{{MEMBER_\${num}_NAME}}\`, 'g'), mem.name);
        html = html.replace(new RegExp(\`{{MEMBER_\${num}_REGNO}}\`, 'g'), mem.regNo || '-');
      } else {
        html = html.replace(new RegExp(\`{{MEMBER_\${num}_NAME}}\`, 'g'), '-');
        html = html.replace(new RegExp(\`{{MEMBER_\${num}_REGNO}}\`, 'g'), '-');
      }
    }

    const mailOptions = {
      from: \`"Blockchain Club" <\${process.env.EMAIL_USER}>\`,
      to: leaderEmail,
      subject: \`Registration Confirmed: Smart VIT Hackathon 2026 - \${teamName}\`,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: 'Error sending email', error: error.message });
  }
}

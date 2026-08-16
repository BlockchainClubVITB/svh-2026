import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    let email = '';
    if (req.method === 'POST') {
      email = req.body?.email;
    } else if (req.method === 'GET') {
      email = req.query?.email;
    }

    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ message: 'Server configuration error: Supabase connection missing.' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let nameStr = '';
    let teamStr = '';

    // 1. Query 'profiles' table first (with joined teams)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*, teams(team_name)')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (profileData) {
      nameStr = (profileData.full_name || profileData.name || '').trim();
      const extractedTeam = profileData.teams
        ? (Array.isArray(profileData.teams) ? profileData.teams[0]?.team_name : profileData.teams.team_name)
        : profileData.team_name;
      teamStr = (extractedTeam || '').trim();
    }

    // 2. Fallback to 'svh-certificate-participants' table if not found in profiles
    if (!nameStr) {
      const { data: certPart } = await supabase
        .from('svh-certificate-participants')
        .select('name, teamname')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (certPart) {
        nameStr = (certPart.name || '').trim();
        teamStr = (certPart.teamname || '').trim();
      }
    }

    // 3. Fallback to 'app_users' table if still not found
    if (!nameStr) {
      const { data: appUser } = await supabase
        .from('app_users')
        .select('full_name')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (appUser) {
        nameStr = (appUser.full_name || '').trim();
      }
    }

    if (!nameStr) {
      return res.status(404).json({ message: 'Email address not found in database records. Please verify your registered email.' });
    }

    const fullText = teamStr ? `${nameStr} (Team : ${teamStr})` : nameStr;

    // Locate PDF template file
    const candidatePaths = [
      path.join(process.cwd(), 'src/assets/svh-certificate-participation.pdf'),
      path.join(process.cwd(), 'src/assets/svh-certificate-participant.pdf'),
      path.join(process.cwd(), 'assets/svh-certificate-participant.pdf'),
      path.join(process.cwd(), 'public/svh-certificate-participant.pdf'),
    ];

    let pdfPath = candidatePaths.find((p) => fs.existsSync(p));
    if (!pdfPath) {
      return res.status(500).json({ message: 'Base certificate PDF template file not found on server.' });
    }

    const templateBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];

    // Embed TimesRomanBoldItalic font
    const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

    // Dynamic font size fitting
    let fontSize = 42;
    const maxWidth = 1250;
    let textWidth = font.widthOfTextAtSize(fullText, fontSize);
    if (textWidth > maxWidth) {
      fontSize = Math.max(22, Math.floor(fontSize * (maxWidth / textWidth)));
    }

    // Position text slightly above dotted line (y = 682) to avoid overlap with dots
    page.drawText(fullText, {
      x: 330,
      y: 682,
      size: fontSize,
      font,
      color: rgb(15 / 255, 41 / 255, 66 / 255), // Dark navy #0f2942
    });

    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    const safeFilename = nameStr.replace(/[^a-zA-Z0-9_-]/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Certificate_${safeFilename}.pdf"`);
    res.setHeader('Content-Length', buffer.length.toString());

    if (typeof res.send === 'function') {
      return res.status(200).send(buffer);
    } else {
      res.statusCode = 200;
      return res.end(buffer);
    }
  } catch (err) {
    console.error('Certificate download handler error:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error while generating certificate.' });
  }
}

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const Detection = require('../models/Detection');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  file.mimetype === 'application/pdf' ? cb(null, true) : cb(new Error('Only PDF files allowed'));
}});

const pdf = require('pdf-parse');
const pdfParse = pdf.default || (typeof pdf === 'function' ? pdf : Object.values(pdf)[0]);

function analyzeText(text) {
  const redFlags = [];
  let score = 0;

  const rules = [
    { pattern: /pay|payment|deposit|registration fee|security deposit|processing fee|send money|transfer/i, message: '💸 Requests payment or fees from the applicant', tip: 'Legitimate internships never ask you to pay to apply or get selected.', weight: 3 },
    { pattern: /bank account|account number|ifsc|upi|gpay|paytm|send your details|card number/i, message: '🏦 Asks for bank account or financial details', tip: 'Never share your bank details with an employer before joining.', weight: 3 },
    { pattern: /limited slots|act now|hurry|last chance|only \d+ seats|expires today|respond immediately|urgent/i, message: '⚡ Uses urgent or pressure language', tip: 'Scammers create false urgency to stop you from thinking clearly.', weight: 2 },
    { pattern: /earn (up to |upto )?(rs\.?|inr|₹)?\s?\d{5,}|stipend.*50,000|work 2 hours|part.?time.*earn/i, message: '💰 Promises unrealistically high earnings for minimal work', tip: 'If the stipend seems too good to be true, it almost always is.', weight: 2 },
    { pattern: /from:?\s*[\w.]+@(gmail|yahoo|hotmail|outlook|rediffmail)\.com/i, message: '📧 Sender uses a personal email instead of a company domain', tip: 'Real companies use official email domains.', weight: 2 },
    { pattern: /work from home and earn|data entry.*earn|online job|no experience needed|anyone can apply|simple task/i, message: '📋 Vague or generic job description', tip: 'Genuine internships specify exact roles, skills, and teams.', weight: 2 },
    { pattern: /kindly do the needful|revert back|plese|recieve|ur selected|u r selected|congrats ur/i, message: '✍️ Contains excessive grammar errors or unprofessional language', tip: 'Poor language quality is a common sign of scam messages.', weight: 1 },
    { pattern: /whatsapp (us|me|only)|contact on whatsapp|message on whatsapp|telegram only/i, message: '📱 Asks you to communicate only via WhatsApp or Telegram', tip: 'Legitimate companies use official email or career portals.', weight: 2 },
    { pattern: /send (your )?(aadhar|aadhaar|pan card|passport)|id proof immediately/i, message: '🪪 Requests sensitive personal documents upfront', tip: 'Documents are only collected after an official offer letter.', weight: 3 },
    { pattern: /you (are|have been) selected|congratulations.*selected|guaranteed (placement|job|selection)/i, message: '🎯 Claims you are already selected without any interview', tip: 'Being pre-selected without an interview is a classic scam tactic.', weight: 2 }
  ];

  rules.forEach(rule => {
    if (rule.pattern.test(text)) {
      score += rule.weight;
      redFlags.push({ message: rule.message, tip: rule.tip });
    }
  });

  let verdict, level;
  if (score <= 2)      { verdict = 'Genuine';     level = 'green'; }
  else if (score <= 5) { verdict = 'Suspicious';  level = 'yellow'; }
  else                 { verdict = 'Likely Fake'; level = 'red'; }

  return { score, verdict, level, redFlags };
}

router.post('/detect', authMiddleware, upload.single('pdf'), async (req, res) => {
  let text = '';
  try {
    if (req.file) {
      const dataBuffer = fs.readFileSync(req.file.path);
      try {
        const pdfData = await pdfParse(dataBuffer);
        text = pdfData.text;
      } catch {
        text = dataBuffer.toString('utf8').replace(/[^\x20-\x7E\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
      }
      fs.unlinkSync(req.file.path);
    } else if (req.body.text) {
      text = req.body.text;
    } else {
      return res.status(400).json({ message: 'No text or PDF provided' });
    }

    if (text.trim().length < 20)
      return res.status(400).json({ message: 'Text is too short to analyze' });

    const result = analyzeText(text);

    await Detection.create({
      userId: req.user.id,
      textPreview: text.slice(0, 120) + (text.length > 120 ? '...' : ''),
      verdict: result.verdict,
      level: result.level,
      score: result.score,
      redFlags: result.redFlags
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Analysis failed. Please try again.' });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    console.log('History requested by user:', req.user.id);
    const history = await Detection.find({ userId: req.user.id }).sort({ checkedAt: -1 });
    console.log('History found:', history.length, 'records');
    res.json(history);
  } catch (err) {
    console.error('History error:', err.message);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});
module.exports = router;
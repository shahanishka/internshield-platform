const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Internship = require('./models/Internship');

const internships = [
  {
    company: "TechNova Solutions", role: "Frontend Developer Intern",
    domain: "Tech", location: "Bangalore", workMode: "Hybrid",
    stipend: 15000, deadline: "2025-08-15",
    description: "Work on cutting-edge React applications for enterprise clients.",
    responsibilities: ["Build UI components", "Write unit tests", "Collaborate with designers"],
    requirements: ["React basics", "CSS", "Git knowledge"],
    applyEmail: "careers@technova.in", website: "https://technova.in"
  },
  {
    company: "GreenLeaf Marketing", role: "Digital Marketing Intern",
    domain: "Marketing", location: "Mumbai", workMode: "Remote",
    stipend: 8000, deadline: "2025-08-20",
    description: "Help manage social media campaigns and content strategy.",
    responsibilities: ["Create social content", "Analyze campaign metrics", "Email marketing"],
    requirements: ["Good writing skills", "Canva basics", "Interest in marketing"],
    applyEmail: "hr@greenleaf.com", website: "https://greenleaf.com"
  },
  {
    company: "PixelCraft Studio", role: "UI/UX Design Intern",
    domain: "Design", location: "Pune", workMode: "Onsite",
    stipend: 12000, deadline: "2025-08-10",
    description: "Design beautiful mobile and web interfaces for real client projects.",
    responsibilities: ["Wireframing", "Prototyping in Figma", "User research"],
    requirements: ["Figma proficiency", "Portfolio required", "Eye for detail"],
    applyEmail: "studio@pixelcraft.in", website: "https://pixelcraft.in"
  },
  {
    company: "FinEdge Capital", role: "Finance & Research Intern",
    domain: "Finance", location: "Delhi", workMode: "Hybrid",
    stipend: 10000, deadline: "2025-09-01",
    description: "Assist analysts with equity research, financial modeling, and reports.",
    responsibilities: ["Financial modeling", "Sector research", "Prepare PPTs"],
    requirements: ["Excel skills", "Finance background", "Attention to detail"],
    applyEmail: "internships@finedge.in", website: "https://finedge.in"
  },
  {
    company: "CloudBase Systems", role: "Backend Developer Intern",
    domain: "Tech", location: "Hyderabad", workMode: "Remote",
    stipend: 18000, deadline: "2025-08-25",
    description: "Build and maintain RESTful APIs using Node.js and PostgreSQL.",
    responsibilities: ["API development", "Database design", "Code reviews"],
    requirements: ["Node.js basics", "SQL knowledge", "REST APIs"],
    applyEmail: "tech@cloudbase.io", website: "https://cloudbase.io"
  },
  {
    company: "BrandBuzz Agency", role: "Content Writing Intern",
    domain: "Marketing", location: "Chennai", workMode: "Remote",
    stipend: 6000, deadline: "2025-08-18",
    description: "Write blogs, social media posts, and product descriptions for clients.",
    responsibilities: ["Blog writing", "SEO content", "Proofreading"],
    requirements: ["Strong English", "SEO basics", "Creativity"],
    applyEmail: "content@brandbuzz.in", website: "https://brandbuzz.in"
  },
  {
    company: "DataMind Analytics", role: "Data Science Intern",
    domain: "Tech", location: "Bangalore", workMode: "Hybrid",
    stipend: 20000, deadline: "2025-09-10",
    description: "Work on real ML pipelines and data visualization projects.",
    responsibilities: ["Data cleaning", "Model training", "Dashboard creation"],
    requirements: ["Python", "Pandas/NumPy", "Basic ML knowledge"],
    applyEmail: "data@datamind.in", website: "https://datamind.in"
  },
  {
    company: "QuickCash Jobs", role: "Work From Home Data Entry",
    domain: "Other", location: "Anywhere", workMode: "Remote",
    stipend: 50000, deadline: "2025-07-30",
    description: "Earn up to Rs 50,000/month working just 2 hours a day! No experience needed.",
    responsibilities: ["Copy paste tasks", "Data entry"],
    requirements: ["None! Anyone can apply"],
    applyEmail: "apply@quickcashjobs123.gmail.com", website: ""
  },
  {
    company: "Artisan Collective", role: "Graphic Design Intern",
    domain: "Design", location: "Jaipur", workMode: "Onsite",
    stipend: 9000, deadline: "2025-08-30",
    description: "Create branding assets, logos, and print materials for boutique clients.",
    responsibilities: ["Logo design", "Brand identity", "Print layout"],
    requirements: ["Adobe Illustrator", "Photoshop", "Portfolio"],
    applyEmail: "hello@artisancollective.in", website: "https://artisancollective.in"
  },
  {
    company: "InvestRight Advisory", role: "Investment Research Intern",
    domain: "Finance", location: "Mumbai", workMode: "Onsite",
    stipend: 12000, deadline: "2025-09-05",
    description: "Support senior advisors with mutual fund and equity research.",
    responsibilities: ["Fund analysis", "Client reports", "Market research"],
    requirements: ["Finance/Economics background", "Excel", "NISM awareness preferred"],
    applyEmail: "careers@investright.in", website: "https://investright.in"
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Internship.deleteMany({});
  await Internship.insertMany(internships);
  console.log('✅ Database seeded with 10 internships!');
  process.exit();
}

seed().catch(err => { console.error(err); process.exit(1); });

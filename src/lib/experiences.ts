export type Experience = {
  id: string;
  company: string;
  role: string;
  roleType?: "internship" | "leadership" | "design-team" | "event";
  location?: string;
  startDate: string;
  endDate: string | "present";
  tier: "primary" | "secondary";
  headline: string;
  description?: string;
  stack?: string[];
  dateRange: string;
};

export const EXPERIENCES: Experience[] = [
  {
    id: "dsc-vp",
    roleType: "leadership",
    company: "UW Data Science Club",
    role: "VP of Workshops",
    startDate: "Jan 2026",
    endDate: "present",
    dateRange: "Jan 2026 – present",
    tier: "primary",
    headline: "Established UW Tinkerer Studio, a mentored open-source AI program.",
    description: "Built out a new collaboration between DSC and HumanFeedback where students form teams to work on real open-source AI projects with mentor guidance.",
    stack: ["mentorship", "program design", "HumanFeedback collab"]
  },
  {
    id: "cognichip",
    roleType: "internship",
    company: "Cognichip",
    role: "ML Engineer Intern",
    location: "Redwood City, CA",
    startDate: "Sept 2025",
    endDate: "present",
    dateRange: "Sept 2025 – present",
    tier: "primary",
    headline: "Building evaluation infrastructure for agentic AI systems in chip design.",
    description: "Designed an end-to-end evaluation pipeline for LLMs and agentic systems using LangSmith and custom tooling. Focused on token efficiency, RAG quality, tool-use reliability, and multi-step agent behavior.",
    stack: ["LangSmith", "Python", "agentic systems", "LLM eval", "RAG"]
  },
  {
    id: "nasa-goddard",
    roleType: "event",
    company: "NASA Goddard",
    role: "Space Apps 2024 Winner's Celebration",
    startDate: "June 2025",
    endDate: "June 2025",
    dateRange: "June 2025",
    tier: "secondary",
    headline: "Attended NASA Goddard as a Space Apps 2024 finalist."
  },
  {
    id: "dsc-lead",
    roleType: "leadership",
    company: "UW Data Science Club",
    role: "Workshop Lead & Mentor",
    startDate: "Jan 2025",
    endDate: "Jan 2026",
    dateRange: "Jan 2025 – Jan 2026",
    tier: "primary",
    headline: "Ran workshops and mentored students in ML and computational neuroscience.",
    description: "Led technical workshops including Intro to ML and Intro to Computational Neuroscience. Mentored students across skill levels through their first hands-on projects.",
    stack: ["workshop design", "mentorship", "ML fundamentals", "comp neuro intro"]
  },
  {
    id: "nasa-local-lead",
    roleType: "leadership",
    company: "NASA Space Apps Challenge",
    role: "Local Lead",
    startDate: "Oct 2024",
    endDate: "Oct 2024",
    dateRange: "Oct 2024",
    tier: "secondary",
    headline: "Led the local chapter of NASA's annual global hackathon."
  },
  {
    id: "ai-tinkerers",
    roleType: "leadership",
    company: "AI Tinkerers Toronto",
    role: "Co-host",
    location: "Shopify HQ",
    startDate: "Sept 2024",
    endDate: "present",
    dateRange: "Sept 2024 – present",
    tier: "secondary",
    headline: "Co-hosted AI Tinkerers meetup at Shopify Toronto."
  },
  {
    id: "healthyher",
    roleType: "internship",
    company: "HealthyHer.life",
    role: "AI/ML Developer Intern",
    location: "Oakville, ON",
  startDate: "May 2024",
    endDate: "Dec 2024",
    dateRange: "May 2024 – Dec 2024",
    tier: "primary",
    headline: "Shipped Hailey, a women's health conversational AI, from concept to deployment.",
    description: "Led development of Hailey end-to-end. Engineered prompt strategies that improved empathy and accuracy by 15-25%, built a QA logging GUI, and explored LangChain and RAG approaches with Mila Institute advisors.",
    stack: ["LangChain", "RAG", "conversational AI", "prompt engineering", "Mila collab"]
  },
  {
    id: "watolink",
    company: "WATOlink",
    role: "ML Engineer",
    roleType: "design-team",
    location: "University of Waterloo",
    startDate: "Sept 2023",
    endDate: "Apr 2024",
    dateRange: "Sept 2023 – Apr 2024",
    tier: "primary",
    headline: "Biomedical ML project: reconstructing EMG signals into speech.",
    description: "Worked on the Simphonic's project, building deep learning models (LSTMs and autoencoders) to reconstruct muscle signals into speech output. Contributed to the ML engineering side of cross-modal signal translation for real-time biomedical applications. The project was 1st place winner of CUCAI 2024!",
    stack: ["PyTorch", "LSTMs", "autoencoders", "EMG", "signal processing", "biomedical ML"]
  },
  {
    id: "assetsoft",
    roleType: "internship",
    company: "Assetsoft Consulting",
    role: "AI Software Developer Intern",
    location: "Markham, ON",
    startDate: "Sept 2023",
    endDate: "Dec 2023",
    dateRange: "Sept 2023 – Dec 2023",
    tier: "primary",
    headline: "Deployed an invoice classification pipeline used by 500+ enterprise users.",
    description: "Built a deep learning model for invoice element classification combining NLP and Neural OCR. Deployed model and backend APIs to Azure within  .NET infrastructure, and designed a scalable database schema.",
    stack: ["deep learning", "NLP", "OCR", "Azure", "C# .NET"]
  },
  {
    id: "wai",
    roleType: "leadership",
    company: "Women in AI & Robotics",
    role: "Student Ambassador",
    startDate: "June 2023",
    endDate: "present",
    dateRange: "June 2023 – present",
    tier: "secondary",
    headline: "Became a student ambassador for Women in AI & Robotics."
  },
  {
    id: "myant",
    roleType: "internship",
    company: "Myant Inc.",
    role: "Software Engineer Intern",
    location: "Etobicoke, ON",
    startDate: "Jan 2023",
    endDate: "Apr 2023",
    dateRange: "Jan 2023 – Apr 2023",
    tier: "primary",
    headline: "Built real-time biosignal processing for wearable sensors.",
    description: "Processed ECG, temperature, pressure, and motion signals from wearable sensors. Built a BLE-enabled Python app that replaced a legacy C# interface for real-time acquisition, integrated ML classification models, and improved data efficiency by 30%.",
    stack: ["Python", "BLE", "ECG", "biosignal processing", "ML classification"]
  }
];

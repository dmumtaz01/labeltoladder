// Mock candidates + employer tasks for the demo loop.
// In production these would come from Lovable Cloud.

export type MockCandidate = {
  id: string;
  name: string;
  country: string;
  languages: string[];
  level: number;
  accuracy: number;
  language: number;
  reasoning: number;
  hoursPerWeek: number;
  interests: string[];
  joinedDays: number;
};

export const MOCK_CANDIDATES: MockCandidate[] = [
  {
    id: "L2L-AMARA001",
    name: "Amara Okeke",
    country: "Nigeria",
    languages: ["English", "Igbo"],
    level: 3,
    accuracy: 0.87,
    language: 0.84,
    reasoning: 0.79,
    hoursPerWeek: 25,
    interests: ["Writing", "Education", "Tech support"],
    joinedDays: 4,
  },
  {
    id: "L2L-RAVI002",
    name: "Ravi Sharma",
    country: "India",
    languages: ["English", "Hindi", "Tamil"],
    level: 4,
    accuracy: 0.91,
    language: 0.88,
    reasoning: 0.86,
    hoursPerWeek: 30,
    interests: ["Translation", "Coding", "Math"],
    joinedDays: 12,
  },
  {
    id: "L2L-FATIM03",
    name: "Fatima Diallo",
    country: "Senegal",
    languages: ["French", "Wolof", "English"],
    level: 2,
    accuracy: 0.78,
    language: 0.82,
    reasoning: 0.7,
    hoursPerWeek: 18,
    interests: ["Health", "Translation"],
    joinedDays: 2,
  },
  {
    id: "L2L-JOSE004",
    name: "José Mendoza",
    country: "Philippines",
    languages: ["English", "Tagalog"],
    level: 5,
    accuracy: 0.93,
    language: 0.9,
    reasoning: 0.91,
    hoursPerWeek: 35,
    interests: ["Customer support", "Writing", "Teaching"],
    joinedDays: 28,
  },
  {
    id: "L2L-AISHA05",
    name: "Aisha Hassan",
    country: "Kenya",
    languages: ["English", "Swahili"],
    level: 3,
    accuracy: 0.85,
    language: 0.86,
    reasoning: 0.77,
    hoursPerWeek: 22,
    interests: ["Agriculture", "Education"],
    joinedDays: 7,
  },
  {
    id: "L2L-LINH006",
    name: "Linh Nguyen",
    country: "Vietnam",
    languages: ["Vietnamese", "English"],
    level: 1,
    accuracy: 0.68,
    language: 0.72,
    reasoning: 0.6,
    hoursPerWeek: 15,
    interests: ["Image tagging", "E-commerce"],
    joinedDays: 1,
  },
  {
    id: "L2L-MIGUEL7",
    name: "Miguel Santos",
    country: "Brazil",
    languages: ["Portuguese", "English", "Spanish"],
    level: 4,
    accuracy: 0.89,
    language: 0.91,
    reasoning: 0.82,
    hoursPerWeek: 28,
    interests: ["Translation", "Marketing"],
    joinedDays: 18,
  },
  {
    id: "L2L-PRIYA08",
    name: "Priya Patel",
    country: "India",
    languages: ["English", "Hindi", "Gujarati"],
    level: 2,
    accuracy: 0.76,
    language: 0.79,
    reasoning: 0.71,
    hoursPerWeek: 20,
    interests: ["Customer support", "Health"],
    joinedDays: 5,
  },
];

export type MockTask = {
  id: string;
  employer: string;
  title: string;
  category: "annotation" | "rating" | "review" | "translation" | "training";
  minLevel: number;
  languages: string[];
  hourly: string;
  hoursEstimate: number;
  postedDays: number;
  description: string;
};

export const MOCK_TASKS: MockTask[] = [
  {
    id: "T-1042",
    employer: "Northwind AI Lab",
    title: "Rate helpfulness of chatbot replies (English)",
    category: "rating",
    minLevel: 2,
    languages: ["English"],
    hourly: "$4 / hr",
    hoursEstimate: 20,
    postedDays: 1,
    description: "Compare two AI responses to user questions and rate which is more helpful and safe.",
  },
  {
    id: "T-1051",
    employer: "Lingua Bridge",
    title: "Translate short product reviews EN ↔ FR",
    category: "translation",
    minLevel: 3,
    languages: ["English", "French"],
    hourly: "$7 / hr",
    hoursEstimate: 15,
    postedDays: 3,
    description: "Translate ~200 short reviews per day, preserving tone and intent.",
  },
  {
    id: "T-1063",
    employer: "MedScribe",
    title: "Audit clinical-note labels for PII errors",
    category: "review",
    minLevel: 4,
    languages: ["English"],
    hourly: "$11 / hr",
    hoursEstimate: 10,
    postedDays: 2,
    description: "Quality-review labeled medical text. Flag mislabeled PII and ambiguous categories.",
  },
  {
    id: "T-1070",
    employer: "AgriSense",
    title: "Tag crop disease images (East Africa)",
    category: "annotation",
    minLevel: 1,
    languages: ["English", "Swahili"],
    hourly: "$3 / hr",
    hoursEstimate: 30,
    postedDays: 5,
    description: "Classify crop photos by disease type. Training data for a smallholder farmer assistant.",
  },
  {
    id: "T-1088",
    employer: "Atlas Robotics",
    title: "Domain training: customer-support escalation",
    category: "training",
    minLevel: 5,
    languages: ["English"],
    hourly: "$18 / hr",
    hoursEstimate: 8,
    postedDays: 1,
    description: "Demonstrate ideal escalation handling for a support assistant in your domain.",
  },
];

import type { Level } from "./types";

export const LEVELS: Level[] = [
  {
    level: 0,
    title: "Not Yet Ready",
    description:
      "We recommend short practice rounds before applying to paid tasks. Your judgment will sharpen quickly.",
    exampleTasks: ["Practice exercises", "Tutorial micro-tasks"],
    hourly: "—",
  },
  {
    level: 1,
    title: "Annotator",
    description:
      "Label data, tag images, sort short text. Reliable, structured tasks to build your record.",
    exampleTasks: ["Image tagging", "Text categorization", "Intent labeling"],
    hourly: "$2 – $4 / hr",
  },
  {
    level: 2,
    title: "Output Rater",
    description: "Compare and rate AI responses. Your judgment shapes how models learn.",
    exampleTasks: ["Compare two AI replies", "Rate helpfulness", "Flag unsafe outputs"],
    hourly: "$3 – $6 / hr",
  },
  {
    level: 3,
    title: "Reviewer",
    description: "Review the work of annotators. Catch errors. Maintain dataset quality.",
    exampleTasks: ["Audit annotator batches", "Resolve disagreements", "Quality sampling"],
    hourly: "$5 – $9 / hr",
  },
  {
    level: 4,
    title: "QA Specialist",
    description: "Own quality across projects. Define guidelines and edge cases.",
    exampleTasks: ["Write annotation guidelines", "Edge-case taxonomy", "Calibration sessions"],
    hourly: "$8 – $14 / hr",
  },
  {
    level: 5,
    title: "Domain Trainer",
    description: "Train AI in your domain — culture, language, profession. Shape model behavior.",
    exampleTasks: ["Domain prompt sets", "Cultural fine-tuning", "Expert demonstrations"],
    hourly: "$12 – $25 / hr",
  },
  {
    level: 6,
    title: "Team Lead",
    description: "Lead a remote team of contributors. Coordinate, mentor, and report quality.",
    exampleTasks: ["Lead 10–30 contributors", "Client reporting", "Hire & onboard"],
    hourly: "$18 – $40 / hr",
  },
];

export function getLevel(n: number): Level {
  return LEVELS[Math.max(0, Math.min(6, n))];
}

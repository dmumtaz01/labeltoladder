// Practical test bank — six categories, drawn from PRD section 8.3.
// Each task has a single correct answer index plus a short explanation.

export type TestCategory =
  | "grammar"
  | "ai-compare"
  | "factcheck"
  | "scam"
  | "tone"
  | "translation";

export type TestTask = {
  id: string;
  category: TestCategory;
  prompt: string;
  context?: string;
  options: string[];
  correct: number;
  explain: string;
  // Which underlying skill dimensions this task informs:
  dims: Array<"language" | "reasoning" | "accuracy">;
};

export const TEST_BANK: TestTask[] = [
  // GRAMMAR
  {
    id: "g1",
    category: "grammar",
    prompt: "Pick the grammatically correct sentence.",
    options: [
      "She don't like coffee in the morning.",
      "She doesn't likes coffee in the morning.",
      "She doesn't like coffee in the morning.",
      "She not like coffee in the morning.",
    ],
    correct: 2,
    explain: "Third-person singular uses 'doesn't like'.",
    dims: ["language", "accuracy"],
  },
  {
    id: "g2",
    category: "grammar",
    prompt: "Which sentence is correctly punctuated?",
    options: [
      "After the meeting we'll review the report, and send feedback.",
      "After the meeting, we'll review the report and send feedback.",
      "After, the meeting we'll review the report and send feedback.",
      "After the meeting we'll, review the report and send feedback.",
    ],
    correct: 1,
    explain: "Comma after the introductory clause; no comma before 'and' joining two verbs.",
    dims: ["language", "accuracy"],
  },

  // AI COMPARE
  {
    id: "a1",
    category: "ai-compare",
    prompt: "User asked: 'Explain photosynthesis to a 10-year-old in 2 sentences.' Which AI reply is better?",
    options: [
      "Reply A: Photosynthesis is the metabolic pathway in chlorophyll-bearing organisms wherein light photons drive the reduction of CO₂ via the Calvin-Benson cycle.",
      "Reply B: Plants use sunlight, water, and air to make their own food. The leaves act like little kitchens powered by the sun.",
      "Reply C: It is when plant grow up by sun and become big tree forest happy.",
      "Reply D: I cannot answer questions about plants.",
    ],
    correct: 1,
    explain: "Reply B matches the audience and length constraint. A is too technical; C is broken English; D refuses unnecessarily.",
    dims: ["reasoning", "language"],
  },
  {
    id: "a2",
    category: "ai-compare",
    prompt: "User asked: 'Write a polite email declining a job offer.' Which reply is best?",
    options: [
      "No thanks. — Sent from my phone.",
      "Dear hiring manager, I am writing to inform you that I am unable to accept the offer. Thank you for the opportunity, and I wish your team continued success.",
      "Hey, I think I'm gonna pass lol. Good luck though!",
      "I REGRET TO INFORM YOU THAT I MUST DECLINE THIS POSITION DUE TO MULTIPLE COMPETING OFFERS.",
    ],
    correct: 1,
    explain: "Polite, professional, and complete. Others are too casual, rude, or shouty.",
    dims: ["reasoning", "language"],
  },

  // FACTCHECK
  {
    id: "f1",
    category: "factcheck",
    prompt: "Which statement contains a factual error?",
    options: [
      "The Sahara is the largest hot desert in the world.",
      "Mount Everest sits on the border of Nepal and Tibet.",
      "The Amazon River flows mainly through Brazil.",
      "Australia is the smallest continent and also the smallest country.",
    ],
    correct: 3,
    explain: "Australia is the smallest continent but it is NOT the smallest country — Vatican City holds that title.",
    dims: ["accuracy", "reasoning"],
  },
  {
    id: "f2",
    category: "factcheck",
    prompt: "An AI claims: 'Albert Einstein won the Nobel Prize for the theory of relativity in 1921.' What's wrong?",
    options: [
      "Nothing — this is correct.",
      "The year is wrong; it was 1925.",
      "Einstein won the 1921 Nobel for the photoelectric effect, not relativity.",
      "Einstein never won a Nobel Prize.",
    ],
    correct: 2,
    explain: "Einstein's 1921 Nobel was awarded for his work on the photoelectric effect.",
    dims: ["accuracy", "reasoning"],
  },

  // SCAM
  {
    id: "s1",
    category: "scam",
    prompt: "Which message is most likely a scam?",
    options: [
      "Reminder: your dentist appointment is tomorrow at 3 PM. Reply C to confirm.",
      "URGENT: Your bank acct will be CLOSED in 2hrs. Click http://bnk-secure-login.tk to verify NOW.",
      "Mom: don't forget to pick up bread on your way home ❤️",
      "Order #4421 has shipped. Track at amazon.com/orders.",
    ],
    correct: 1,
    explain: "Urgency, threats, suspicious shortened/non-bank domain, and a 'click to verify' login link are classic phishing markers.",
    dims: ["reasoning", "accuracy"],
  },
  {
    id: "s2",
    category: "scam",
    prompt: "A 'recruiter' offers $80/hour to do data entry but asks you to first pay $200 for 'training software'. What's the right call?",
    options: [
      "Pay it — high pay justifies the risk.",
      "Decline. Legitimate employers do not charge workers upfront fees.",
      "Pay half upfront and half after the first task.",
      "Send your bank details so they can pay you the $200 back.",
    ],
    correct: 1,
    explain: "Charging workers an upfront fee is a textbook advance-fee scam.",
    dims: ["reasoning", "accuracy"],
  },

  // TONE
  {
    id: "t1",
    category: "tone",
    prompt: "Which message has the most professional and respectful tone for a customer support reply?",
    options: [
      "lol that's not our problem, talk to the manufacturer",
      "We sincerely apologize for the inconvenience. We've escalated your case and will follow up within 24 hours.",
      "you should have read the manual before ordering",
      "fine, we'll refund you. happy now?",
    ],
    correct: 1,
    explain: "Acknowledges the issue, apologizes, and gives a clear next step.",
    dims: ["language", "reasoning"],
  },
  {
    id: "t2",
    category: "tone",
    prompt: "Pick the message that best matches a friendly, casual tone for a chat with a teammate.",
    options: [
      "Pursuant to our prior discussion, kindly furnish the requested document at your earliest convenience.",
      "DOCUMENT. NOW.",
      "Hey! When you get a sec, could you send over that doc we talked about? 🙏",
      "Doc?",
    ],
    correct: 2,
    explain: "Warm, polite, and informal — the right register for teammates.",
    dims: ["language", "reasoning"],
  },

  // TRANSLATION
  {
    id: "tr1",
    category: "translation",
    prompt: "English: 'It's raining cats and dogs.' Which translation captures the meaning best (not the literal words)?",
    options: [
      "A translation that literally says 'cats and dogs are falling from the sky'.",
      "A translation that means 'it is raining very heavily'.",
      "A translation that means 'animals are loose outside'.",
      "A translation that means 'the weather is mild'.",
    ],
    correct: 1,
    explain: "Idioms should be translated by meaning, not word-for-word.",
    dims: ["language", "reasoning"],
  },
  {
    id: "tr2",
    category: "translation",
    prompt: "A friend translates 'I'm feeling under the weather' as 'I am standing below the clouds.' What feedback is best?",
    options: [
      "Perfect — the translation is accurate.",
      "Wrong meaning. The English idiom means 'feeling sick'; the translation should convey illness, not weather.",
      "Add more weather words to make it richer.",
      "Change 'clouds' to 'rain' for accuracy.",
    ],
    correct: 1,
    explain: "Idiomatic meaning matters more than literal words.",
    dims: ["language", "reasoning"],
  },
];

export const CATEGORY_LABELS: Record<TestCategory, string> = {
  grammar: "Grammar & Clarity",
  "ai-compare": "AI Response Comparison",
  factcheck: "Fact Verification",
  scam: "Scam & Risk Detection",
  tone: "Tone & Register",
  translation: "Translation Judgment",
};

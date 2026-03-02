// 10 questions that estimate AI applicability based on work characteristics
// Weights derived from the paper's key findings:
//   - Language/translation tasks → highest AI applicability (interpreters, writers ~0.45-0.49)
//   - Research/analysis tasks → high applicability (historians, analysts ~0.35-0.46)
//   - Physical/manual tasks → lowest applicability (construction, cleaning ~0.00-0.05)
//
// Each question: { id, text, hint, options[], weight, inverse }
//   weight: contribution magnitude (all positive, 0-1 normalized)
//   inverse: if true, higher answer = LOWER AI applicability (physical tasks)

import { t } from './i18n.js';

const questionsData = {
  en: [
    {
      id: 1,
      text: "How much of your work involves writing, editing, or creating text content?",
      hint: "Reports, articles, emails, documentation, marketing copy, scripts...",
      weight: 0.15,
      inverse: false,
      options: [
        "Never — I rarely write anything",
        "Occasionally — some emails or short notes",
        "Regularly — writing is a meaningful part of my role",
        "Frequently — I produce substantial written content",
        "Constantly — writing is the core of what I do"
      ]
    },
    {
      id: 2,
      text: "How often do you translate, summarize, or reframe complex information for others?",
      hint: "Translating languages, simplifying technical content, briefing stakeholders...",
      weight: 0.16,
      inverse: false,
      options: [
        "Never — I don't do this",
        "Rarely — only in unusual situations",
        "Sometimes — it's part of my communication duties",
        "Often — I regularly bridge knowledge gaps",
        "Always — this is essentially my job"
      ]
    },
    {
      id: 3,
      text: "How much does your job involve researching, gathering, and synthesizing information?",
      hint: "Market research, literature reviews, data gathering, investigative work...",
      weight: 0.13,
      inverse: false,
      options: [
        "Never — I work with what's given to me",
        "Occasionally — I look things up sometimes",
        "Regularly — research supports my decisions",
        "Frequently — deep research is a major part of my role",
        "Constantly — I'm primarily a researcher or analyst"
      ]
    },
    {
      id: 4,
      text: "How much of your work involves analyzing data, numbers, or quantitative information?",
      hint: "Spreadsheets, statistics, financial analysis, metrics, forecasting...",
      weight: 0.11,
      inverse: false,
      options: [
        "Never — I don't work with numbers",
        "Occasionally — basic calculations or tracking",
        "Regularly — data analysis supports my work",
        "Frequently — I spend significant time with data",
        "Constantly — quantitative analysis is my primary function"
      ]
    },
    {
      id: 5,
      text: "How much of your role involves communicating with or persuading customers, clients, or the public?",
      hint: "Sales calls, customer service, public relations, presentations, counseling...",
      weight: 0.11,
      inverse: false,
      options: [
        "Never — I have no client/public-facing duties",
        "Occasionally — minimal interaction",
        "Regularly — client communication is part of my role",
        "Frequently — persuasion and outreach are key duties",
        "Constantly — I'm in sales, service, or public-facing work all day"
      ]
    },
    {
      id: 6,
      text: "How much of your work involves physical labor or working with your hands?",
      hint: "Construction, repair, surgery, cooking, cleaning, operating machinery...",
      weight: 0.18,
      inverse: true,
      options: [
        "Never — my work is entirely desk/screen-based",
        "Rarely — occasional light physical tasks",
        "Sometimes — a mix of physical and non-physical work",
        "Often — most of my work is physical",
        "Always — my job is almost entirely physical"
      ]
    },
    {
      id: 7,
      text: "How much precision handwork or fine motor skill does your job require?",
      hint: "Surgical procedures, instrument repair, dental work, art restoration, lab work...",
      weight: 0.12,
      inverse: true,
      options: [
        "None — no fine motor precision needed",
        "Minimal — occasional detailed hand work",
        "Moderate — some tasks require careful handwork",
        "High — precision is regularly critical",
        "Extreme — my job demands exceptional manual dexterity"
      ]
    },
    {
      id: 8,
      text: "How much does your work involve coding, scripting, or software development?",
      hint: "Writing code, debugging, system configuration, automation scripts...",
      weight: 0.04,
      inverse: false,
      options: [
        "Never — I don't write any code",
        "Rarely — occasional simple scripts or formulas",
        "Sometimes — coding supports my main work",
        "Often — I write code regularly",
        "Always — software development is my primary job"
      ]
    },
    {
      id: 9,
      text: "How much of your work involves creative ideation or brainstorming?",
      hint: "Generating ideas, creative writing, design concepts, strategic planning, problem-solving...",
      weight: 0.08,
      inverse: false,
      options: [
        "Never — I follow established procedures",
        "Rarely — occasional creative input",
        "Sometimes — creativity is a useful part of my role",
        "Often — I generate ideas and concepts regularly",
        "Always — creative thinking is central to my job"
      ]
    },
    {
      id: 10,
      text: "How much does your work involve teaching, explaining, or mentoring others?",
      hint: "Training sessions, tutoring, classroom teaching, onboarding, coaching...",
      weight: 0.10,
      inverse: false,
      options: [
        "Never — I don't teach or mentor",
        "Occasionally — I explain things when asked",
        "Regularly — training is part of my responsibilities",
        "Frequently — I spend significant time educating others",
        "Constantly — teaching or mentoring is my primary role"
      ]
    }
  ],

  de: [
    {
      id: 1,
      text: "Wie viel deiner Arbeit umfasst das Schreiben, Bearbeiten oder Erstellen von Textinhalten?",
      hint: "Berichte, Artikel, E-Mails, Dokumentationen, Marketingtexte, Skripte...",
      weight: 0.15,
      inverse: false,
      options: [
        "Nie — ich schreibe selten etwas",
        "Gelegentlich — einige E-Mails oder kurze Notizen",
        "Regelmäßig — Schreiben ist ein wesentlicher Teil meiner Rolle",
        "Häufig — ich erstelle umfangreiche schriftliche Inhalte",
        "Ständig — Schreiben ist der Kern meiner Arbeit"
      ]
    },
    {
      id: 2,
      text: "Wie oft übersetzt, fasst du zusammen oder bereitest du komplexe Informationen für andere auf?",
      hint: "Sprachen übersetzen, technische Inhalte vereinfachen, Stakeholder briefen...",
      weight: 0.16,
      inverse: false,
      options: [
        "Nie — das mache ich nicht",
        "Selten — nur in ungewöhnlichen Situationen",
        "Manchmal — es gehört zu meinen Kommunikationsaufgaben",
        "Oft — ich überbrücke regelmäßig Wissenslücken",
        "Immer — das ist im Wesentlichen mein Job"
      ]
    },
    {
      id: 3,
      text: "Wie viel deiner Arbeit umfasst Recherche, Informationsbeschaffung und -synthese?",
      hint: "Marktforschung, Literaturrecherche, Datenerhebung, investigative Arbeit...",
      weight: 0.13,
      inverse: false,
      options: [
        "Nie — ich arbeite mit dem, was mir gegeben wird",
        "Gelegentlich — ich schaue manchmal etwas nach",
        "Regelmäßig — Recherche unterstützt meine Entscheidungen",
        "Häufig — tiefgehende Recherche ist ein wesentlicher Teil meiner Rolle",
        "Ständig — ich bin hauptsächlich Rechercheur oder Analyst"
      ]
    },
    {
      id: 4,
      text: "Wie viel deiner Arbeit umfasst die Analyse von Daten, Zahlen oder quantitativen Informationen?",
      hint: "Tabellenkalkulationen, Statistiken, Finanzanalysen, Kennzahlen, Prognosen...",
      weight: 0.11,
      inverse: false,
      options: [
        "Nie — ich arbeite nicht mit Zahlen",
        "Gelegentlich — einfache Berechnungen oder Nachverfolgung",
        "Regelmäßig — Datenanalyse unterstützt meine Arbeit",
        "Häufig — ich verbringe viel Zeit mit Daten",
        "Ständig — quantitative Analyse ist meine Hauptaufgabe"
      ]
    },
    {
      id: 5,
      text: "Wie viel deiner Rolle umfasst die Kommunikation mit oder das Überzeugen von Kunden, Klienten oder der Öffentlichkeit?",
      hint: "Verkaufsgespräche, Kundenservice, Öffentlichkeitsarbeit, Präsentationen, Beratung...",
      weight: 0.11,
      inverse: false,
      options: [
        "Nie — ich habe keine kunden-/öffentlichkeitsbezogenen Aufgaben",
        "Gelegentlich — minimale Interaktion",
        "Regelmäßig — Kundenkommunikation ist Teil meiner Rolle",
        "Häufig — Überzeugung und Kontaktpflege sind Kernaufgaben",
        "Ständig — ich bin den ganzen Tag im Verkauf, Service oder in der Öffentlichkeitsarbeit"
      ]
    },
    {
      id: 6,
      text: "Wie viel deiner Arbeit umfasst körperliche Arbeit oder Arbeit mit den Händen?",
      hint: "Bau, Reparatur, Chirurgie, Kochen, Reinigung, Bedienung von Maschinen...",
      weight: 0.18,
      inverse: true,
      options: [
        "Nie — meine Arbeit ist komplett schreibtisch-/bildschirmbasiert",
        "Selten — gelegentlich leichte körperliche Aufgaben",
        "Manchmal — eine Mischung aus physischer und nicht-physischer Arbeit",
        "Oft — der Großteil meiner Arbeit ist körperlich",
        "Immer — mein Job ist fast ausschließlich körperlich"
      ]
    },
    {
      id: 7,
      text: "Wie viel Präzisionshandarbeit oder feinmotorisches Geschick erfordert dein Job?",
      hint: "Chirurgische Eingriffe, Instrumentenreparatur, Zahnarztarbeit, Kunstrestaurierung, Laborarbeit...",
      weight: 0.12,
      inverse: true,
      options: [
        "Keine — keine feinmotorische Präzision erforderlich",
        "Minimal — gelegentlich detaillierte Handarbeit",
        "Moderat — einige Aufgaben erfordern sorgfältige Handarbeit",
        "Hoch — Präzision ist regelmäßig entscheidend",
        "Extrem — mein Job erfordert außergewöhnliche manuelle Geschicklichkeit"
      ]
    },
    {
      id: 8,
      text: "Wie viel deiner Arbeit umfasst Programmieren, Scripting oder Softwareentwicklung?",
      hint: "Code schreiben, Debugging, Systemkonfiguration, Automatisierungsskripte...",
      weight: 0.04,
      inverse: false,
      options: [
        "Nie — ich schreibe keinen Code",
        "Selten — gelegentlich einfache Skripte oder Formeln",
        "Manchmal — Programmieren unterstützt meine Hauptarbeit",
        "Oft — ich schreibe regelmäßig Code",
        "Immer — Softwareentwicklung ist mein Hauptberuf"
      ]
    },
    {
      id: 9,
      text: "Wie viel deiner Arbeit umfasst kreative Ideenfindung oder Brainstorming?",
      hint: "Ideen generieren, kreatives Schreiben, Designkonzepte, strategische Planung, Problemlösung...",
      weight: 0.08,
      inverse: false,
      options: [
        "Nie — ich folge etablierten Verfahren",
        "Selten — gelegentlich kreativer Beitrag",
        "Manchmal — Kreativität ist ein nützlicher Teil meiner Rolle",
        "Oft — ich entwickle regelmäßig Ideen und Konzepte",
        "Immer — kreatives Denken ist zentral für meinen Job"
      ]
    },
    {
      id: 10,
      text: "Wie viel deiner Arbeit umfasst Lehren, Erklären oder Mentoring?",
      hint: "Schulungen, Nachhilfe, Unterricht, Einarbeitung, Coaching...",
      weight: 0.10,
      inverse: false,
      options: [
        "Nie — ich unterrichte oder betreue nicht",
        "Gelegentlich — ich erkläre Dinge, wenn ich gefragt werde",
        "Regelmäßig — Schulung gehört zu meinen Aufgaben",
        "Häufig — ich verbringe viel Zeit damit, andere auszubilden",
        "Ständig — Lehren oder Mentoring ist meine Hauptaufgabe"
      ]
    }
  ]
};

const lang = document.documentElement.lang === 'de' ? 'de' : 'en';
export const questions = questionsData[lang];

// Compute AI applicability score from answers (array of 0-4 values)
// Returns a value between 0 and 1 (matching the paper's scale)
export function computeScore(answers) {
  let score = 0;
  let totalWeight = 0;

  questions.forEach((q, i) => {
    const answer = answers[i];
    if (answer === undefined || answer === null) return;

    const normalized = answer / 4; // 0 to 1
    totalWeight += q.weight;

    if (q.inverse) {
      // Higher answer = less AI applicable
      score += q.weight * (1 - normalized);
    } else {
      // Higher answer = more AI applicable
      score += q.weight * normalized;
    }
  });

  // Normalize to 0-1 range based on total possible weight
  // Then scale to match the paper's observed range (~0 to 0.49)
  // The max raw score would be totalWeight (all maximums)
  // We scale output to 0-0.50 range to match paper's scale
  const rawScore = totalWeight > 0 ? score / totalWeight : 0;
  return rawScore * 0.50;
}

// Get a human-readable label for a score
export function getScoreLabel(score) {
  if (score < 0.08) return { label: t.scoreLabelVeryLow, description: t.scoreDescVeryLow };
  if (score < 0.15) return { label: t.scoreLabelLow, description: t.scoreDescLow };
  if (score < 0.22) return { label: t.scoreLabelModerate, description: t.scoreDescModerate };
  if (score < 0.32) return { label: t.scoreLabelHigh, description: t.scoreDescHigh };
  return { label: t.scoreLabelVeryHigh, description: t.scoreDescVeryHigh };
}

// Estimate a timeline for significant AI transformation of the occupation.
// Based on Metaculus community forecasts (~1,700 forecasters, as of March 2026):
//   - Weakly general AI expected by ~2028 (median)
//   - General AI (strong) expected by ~2033 (median)
//   - https://metaculus.com/questions/3479/ and /5121/
//
// These are substantially earlier than the Grace et al. (2024) survey of
// 2,778 AI researchers (arXiv:2401.02843), which estimated:
//   - 50% chance of HLMI by 2047, 10% chance of FAOL by 2037
// The acceleration reflects rapid AI progress since 2023.
//
// The score (0–0.50) is used to interpolate within these timelines:
//   Higher applicability → tasks are already being transformed → sooner impact
//   Lower applicability → physical/embodied work → later impact
export function getTimelineEstimate(score) {
  // Normalize score to 0–1 range
  const t_val = Math.min(score / 0.50, 1);

  // Apply easing: high-applicability jobs separate more at the early end
  const eased = Math.pow(t_val, 0.6);

  // "Significant transformation" = most tasks in the role automatable
  // Anchored to Metaculus forecasts: weak AGI ~2028, strong AGI ~2033
  // High-applicability (0.50): ~2026 optimistic / ~2030 median / ~2037 conservative
  // Low-applicability  (0.00): ~2037 optimistic / ~2045 median / ~2060 conservative
  const earlyRange = [2037, 2026]; // [score=0, score=max]
  const midRange   = [2045, 2030]; // anchored to ~AGI timeline
  const lateRange  = [2060, 2037]; // conservative bound

  const earlyYear = Math.round(earlyRange[0] - eased * (earlyRange[0] - earlyRange[1]));
  const midYear   = Math.round(midRange[0]   - eased * (midRange[0]   - midRange[1]));
  const lateYear  = Math.round(lateRange[0]  - eased * (lateRange[0]  - lateRange[1]));

  // Generate a description based on score tier
  let outlook;
  if (score >= 0.32) {
    outlook = t.outlookVeryHigh;
  } else if (score >= 0.22) {
    outlook = t.outlookHigh;
  } else if (score >= 0.15) {
    outlook = t.outlookModerate;
  } else if (score >= 0.08) {
    outlook = t.outlookLow;
  } else {
    outlook = t.outlookVeryLow;
  }

  return { earlyYear, midYear, lateYear, outlook };
}

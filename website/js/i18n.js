// Internationalization strings for the Working with AI quiz
// Detected from document.documentElement.lang

const translations = {
  en: {
    // Landing screen
    badgeText: 'Based on Microsoft Research data',
    headlinePrefix: 'Could',
    headlineAI: 'AI',
    headlineSuffix: 'do\nyour job?',
    subtitle: 'Answer 10 questions about the nature of your work and discover how applicable today\'s AI tools are to your occupation — based on real usage data from 787 occupations.',
    startBtn: 'Take the Quiz',
    metaTime: '⏱ ~2 minutes',
    metaOccupations: '📊 787 occupations',
    metaResearch: '🔬 Research-backed',

    // Question screen
    questionLabel: 'Question',
    nextBtn: 'Next',
    seeResultsBtn: 'See Results',
    backBtn: '← Back',

    // Result screen
    resultHeader: 'Your AI Applicability Score',
    timelineTitle: 'Estimated replacement timeline',
    timelineCaveat: 'Estimate based on <a href="https://www.metaculus.com/questions/5121/date-of-artificial-general-intelligence/" target="_blank" rel="noopener">Metaculus community forecasts</a> (~1,700 forecasters, as of March 2026). This is speculative — not a prediction of job displacement.',
    similarTitle: 'Occupations with similar AI applicability',
    explorerOpen: 'Browse all 787 occupations',
    explorerClose: 'Hide all occupations',
    restartBtn: '↻ Take the quiz again',
    searchPlaceholder: 'Search by job title or SOC code...',
    showingOf: (shown, total) => `Showing ${shown} of ${total} — type to filter`,
    noOccupations: 'No occupations found',

    // Footer
    footerResearch: 'Based on <a href="https://arxiv.org/abs/2507.07935" target="_blank" rel="noopener">"Working with AI: Measuring the Applicability of Generative AI to Occupations"</a> by Tomlinson et al., Microsoft Research (2025).',
    footerDisclaimer: 'Scores derived from Bing Copilot consumer usage data (Jan–Sep 2024). This quiz provides an estimate — not a prediction of job displacement.',
    footerGithub: '<a href="https://github.com/sinedied/working-with-ai" target="_blank" rel="noopener">View on GitHub</a>',
    footerBuilt: 'Built with ☕ and vibes by <a href="https://sinedied.github.io/" target="_blank" rel="noopener">sinedied</a>',

    // Score labels
    scoreLabelVeryLow: 'Very Low',
    scoreLabelLow: 'Low',
    scoreLabelModerate: 'Moderate',
    scoreLabelHigh: 'High',
    scoreLabelVeryHigh: 'Very High',
    scoreDescVeryLow: 'AI tools have minimal applicability to your type of work. Your role likely involves significant physical or hands-on tasks.',
    scoreDescLow: 'AI has limited applicability to your work. While some tasks might benefit, most of what you do requires human presence or physical skill.',
    scoreDescModerate: 'AI has moderate applicability to your work. Some of your tasks could be augmented by AI tools, particularly information processing and communication.',
    scoreDescHigh: 'AI has significant applicability to your type of work. Many of your tasks involve information, analysis, or communication that AI tools can assist with.',
    scoreDescVeryHigh: 'AI has very high applicability to your work. Your role heavily involves language, research, and information tasks where current AI tools show strong capability.',

    // Timeline outlooks
    outlookVeryHigh: 'Your type of work involves tasks where AI is already proving highly capable. Significant transformation of these roles is likely within the next few years.',
    outlookHigh: 'Many of your work tasks align with areas where AI is progressing rapidly. Expect substantial augmentation within 5–10 years, with deeper changes to follow.',
    outlookModerate: 'AI will likely augment parts of your work in the coming years, but full transformation will take longer as many tasks still require human judgment or presence.',
    outlookLow: 'Your work has characteristics that are harder for AI to replicate. While some tasks may be augmented, significant transformation is likely further out.',
    outlookVeryLow: 'Your work involves substantial physical or embodied tasks where AI progress is slowest. Robotic and physical AI capabilities lag well behind cognitive AI.',
  },

  de: {
    // Landing screen
    badgeText: 'Basierend auf Microsoft Research-Daten',
    headlinePrefix: 'Könnte',
    headlineAI: 'KI',
    headlineSuffix: 'deinen\nJob machen?',
    subtitle: 'Beantworte 10 Fragen über die Art deiner Arbeit und finde heraus, wie anwendbar heutige KI-Tools auf deinen Beruf sind — basierend auf echten Nutzungsdaten aus 787 Berufen.',
    startBtn: 'Quiz starten',
    metaTime: '⏱ ~2 Minuten',
    metaOccupations: '📊 787 Berufe',
    metaResearch: '🔬 Forschungsbasiert',

    // Question screen
    questionLabel: 'Frage',
    nextBtn: 'Weiter',
    seeResultsBtn: 'Ergebnisse anzeigen',
    backBtn: '← Zurück',

    // Result screen
    resultHeader: 'Dein KI-Anwendbarkeitsscore',
    timelineTitle: 'Geschätzte Automatisierungszeitachse',
    timelineCaveat: 'Schätzung basierend auf <a href="https://www.metaculus.com/questions/5121/date-of-artificial-general-intelligence/" target="_blank" rel="noopener">Prognosen der Metaculus-Community</a> (~1.700 Prognostiker, Stand März 2026). Dies ist spekulativ — keine Vorhersage über den Wegfall von Arbeitsplätzen.',
    similarTitle: 'Berufe mit ähnlicher KI-Anwendbarkeit',
    explorerOpen: 'Alle 787 Berufe durchsuchen',
    explorerClose: 'Alle Berufe ausblenden',
    restartBtn: '↻ Quiz erneut starten',
    searchPlaceholder: 'Nach Berufsbezeichnung oder SOC-Code suchen...',
    showingOf: (shown, total) => `${shown} von ${total} angezeigt — tippen zum Filtern`,
    noOccupations: 'Keine Berufe gefunden',

    // Footer
    footerResearch: 'Basierend auf <a href="https://arxiv.org/abs/2507.07935" target="_blank" rel="noopener">„Working with AI: Measuring the Applicability of Generative AI to Occupations"</a> von Tomlinson et al., Microsoft Research (2025).',
    footerDisclaimer: 'Scores abgeleitet aus Bing Copilot-Verbrauchernutzungsdaten (Jan.–Sep. 2024). Dieses Quiz liefert eine Schätzung — keine Vorhersage über den Wegfall von Arbeitsplätzen.',
    footerGithub: '<a href="https://github.com/sinedied/working-with-ai" target="_blank" rel="noopener">Auf GitHub ansehen</a>',
    footerBuilt: 'Erstellt mit ☕ und Vibes von <a href="https://sinedied.github.io/" target="_blank" rel="noopener">sinedied</a>',

    // Score labels
    scoreLabelVeryLow: 'Sehr niedrig',
    scoreLabelLow: 'Niedrig',
    scoreLabelModerate: 'Mittel',
    scoreLabelHigh: 'Hoch',
    scoreLabelVeryHigh: 'Sehr hoch',
    scoreDescVeryLow: 'KI-Tools haben nur minimale Anwendbarkeit auf deine Art von Arbeit. Deine Rolle umfasst wahrscheinlich bedeutende physische oder praktische Tätigkeiten.',
    scoreDescLow: 'KI hat nur begrenzte Anwendbarkeit auf deine Arbeit. Während einige Aufgaben profitieren könnten, erfordert das meiste, was du tust, menschliche Präsenz oder handwerkliches Geschick.',
    scoreDescModerate: 'KI hat moderate Anwendbarkeit auf deine Arbeit. Einige deiner Aufgaben könnten durch KI-Tools unterstützt werden, besonders bei der Informationsverarbeitung und Kommunikation.',
    scoreDescHigh: 'KI hat erhebliche Anwendbarkeit auf deine Art von Arbeit. Viele deiner Aufgaben beinhalten Information, Analyse oder Kommunikation, bei denen KI-Tools unterstützen können.',
    scoreDescVeryHigh: 'KI hat sehr hohe Anwendbarkeit auf deine Arbeit. Deine Rolle umfasst in hohem Maße Sprach-, Recherche- und Informationsaufgaben, bei denen aktuelle KI-Tools starke Fähigkeiten zeigen.',

    // Timeline outlooks
    outlookVeryHigh: 'Deine Art von Arbeit umfasst Aufgaben, bei denen sich KI bereits als hochfähig erweist. Eine bedeutende Transformation dieser Rollen ist wahrscheinlich innerhalb der nächsten Jahre.',
    outlookHigh: 'Viele deiner Arbeitsaufgaben stimmen mit Bereichen überein, in denen KI rasche Fortschritte macht. Erwarte wesentliche Unterstützung innerhalb von 5–10 Jahren, mit tiefgreifenderen Veränderungen danach.',
    outlookModerate: 'KI wird wahrscheinlich in den kommenden Jahren Teile deiner Arbeit unterstützen, aber eine vollständige Transformation wird länger dauern, da viele Aufgaben noch menschliches Urteilsvermögen oder Präsenz erfordern.',
    outlookLow: 'Deine Arbeit hat Eigenschaften, die für KI schwerer zu replizieren sind. Während einige Aufgaben unterstützt werden könnten, liegt eine bedeutende Transformation wahrscheinlich weiter in der Zukunft.',
    outlookVeryLow: 'Deine Arbeit umfasst erhebliche physische oder körperliche Aufgaben, bei denen der KI-Fortschritt am langsamsten ist. Die Fähigkeiten von Robotik und physischer KI hinken der kognitiven KI deutlich hinterher.',
  }
};

// Detect language from HTML lang attribute
const lang = document.documentElement.lang === 'de' ? 'de' : 'en';

export const t = translations[lang];
export const currentLang = lang;

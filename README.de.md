# Ergebnisdateien zu „Working with AI"

🌐 [English](README.md) | **Deutsch**

Diese Dateien enthalten die Ergebnisse aus dem folgenden Paper:

> Kiran Tomlinson, Sonia Jaffe, Will Wang, Scott Counts und Siddharth Suri. Working with AI: Measuring the Applicability of Generative AI to Occupations. arXiv, 2025. https://arxiv.org/abs/2507.07935

Insbesondere enthalten sie unsere Metriken, aggregiert auf Ebene der O*NET Intermediate Work Activities (IWA) und Berufe (detaillierte 2018 SOC-Codes). Diese beschreiben, wie häufig Bing Copilot für verschiedene Arbeitstätigkeiten verwendet wurde, wie erfolgreich die Nutzung war und was diese Nutzung darüber aussagt, für welche Berufe KI anwendbar sein könnte. Ziel dieser Metriken ist es zu messen, wie nützlich KI in verschiedenen Berufen sein kann. Für eine ausführliche Diskussion der Metriken und Ergebnisse verweisen wir auf das Paper.

## Aktualisierungen
- (aktuell) v1.1: Referenziert durch die arXiv-Paper-Revision v6. Fügt die Klassifizierung physischer Aufgaben, nicht-physische IWA-Gewichte und einen nicht-physischen KI-Anwendbarkeitsscore hinzu.
- [v1.0](https://github.com/microsoft/working-with-ai/tree/v1.0): Referenziert durch die arXiv-Paper-Revisionen bis v5.

## Dateibeschreibungen
- `iwa_metrics.csv`: IWA-Metriken, separat ausgewiesen für Nutzerziele und KI-Aktionen.
- `ai_applicability_scores.csv`: KI-Anwendbarkeitsscores für jeden SOC-Code (Durchschnitt aus Nutzerziel- und KI-Aktions-Scores).
- `soc_metrics.csv`: IWA-Metriken, aggregiert auf detaillierte SOC-Codes gemäß den SOC-IWA-Gewichten, separat ausgewiesen für Nutzerziele und KI-Aktionen.
- `soc_iwa_weights.csv`: IWA-Gewichte für jeden SOC-Code, basierend auf O*NET-Relevanz und -Wichtigkeit.
- `soc_to_iwas.csv`: Zuordnung von SOC-Codes zu den zugehörigen IWAs.
- `physical_tasks.csv`: Klassifizierung, welche O*NET-Aufgaben physischer Natur sind.
- `soc_iwa_weights_nonphysical.csv`: Wie `soc_iwa_weights`, jedoch nur unter Berücksichtigung nicht-physischer Aufgaben.

Zusammengefasst umfassen die IWA-Metriken:
- `share_{user,ai}`: Der Anteil der Konversationen, die einer IWA zugeordnet werden (als Nutzerziel oder KI-Aktion, separat ausgewiesen). Wenn eine Konversation mehreren IWAs zugeordnet wird, wird sie gleichmäßig aufgeteilt, sodass die Summe der Aktivitätsanteile über alle IWAs hinweg 1 ergibt.
- `completion_{user,ai}`: Der Anteil der Konversationen, die einer IWA zugeordnet werden (als Nutzerziel oder KI-Aktion), bei denen unser Completion-Klassifikator anzeigt, dass das LLM das Nutzerziel erfüllt hat.
- `impact_scope_{user,ai}`: Der Anteil der Konversationen, die einer IWA zugeordnet werden (als Nutzerziel oder KI-Aktion), bei denen der klassifizierte Wirkungsumfang moderat oder höher ist.
- `feedback_positive_fraction_{user,ai}`: Von allen Daumen-Reaktionen in Copilot-Thumbs bei Konversationen, die einer IWA zugeordnet werden (als Nutzerziel oder KI-Aktion), der Anteil mit einer positiven Bewertung (Daumen hoch).
- `completion_x_scope_x_coverage_{user,ai}`: Der Einfachheit halber das Produkt aus Completion, Wirkungsumfang und dem Indikator `1[share > 0.0005]`. Die gewichtete Summe der Nutzerspalte unter Verwendung der Gewichte in `soc_iwa_weights` ergibt den nutzerseitigen KI-Anwendbarkeitsscore (`soc_iwa_weights_nonphysical` für die KI-Seite). Beide Seiten werden gemittelt, um den endgültigen KI-Anwendbarkeitsscore zu berechnen, der in `ai_applicability_scores.csv` angegeben ist.

Die SOC-Code-Metriken sind:
- `completion_{user,ai}`, `impact_scope_{user,ai}`, `feedback_positive_fraction_{user,ai}`: Wie oben, aggregiert auf SOC-Berufe gemäß IWA-Gewichten.
- `coverage_{user,ai}`: Der nach Wichtigkeit und Relevanz gewichtete Anteil der IWAs in einem Beruf mit einem Aktivitätsanteil von mindestens 0,05 % (d. h. share > 0.0005).
- `ai_applicability_score_user`: KI-Anwendbarkeitsscores, die ausschließlich aus den Nutzerziel-Metriken berechnet werden.
- `ai_applicability_score_user_ai_nonphysical`: KI-Anwendbarkeitsscores, die ausschließlich aus den KI-Aktions-Metriken berechnet werden und nur nicht-physische Aufgaben berücksichtigen.

### Fehlende Daten
O\*NET enthält nicht für alle Berufe Aufgabendaten. Wir lassen alle militärischen Berufe (SOC-Codes 55-xxxx) aus, da sie in O\*NET keine Aufgabendaten haben. Außerdem lassen wir 74 SOC-Codes aus, die O*NET-Berufen zugeordnet sind, für die keine Aufgabendaten vorliegen.
Damit verbleiben 785 SOC-Codes, die laut den Occupational Employment and Wage Statistics (OEWS) des BLS von 2023 149,8 Millionen Arbeitnehmer abdecken (die Gesamtbeschäftigung in den USA laut OEWS-Daten 2023 beträgt 151,9 Millionen).

Darüber hinaus fehlen für einige Aufgaben in O\*NET Bewertungsdaten. Einzelheiten zum Umgang mit fehlenden Bewertungsdaten bei der Berechnung der IWA-Gewichte finden Sie im Anhang des Papers.


## Berechnung des KI-Anwendbarkeitsscores
Der folgende Code implementiert die Gleichung für den KI-Anwendbarkeitsscore aus dem Paper und berechnet den Durchschnitt der Nutzer- und KI-Anwendbarkeitsscores (wobei für die KI-Aktionsseite nur nicht-physische Aufgaben verwendet werden). Der KI-Anwendbarkeitsscore ist bereits vorberechnet in `ai_applicability_scores.csv` verfügbar.

```python
import pandas as pd

iwa_df = pd.read_csv('iwa_metrics.csv').set_index('IWA')
soc_to_iwas = pd.read_csv('soc_to_iwas.csv').groupby('SOC Code')['IWA'].apply(list).to_dict()
iwa_weights = pd.read_csv('soc_iwa_weights.csv').set_index('SOC Code').T.to_dict()
nonphysical_iwa_weights = pd.read_csv('soc_iwa_nonphysical_weights.csv').set_index('SOC Code').T.to_dict()

ai_applicability_score = {soc: 0 for soc in soc_to_iwas}
coverage_threshold = 0.0005

for soc, iwas in soc_to_iwas.items():
    total_weight = sum(iwa_weights[soc][iwa] for iwa in iwas)
    for iwa in iwas:
        # Durchschnitt aus Nutzerziel-Score und KI-Aktions-Score, wobei im Zähler für KI-Aktionen nicht-physische Gewichte verwendet werden
        if iwa_df.loc[iwa, 'share_user'] > coverage_threshold:
            ai_applicability_score[soc] += 0.5 * (iwa_weights[soc][iwa] / total_weight) * iwa_df.loc[iwa, 'completion_user'] * iwa_df.loc[iwa, 'impact_scope_user']
        if iwa_df.loc[iwa, 'share_ai'] > coverage_threshold:
            ai_applicability_score[soc] += 0.5 * (nonphysical_iwa_weights[soc][iwa] / total_weight) * iwa_df.loc[iwa, 'completion_ai'] * iwa_df.loc[iwa, 'impact_scope_ai']
```


## Zusätzliche öffentliche Daten
Diese Ergebnisse verwenden die O*NET 29.0-Datenbank, die hier heruntergeladen werden kann: https://www.onetcenter.org/dl_files/database/db_29_0_text.zip.

Unter https://www.bls.gov/oes/tables.htm finden Sie die Occupational Employment and Wage Statistics, verknüpft über SOC-Codes.

Verwenden Sie https://www.bls.gov/emp/classifications-crosswalks/nem-onet-to-soc-crosswalk.xlsx, um O\*NET-SOC-Codes, die zur Identifizierung von Berufen in O\*NET verwendet werden, in SOC-Codes umzuwandeln. Das BLS bietet auch Zuordnungstabellen (Crosswalks) für die Verknüpfung von SOC-Codes mit anderen Berufsklassifikationen an, wie z. B. den im Current Population Survey verwendeten Codes.


## Lizenz
Dieses Repository ist unter CC BY 4.0 lizenziert. Eine Kopie dieser Lizenz finden Sie unter https://creativecommons.org/licenses/by/4.0/. Für die Zitierung dieses Repositorys verwenden Sie bitte die nachstehende Angabe.


## Zitierung
```
@misc{tomlinson2025working,
      title={Working with AI: Measuring the Applicability of Generative AI to Occupations}, 
      author={Kiran Tomlinson and Sonia Jaffe and Will Wang and Scott Counts and Siddharth Suri},
      year={2025},
      eprint={2507.07935},
      archivePrefix={arXiv},
      primaryClass={cs.AI},
      url={https://arxiv.org/abs/2507.07935}, 
}
```


## Transparenz
### Bestimmungsgemäße Verwendung
Diese Ergebnisse werden mit der Forschungsgemeinschaft geteilt, um die Reproduktion unserer Analysen zu erleichtern und weitere Forschung in diesem Bereich zu fördern. Da wir die O*NET-Taxonomie für Arbeitstätigkeiten und die Standard Occupational Classification 2018 verwenden, können unsere Ergebnisse für weiterführende Analysen mit anderen öffentlichen Datenquellen verknüpft werden.

Die zu diesen Ergebnissen beitragenden Konversationen stammen aus Bing Copilot in den Vereinigten Staaten vom 1. Januar 2024 bis 30. September 2024 und repräsentieren daher möglicherweise nicht die KI-Nutzung in anderen Ländern.

### Nicht vorgesehene Verwendung
Unsere Metriken sollten nicht als Messung der Fähigkeit von KI, Arbeitsplätze zu ersetzen, missverstanden oder falsch dargestellt werden. Ein Beruf umfasst mehr als die Summe seiner O*NET-Aufgaben, und unsere Erfolgsmaße (Completion, Wirkungsumfang und Daumen-Feedback) sind Annäherungen, die nicht die vollständigen Fähigkeiten am Arbeitsplatz erfassen. Vielmehr zeigen unsere Metriken (1) wofür ein Consumer-LLM verwendet wird, (2) in relativem Sinne, welche dieser Verwendungen mehr oder weniger erfolgreich sind, und (3) welche Berufe KI als nützlicher oder anwendbarer empfinden könnten.

### Datenerstellung und -verarbeitung
Diese Ergebnisse wurden aus Konversationsdaten von Bing Copilot berechnet, die ursprünglich von Microsoft erhoben wurden und aus Konversationen zwischen Nutzern und Bing Copilot bestehen.

Die Klassifizierung der Konversationen in IWAs wurde durch eine LLM-Pipeline durchgeführt, die von Kiran Tomlinson, Siddharth Suri und Scott Counts entwickelt wurde. Die Pipeline wurde von Kiran Tomlinson programmiert und ausgeführt. Die Analyse wurde von Kiran Tomlinson, Sonia Jaffe, Will Wang, Scott Counts und Siddharth Suri durchgeführt.

### Personen und Identifikatoren
Dieses Repository enthält keine Informationen, die zur direkten oder indirekten Identifizierung einer Person verwendet werden könnten. Alle Metriken in diesem Repository sind auf Aktivitäts- und Berufsebene aggregiert und geben keine Informationen über einzelne Personen preis.

Bevor wir die Bing Copilot-Konversationen klassifiziert haben, wurden potenziell identifizierbare Informationen automatisch entfernt (z. B. Sozialversicherungsnummern, Kreditkartennummern, Postleitzahlen).

### Validierung
Eine ausführliche Diskussion unserer Klassifikator-Validierung finden Sie in unserem Paper.

### Einschränkungen
Die zu diesen Ergebnissen beitragenden Bing Copilot-Konversationen stammen aus den Vereinigten Staaten im Zeitraum vom 01.01.2024 bis 30.09.2024. Die Mehrheit der Konversationen war auf Englisch, wir haben jedoch nicht nach Sprache gefiltert.

LLM-basierte Klassifikatoren sind nicht perfekt, daher sollten alle Metriken mit Vorsicht interpretiert werden. Die genauen von uns verwendeten Prompts sowie die Interrater-Reliabilität mit menschlichen Annotatoren finden Sie im Paper. Da diese Ergebnisse auf der KI-Nutzung durch Verbraucher basieren, repräsentieren sie nicht die vollständige Verteilung der KI-Nutzung am Arbeitsplatz. Für einige Arbeitsaufgaben ist KI direkt in spezialisierte Software integriert, oder es werden spezifische Modelle aufgrund ihrer dedizierten Fähigkeiten oder zur Einhaltung von Datensicherheitsanforderungen verwendet. So verwenden beispielsweise Programmierer häufig KI-erweiterte Entwicklungsumgebungen, und Arbeiten im Rechts-, Medizin- und Finanzbereich erfordern konforme KI-Tools.

### Markenzeichen
Dieses Projekt kann Markenzeichen oder Logos für Projekte, Produkte oder Dienste enthalten. Die autorisierte Verwendung von Microsoft-Markenzeichen oder -Logos unterliegt den [Marken- und Markenrichtlinien von Microsoft](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks) und muss diesen folgen. Die Verwendung von Microsoft-Markenzeichen oder -Logos in modifizierten Versionen dieses Projekts darf keine Verwirrung stiften oder eine Microsoft-Förderung implizieren. Jede Verwendung von Markenzeichen oder Logos Dritter unterliegt den Richtlinien dieser Dritten.


### Ethik
Die Datenanalyse wurde mit Genehmigung des Microsoft Institutional Review Board durchgeführt.

Die Datenerhebung und -nutzung für Forschungszwecke erfolgte in Übereinstimmung mit der [Microsoft-Datenschutzerklärung](https://go.microsoft.com/fwlink/?LinkId=521839).


### Kontakt
Diese Forschung wurde von Mitgliedern von [Microsoft Research](https://www.microsoft.com/en-us/research/) durchgeführt. Wir freuen uns über Feedback. Bei Fragen, Anmerkungen oder Bedenken zu diesem Repository wenden Sie sich bitte an kitomlinson@microsoft.com. Für allgemeinere Anfragen zum Paper kontaktieren Sie kitomlinson@microsoft.com, sojaffe@microsoft.com, counts@microsoft.com, suri@microsoft.com.

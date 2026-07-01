# ESG Value Creation Calculator

Een tool van **Dune Partners** die laat zien hoeveel financiële waarde ESG-verbeteringen opleveren — bijvoorbeeld door verzuim, verloop of energieverbruik te verlagen. Je vult een paar bedrijfscijfers in en de tool berekent direct de potentiële besparing in euro's.

De applicatie draait volledig in de browser (er is geen server of database nodig).

## Voor niet-technische gebruikers: de app lokaal draaien

Je hebt hiervoor eenmalig **Node.js** nodig (de software waarmee de app gebouwd en gestart wordt).

### 1. Node.js installeren (eenmalig)

1. Ga naar [nodejs.org](https://nodejs.org)
2. Download de **LTS-versie** (het groene knopje, "Recommended for most users")
3. Open het gedownloade bestand en klik door de installatiewizard (alle standaardopties zijn prima)

Controleer of het gelukt is door een terminal te openen (op Mac: zoek naar "Terminal" via Spotlight) en het volgende te typen:

```
node -v
```

Zie je een versienummer zoals `v20.x.x`? Dan is Node.js correct geïnstalleerd.

### 2. Het project downloaden

Als je de map van deze applicatie nog niet hebt, download of clone deze van GitHub. Open daarna een terminal en navigeer naar de `app`-map in het project, bijvoorbeeld:

```
cd "Dune Hackathon/app"
```

### 3. Benodigdheden installeren (eenmalig)

Typ in de terminal:

```
npm install
```

Dit downloadt alle onderdelen die de app nodig heeft. Dit hoef je maar één keer te doen (of opnieuw als het project is bijgewerkt).

### 4. De app starten

Typ:

```
npm run dev
```

De terminal toont daarna een regel zoals:

```
Local:   http://localhost:5173/
```

Open die link (`http://localhost:5173/`) in je browser (Chrome, Safari, Edge, etc.) — de calculator opent nu.

Om de app te stoppen, ga terug naar de terminal en druk op `Ctrl + C`.

## Wat kun je in de app doen?

De tool is verdeeld in drie tabbladen, gebaseerd op de ESG-pijlers:

- **E — Environmental**: bereken de waarde van bijvoorbeeld groene energie
- **S — Social**: bereken de waarde van verzuim- en verloopreductie
- **G — Governance**: nog in ontwikkeling

Per onderwerp ("lever") vul je kengetallen van het bedrijf in (zoals aantal medewerkers, gemiddeld salaris, huidig verzuimpercentage). Zet de schakelaar aan om die lever mee te tellen — de rechterkant van het scherm toont dan direct de totale potentiële besparing (Value Creation Potential, VCP) in euro's.

## Voor ontwikkelaars

Beschikbare commando's (uit te voeren in de `app`-map):

| Commando | Werking |
|---|---|
| `npm install` | Installeert alle dependencies |
| `npm run dev` | Start de app lokaal met live-reload |
| `npm run build` | Bouwt een productieversie in `dist/` |
| `npm run preview` | Bekijkt de productiebuild lokaal |
| `npm run lint` | Controleert de code met Oxlint |

**Tech stack:** React 19 + Vite + Tailwind CSS.

**Structuur:**

```
app/
  src/
    App.jsx                        # Hoofdcomponent: tabs, state en totaaloverzicht
    components/
      AbsenteeismCalculator.jsx    # Verzuim-lever (Social)
      TurnoverCalculator.jsx       # Verloop-lever (Social)
      GreenEnergyCalculator.jsx    # Groene energie-lever (Environmental)
      InputField.jsx               # Herbruikbaar invoerveld
    branding/                      # Dune Partners huisstijl (logo, kleuren)
```

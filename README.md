# Mobile-App

Een eenvoudige mobile-first Takenlijst PWA met offline ondersteuning.

## Sitemap
- Homepagina (`#home`)
- Toevoegpagina (`#add`)
- Overzichtspagina (`#overview`)
- Instellingen/info pagina (`#settings`)

## Paginastructuur
- `<header>` met titel en taalswitch
- `<nav>` met bottom navigation
- `<main>` met secties voor dashboard, formulier, overzicht en info
- `<footer>` met app-info

## Datamodel
Elk item bevat:
- `date` (datum)
- `category` (categorie)
- `description` (omschrijving)
- `value` (numerieke waarde)

## Functionaliteit
- Create: item toevoegen met validatie en opslag in `localStorage`
- Read: lijst en totalen tonen
- Delete/Reset: resetknop met bevestiging
- Filter: dag, week, maand
- Taal: Nederlands ↔ Engels
- PWA: manifest + service worker + offline caching

## Lokale ontwikkeling met Node.js

**Vereisten:** Node.js ≥ 18 en npm

```bash
# Start de ontwikkelserver (standaard poort 3000)
npm start

# Of met een andere poort
PORT=8080 npm start
```

Open daarna http://localhost:3000 in je browser.

De server serveert alle statische bestanden vanuit de projectmap en stuurt onbekende paden door naar een 404-melding.

## Lokale test zonder Node.js
Open `index.html` direct in een browser of gebruik een andere static file server.

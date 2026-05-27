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

## Lokale test
Open `index.html` in een browser of draai een lokale static server.

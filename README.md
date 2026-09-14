# TrackPilot

A client onboarding dashboard.

## Features
- Dashboard with a 4-column board (Contract Signed, Kickoff Call, Access Granted, Completed)
- Fetch sample clients from an API on demand, with a success/failure alert
- Add a client, assign a starting stage
- Delete a client
- Client list is saved in the browser (localStorage)
- About page explaining the workflow
- Contact page with a validated form

## Running locally
No build step is needed. Either:
- Open `index.html` directly in a browser, or
- Use the VS Code "Live Server" extension for auto-reload while editing (recommended, since JS modules need a local server rather than `file://`)

## Project structure
    index.html                        Dashboard (client board)
    about.html                        About / workflow page
    contact.html                      Contact page
    assets/css/main.css               Entry stylesheet, imports everything below
    assets/css/base/                  Reset, variables, typography
    assets/css/components/            Reusable pieces: navbar, buttons, cards, forms, footer, layout
    assets/css/pages/                 Page-specific styles
    assets/js/main.js                 Entry point, wires modules together
    assets/js/modules/storage.js      localStorage + API fetch
    assets/js/modules/board.js        Dashboard rendering and events
    assets/js/modules/form-validation.js   Contact form validation

## Roadmap
- [ ] Move to a real backend and database
- [ ] Deploy
- [ ] Add drag-and-drop to move clients between stages

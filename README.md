# DST API Documentation

This documentation provides detailed information about the Don't Starve Together (DST) modding API, helping mod developers better understand the structure, components, and methods for creating mods for the game.

## Introduction

Don't Starve Together is a survival game developed by Klei Entertainment with robust modding support. This documentation project aims to:

- Provide comprehensive documentation on the game's core APIs
- Offer detailed guides on server startup process and mod loading
- Describe the standard structure of a DST mod
- Reference documentation for components, prefabs, and stategraphs

This documentation is built based on the [dst-api](https://github.com/dstmodders/dst-api) project and aims to supplement detailed information about DST modding mechanisms.

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens a browser window. Most changes are reflected live without needing to restart the server.

## Contributing

We welcome contributions to this project:

1. Adding documentation for new APIs
2. Improving existing descriptions
3. Adding examples and tutorials
4. Fixing errors and updating inaccurate information

## Documentation Structure

- **Getting Started**: Basic guides on how to start modding DST
- **API Vanilla**: Documentation on the game's native API
  - Components: Entity components (Health, Combat, Inventory, etc.)
  - Core API: Core APIs (Entity, Events, Server Startup, etc.)
  - Prefabs: Pre-fabricated game entities
  - Recipes: Crafting and cooking recipe systems
  - Stategraphs: State machine system for entity behaviors
  - Utils: Helper utilities
  - World: Game world-related APIs

## Deployment

### Automatic Deployment with GitHub Actions

This project is configured to automatically deploy to GitHub Pages whenever changes are pushed to the `main` branch. The GitHub Actions workflow will build the website and deploy it to GitHub Pages.

The website is deployed at: https://vietnd69.github.io/dst-api-webdocs/

### GitHub Pages Setup

Before deploying for the first time, you need to set up GitHub Pages in your repository:

1. Go to your GitHub repository and click on the "Settings" tab.
2. Scroll down to the "GitHub Pages" section.
3. In "Source", select "GitHub Actions".
4. Save the settings.

## Links

- [Original dst-api project](https://github.com/dstmodders/dst-api)
- [Klei modding documentation](https://forums.kleientertainment.com/forums/forum/79-dont-starve-together-beta-modding/)
- [Steam Workshop DST](https://steamcommunity.com/app/322330/workshop/)
- [Docusaurus](https://docusaurus.io/) - The documentation framework used for this project

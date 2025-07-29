# DST API Documentation

This documentation provides detailed information about the Don't Starve Together (DST) modding API, helping mod developers better understand the structure, components, and methods for creating mods for the game.

# About Don't Starve Together Game Scripts

> **Note**:  
> This document is AI-generated based on the base scripts of the Don't Starve Together game, which can be found at:  
> `SteamLibrary\steamapps\common\Don't Starve Together\data\databundles\scripts.zip`  
> > ⚠️ **Disclaimer**: The information in this documentation may not be fully accurate and should be verified.  
>  
> A regularly updated and cleaned-up fork of the DST scripts is maintained at:  
> 🔗 [https://github.com/vietnd69/dst-scripts](https://github.com/vietnd69/dst-scripts)  
>  

>  
> Contributions, fixes, and collaborative development are welcome at:  
> 📘 [https://github.com/vietnd69/dst-api-webdocs](https://github.com/vietnd69/dst-api-webdocs)


## Introduction

Don't Starve Together is a survival game developed by Klei Entertainment with robust modding support. This documentation project aims to:

- Provide comprehensive documentation on the game's core APIs
- Offer detailed guides on server startup process and mod loading
- Describe the standard structure of a DST mod
- Reference documentation for components, prefabs, and stategraphs

This documentation is built based on the [dst-api](https://github.com/b1inkie/dst-api) project and aims to supplement detailed information about DST modding mechanisms.

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

We welcome contributions to the Don't Starve Together API Documentation! Your help makes this resource better for the entire modding community.

### Why Contribute?

Contributing to the DST API documentation helps:

- **Improve the modding ecosystem** for all developers
- **Share knowledge** with the community
- **Make modding more accessible** to newcomers
- **Document undocumented features** for everyone's benefit
- **Keep information current** with game updates

### Ways to Contribute

There are many ways you can contribute:

- **Documentation improvements**: Enhance existing documentation with clearer explanations
- **New documentation**: Add documentation for undocumented APIs or features
- **Code examples**: Provide practical examples that demonstrate API usage
- **Bug fixes**: Correct errors, typos, or outdated information
- **Translations**: Help translate documentation to other languages

### Contribution Process

1. **Find an Area to Contribute**
   - Check the [list of areas needing contributions](https://vietnd69.github.io/dst-api-webdocs/community/areas-needing-contributions)
   - Review existing documentation for gaps or improvements
   - Look for issues labeled "help wanted" or "good first issue"

2. **Set Up Your Environment**
   - Fork the repository
   - Clone your fork locally
   - Install dependencies with `npm install`
   - Start the development server with `npm start`

3. **Make Your Changes**
   - Follow the [documentation standards](https://vietnd69.github.io/dst-api-webdocs/community/documentation-standards)
   - Include working code examples following our [coding standards](https://vietnd69.github.io/dst-api-webdocs/community/coding-standards)

4. **Submit Your Contribution**
   - Create a branch for your changes
   - Submit a pull request using the [PR template](https://vietnd69.github.io/dst-api-webdocs/community/pr-template)

### Community Resources

For more detailed guidance on contributing, please visit our [community section](https://vietnd69.github.io/dst-api-webdocs/community):

- [Full Contribution Guidelines](https://vietnd69.github.io/dst-api-webdocs/community/contribution-guidelines)
- [Documentation Standards](https://vietnd69.github.io/dst-api-webdocs/community/documentation-standards)
- [Code of Conduct](https://vietnd69.github.io/dst-api-webdocs/community/code-of-conduct)
- [Review Process](https://vietnd69.github.io/dst-api-webdocs/community/review-process)

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
- **Community**: Guidelines and resources for contributing to the documentation


## Links

- [Original dst-api project](https://github.com/b1inkie/dst-api)
- [Klei modding documentation](https://forums.kleientertainment.com/forums/forum/79-dont-starve-together-beta-modding/)
- [Steam Workshop DST](https://steamcommunity.com/app/322330/workshop/)
- [Docusaurus](https://docusaurus.io/) - The documentation framework used for this project


---
id: useful-extensions
title: Useful Extensions and Tools
sidebar_position: 17
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Useful Extensions and Tools for DST Modding

This guide covers additional extensions, tools, and utilities that can enhance your Don't Starve Together modding workflow. These tools can help you work more efficiently, debug more effectively, and create more polished mods.

## Code Editors and Extensions

### VSCode Extensions

Beyond the basic setup covered in the [VSCode Setup guide](vscode-setup.md), these extensions can further improve your modding experience:

#### Lua-specific Extensions

1. **Lua Formatter**
   - Automatically formats your Lua code for consistency
   - Install: Search for "Lua Formatter" in the Extensions marketplace
   - Configuration: Create a `.lua-format` file in your project root

2. **Lua Debug**
   - Advanced debugging for Lua scripts
   - Install: Search for "Local Lua Debugger" in the Extensions marketplace
   - Useful for complex mods with many interacting components

3. **Todo Tree**
   - Tracks TODO comments in your code
   - Install: Search for "Todo Tree" in the Extensions marketplace
   - Helps manage development tasks within your codebase

#### General Development Extensions

1. **GitLens**
   - Enhanced Git capabilities within VSCode
   - Shows line-by-line Git blame annotations
   - Visualizes code authorship and history

2. **Error Lens**
   - Highlights errors and warnings inline
   - Makes debugging syntax issues much faster

3. **Path Intellisense**
   - Autocompletes filenames in import paths
   - Useful for larger mods with many files

### Alternative Editors

While VSCode is recommended, these alternatives also work well for DST modding:

1. **ZeroBrane Studio**
   - Lightweight Lua IDE with built-in debugger
   - Includes DST API integration plugin
   - Download: [ZeroBrane Studio](https://studio.zerobrane.com/)

2. **Sublime Text**
   - Fast, lightweight editor with Lua support
   - Install the "LSP" and "LSP-lua" packages for language support
   - Download: [Sublime Text](https://www.sublimetext.com/)

## Asset Creation Tools

### Image Editing

1. **Aseprite**
   - Pixel art editor perfect for DST-style graphics
   - Supports animation and sprite sheets
   - Download: [Aseprite](https://www.aseprite.org/)

2. **GIMP**
   - Free alternative to Photoshop
   - Good for texture editing and icon creation
   - Download: [GIMP](https://www.gimp.org/)

3. **Krita**
   - Free painting program with good support for textures
   - Download: [Krita](https://krita.org/)

### Animation Tools

1. **Spriter**
   - 2D animation tool compatible with DST's animation system
   - Can export to the formats DST uses
   - Download: [Spriter](https://brashmonkey.com/)

2. **Spine**
   - Professional 2D animation tool (paid)
   - Used by many game developers for skeletal animation
   - Download: [Spine](http://esotericsoftware.com/)

## Testing and Debugging Tools

### In-game Console

The in-game console is essential for debugging:

1. Enable the console by pressing the backtick key (`)
2. Use commands like:
   - `c_spawn("prefab_name")` - Spawn an entity
   - `c_give("prefab_name")` - Give yourself an item
   - `c_godmode()` - Toggle god mode for testing
   - `c_reveal()` - Reveal the map

### DST Debug Tools Mod

The "Debug Tools" mod adds additional debugging capabilities:

1. Subscribe from the Steam Workshop
2. Enables entity inspection, performance monitoring, and more
3. Access via the wrench icon in-game

### Performance Profiling

1. **DST Performance Analyzer**
   - Mod that shows detailed performance metrics
   - Helps identify lag sources in your mod
   - Available on Steam Workshop

2. **Lua Memory Profiler**
   - Tool for tracking memory usage in Lua scripts
   - Helps identify memory leaks
   - GitHub: [Lua Memory Profiler](https://github.com/facebookarchive/lua-profiler)

## Workflow and Organization Tools

### Project Management

1. **Trello**
   - Kanban-style project management
   - Great for tracking features, bugs, and progress
   - Website: [Trello](https://trello.com/)

2. **Notion**
   - All-in-one workspace for notes, tasks, and documentation
   - Good for complex mods with extensive documentation needs
   - Website: [Notion](https://www.notion.so/)

### Documentation Tools

1. **Markdown Editors**
   - **Typora**: WYSIWYG markdown editor
   - **MarkText**: Open-source alternative
   - Useful for creating mod documentation and readme files

2. **Docusaurus**
   - Documentation website generator
   - Good for large mods that need comprehensive docs
   - Website: [Docusaurus](https://docusaurus.io/)

### Collaboration Tools

1. **GitHub Desktop**
   - Simplified Git interface for those new to version control
   - Makes common Git operations visual and intuitive
   - Download: [GitHub Desktop](https://desktop.github.com/)

2. **Discord**
   - Create a server for your mod for user feedback and collaboration
   - DST Modding community servers exist for getting help
   - Website: [Discord](https://discord.com/)

## File Management and Conversion

### TEX File Tools

DST uses TEX files for textures. These tools help work with them:

1. **TEXCreator**
   - Converts PNG files to TEX format for DST
   - Handles atlas generation
   - Download: [TEXCreator](https://forums.kleientertainment.com/files/file/982-texcreator/)

2. **TEXTools**
   - Extract and convert TEX files from the game
   - Useful for examining existing textures
   - Available on DST forums

### Animation Tools

1. **Spriter2Unity**
   - Converts Spriter animations to formats usable in DST
   - GitHub: [Spriter2Unity](https://github.com/Dharengo/Spriter2Unity)

2. **DST Animation Explorer**
   - View and analyze existing DST animations
   - Helps understand how to structure your own animations
   - Available on DST modding forums

## Mod Distribution and Feedback

### Steam Workshop Tools

1. **Workshop Uploader**
   - Built into DST, accessible from the mods menu
   - Handles publishing and updating your mod

2. **SteamCMD**
   - Command-line version of Steam
   - Can automate mod uploads for CI/CD pipelines
   - Download: [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD)

### Feedback Collection

1. **Google Forms**
   - Create surveys for mod feedback
   - Free and easy to set up
   - Website: [Google Forms](https://forms.google.com/)

2. **GitHub Issues**
   - Track bug reports and feature requests
   - Integrates with your mod's repository
   - Provides templates for structured feedback

## Learning Resources

### Lua Learning Tools

1. **Lua Tutor**
   - Interactive Lua code visualization
   - Website: [Lua Tutor](http://pythontutor.com/lua.html)

2. **Lua Workshop**
   - Interactive Lua learning environment
   - Website: [Lua Workshop](https://tylerneylon.com/a/learn-lua/)

### DST-specific Resources

1. **Klei Forums**
   - Official forums with modding section
   - Direct access to other modders and sometimes developers
   - Website: [Klei Forums](https://forums.kleientertainment.com/forums/forum/79-dont-starve-together-mods-and-tools/)

2. **DST Mod Dev Tools**
   - Mod for improving the development/testing experience
   - Adds debugging tools, entity inspection, performance monitoring
   - GitHub: [dstmodders/mod-dev-tools](https://github.com/dstmodders/mod-dev-tools)
   - Steam Workshop: [Mod Dev Tools](https://steamcommunity.com/sharedfiles/filedetails/?id=2220506640)

3. **DST API Extension**
   - VSCode extension for DST API documentation and autocompletion
   - Helps with code completion and API reference while coding
   - GitHub: [b1inkie/dst-api](https://github.com/b1inkie/dst-api)
   - Install from VSCode marketplace: Search for "dst-lan"

## Setting Up a Complete Modding Environment

For serious modders, consider setting up a complete environment with these tools:

1. VSCode with recommended extensions
2. Git for version control
3. Asset creation tools appropriate for your mod
4. Project management system (Trello/Notion)
5. Local testing environment
6. Automated build scripts (optional)

## See also

- [VSCode Setup](vscode-setup.md) - For basic VSCode configuration
- [Git Integration](git-integration.md) - For version control setup
- [Debugging and Testing](debugging-and-testing.md) - For testing your mods
- [First Mod](first-mod.md) - For creating your first DST mod 

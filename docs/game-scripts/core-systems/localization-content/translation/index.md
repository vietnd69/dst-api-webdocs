---
id: translation-overview
title: Translation Overview
description: Overview of translation and localization utilities in DST API
sidebar_position: 0

last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: localization-subsystem
system_scope: translation utilities and transformations
---

# Translation Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Translation subsystem provides core translation infrastructure and specialized utility functions for Don't Starve Together's localization system. This subsystem handles both text translation through PO file management and specialized transformation utilities that require localization support.

### Key Responsibilities
- Manage multi-language string translation through PO file processing
- Provide utilities for transformation mechanics that involve localized content
- Support both legacy and modern PO file formats with msgctxt
- Handle escape character conversion for proper text display
- Enable dynamic language switching and longest string detection

### System Scope
This subsystem includes core translation infrastructure and transformation utilities but excludes general content strings (handled by Content) and language files (handled by Strings).

## Architecture Overview

### System Components
The translation subsystem consists of a core translator class that manages language loading and string lookups, plus specialized utilities that leverage the translation system for game mechanics.

### Data Flow
```
PO Files → Translator Loading → String Storage → Translation Lookup
    ↓              ↓                ↓                ↓
Language Data → Memory Cache → Hash Tables → Localized Output
```

### Integration Points
- **Content Systems**: Provides translated strings for all game content
- **User Interface**: Supplies localized text for all UI elements  
- **Game Mechanics**: Supports transformation systems requiring announcements
- **Data Management**: Loads and caches translation data from language files

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Translator](./translator.md) | stable | Current translation system |
| 676042 | 2025-06-21 | [Curse Monkey Util](./curse_monkey_util.md) | stable | Monkey transformation utilities |

## Core Translation Modules

### [Core Translation System](./translator.md)
Primary localization infrastructure for multi-language support.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Translator](./translator.md) | stable | PO file processing and string translation | Multi-language support, escape handling |

### [Transformation Utilities](./curse_monkey_util.md)
Specialized utilities that integrate with the translation system for game mechanics.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Curse Monkey Util](./curse_monkey_util.md) | stable | Monkey curse transformation mechanics | Progressive cursing, visual effects |

## Common Translation Patterns

### Basic String Translation
```lua
-- Get translated string in default language
local play_text = LanguageTranslator:GetTranslatedString("STRINGS.UI.MAINSCREEN.PLAY")

-- Get translation in specific language
local french_text = LanguageTranslator:GetTranslatedString("STRINGS.UI.MAINSCREEN.PLAY", "fr")
```

### Language Loading and Management
```lua
-- Load language file
LanguageTranslator:LoadPOFile("data/languages/french.po", "fr")

-- Switch to longest strings for UI testing
LanguageTranslator:UseLongestLocs(true)
local longest = LanguageTranslator:GetLongestTranslatedString("STRINGS.UI.TITLE")
```

### Transformation with Localization
```lua
-- Apply curse with localized announcements
local CURSE_MONKEY_UTIL = require("curse_monkey_util")
local token_count = player.components.inventory:GetItemCount("monkeytoken")
CURSE_MONKEY_UTIL.docurse(player, token_count)
```

## Translation System Dependencies

### Required Systems
- [Data Management](../../data-management/index.md): File loading and caching for PO files
- [System Core](../../system-core/index.md): Engine integration for global translator access
- [Fundamentals](../../fundamentals/index.md): Class system for Translator implementation

### Optional Systems
- [User Interface](../../user-interface/index.md): UI elements requiring localized text
- [Character Systems](../../character-systems/index.md): Character-specific announcements and effects
- [Game Mechanics](../../game-mechanics/index.md): Transformation and progression systems

## Performance Considerations

### Translation Performance
- String lookups use O(1) hash table operations for fast retrieval
- Translations are cached in memory after PO file loading
- Multi-line string joining occurs only during file parsing
- Language switching rebuilds hash tables but preserves translation cache

### Memory Usage
- Each loaded language maintains separate hash table storage
- Escape character processing happens on-demand during string conversion
- Longest string detection caches results for UI layout optimization

### Scaling Considerations
- System supports unlimited number of languages with linear memory growth
- Translation lookup performance remains constant regardless of language count
- File loading time scales with PO file size and number of strings

## Development Guidelines

### Best Practices
- Always check for translation availability before using fallback strings
- Use consistent string ID paths following STRINGS table hierarchy
- Load only required languages to optimize memory usage
- Test UI layouts with longest available translations
- Handle escape characters properly for multi-line content

### Common Pitfalls
- Not validating translation existence before display
- Hardcoding string paths instead of using constants
- Loading excessive languages without memory considerations
- Bypassing escape character conversion for PO file compatibility

### Testing Strategies
- Test string lookups with missing translations to verify fallback behavior
- Validate PO file parsing with both legacy and modern formats
- Test UI elements with longest available strings for layout validation
- Verify transformation announcements work across different languages

## Translation Integration Patterns

### With Content Systems
Translation system provides localized strings for all game content:
- UI elements receive translated button and menu text
- Game messages use localized announcements and descriptions
- Achievement descriptions display in player's selected language
- Help text and tutorials adapt to language settings

### With Transformation Mechanics
Specialized utilities integrate translation for game mechanics:
- Curse announcements display in player's language
- Transformation effects trigger localized status messages
- Progressive mechanics provide appropriate language feedback
- Visual effects coordinate with text announcements

### With User Interface
Translation system drives all UI text presentation:
- Menu systems query translations for display text
- Button labels use translated strings from PO files
- Dialog boxes present localized messages to players
- Layout systems use longest strings for proper sizing

## Language File Support

### PO File Format Compatibility
- **Legacy Format**: Uses `#:` reference fields for string identification
- **Modern Format**: Uses `msgctxt` fields for hierarchical string paths
- **Multi-line Support**: Automatic joining of continued string lines
- **Escape Handling**: Proper conversion of newlines, quotes, and backslashes

### String Path Convention
- Hierarchical dot notation: `STRINGS.UI.MAINSCREEN.PLAY`
- Case-sensitive path matching required
- Root level always begins with "STRINGS"
- Nested structure maps to Lua table hierarchy

## Troubleshooting Translation Issues

### Common Translation Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Missing translations | English text in localized game | Check PO file loading and string paths |
| Escape character display | Raw `\n` or `\"` in text | Verify escape character conversion |
| Layout overflow | UI elements too small | Use longest string detection for sizing |
| Language switching fails | Text doesn't update | Retranslate STRINGS table after load |

### Debugging Translation Systems
- Use console commands to check loaded languages
- Verify string path accuracy with STRINGS table structure
- Test PO file format compatibility with sample strings
- Monitor memory usage when loading multiple languages

## Performance Monitoring

### Key Metrics
- Translation lookup time per string request
- Memory usage per loaded language
- PO file parsing duration
- String table translation rebuild time

### Optimization Strategies
- Cache frequently accessed translations in local variables
- Load languages on-demand rather than all at startup
- Use longest string detection judiciously for UI sizing
- Minimize escape character conversion overhead

## Future Development

### Extensibility Design
- Translation system supports easy addition of new languages
- Transformation utilities can integrate additional announcement types
- PO file format support adapts to evolving localization standards
- String lookup system accommodates nested content structures

### Integration Planning
- New transformation mechanics should leverage existing translation infrastructure
- UI components should use translation system for all user-facing text
- Content additions require corresponding translation string additions
- Mod support should integrate with core translation capabilities

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Content](../content/index.md) | Provider | Supplies string content for translation |
| [Strings](../strings/index.md) | Consumer | Uses translated strings for game text |
| [Character Systems](../../character-systems/index.md) | Integration | Character announcements and effects |
| [User Interface](../../user-interface/index.md) | Consumer | UI text localization |

## Contributing

### Adding New Translation Modules
- Follow established patterns for transformation utilities
- Integrate with core Translator class for string management
- Provide proper error handling for missing translations
- Document localization requirements clearly

### Translation String Guidelines
- Use descriptive string IDs that reflect content purpose
- Follow hierarchical naming conventions consistently
- Include context information for translators
- Test with multiple languages to verify compatibility

### Code Review Checklist
- [ ] Translation lookups handle missing strings gracefully
- [ ] Escape character handling is implemented correctly
- [ ] Memory usage is optimized for language loading
- [ ] Integration with existing translation infrastructure
- [ ] Documentation includes localization considerations

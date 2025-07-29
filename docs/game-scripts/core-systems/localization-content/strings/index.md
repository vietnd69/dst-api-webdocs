---
id: localization-content-strings-overview
title: Strings and Localization Overview
description: Overview of string management and localization infrastructure in DST API
sidebar_position: 0

last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: infrastructure-system
system_scope: text localization and string management
---

# Strings and Localization Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Strings and Localization category provides the foundational infrastructure for text management and multi-language support in Don't Starve Together. These systems handle all user-facing text content, translation workflows, and localization processes that enable the game to support multiple languages and regions.

### Key Responsibilities
- Manage the global string table containing all user-facing text
- Provide translation pipeline infrastructure with POT file generation
- Handle character information, UI text, and dialogue content
- Support multi-language localization with UTF-8 encoding
- Enable skin and cosmetic item text management
- Facilitate translation workflows for development teams

### System Scope
This category includes core string management, translation tooling, and localization infrastructure but excludes content-specific text (handled by Content Systems) and character-specific dialogue (handled by Character Systems).

## Architecture Overview

### System Components
The localization infrastructure is built around a centralized string table system with specialized tools for translation workflow management and multi-platform support.

### Data Flow
```
Source Strings → Global STRINGS Table → POT Generation → Translation Files → Localized Display
       ↓                ↓                     ↓               ↓                ↓
   Raw Content → Categorized Data → Template Files → Language Data → User Interface
```

### Integration Points
- **User Interface**: All UI text sourced from string tables
- **Character Systems**: Character names, quotes, and descriptions
- **Content Systems**: Item names, descriptions, and dialogue
- **Platform Systems**: Multi-platform localization support

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Global Strings](./strings.md) | stable | Comprehensive string table system |
| 676042 | 2025-06-21 | [POT Generation](./createstringspo.md) | stable | Translation pipeline tooling |
| 676042 | 2025-06-21 | [Pre-translated Strings](./strings_pretranslated.md) | stable | Multi-language UI support |

## Core Localization Modules

### [String Management](./strings.md)
Central repository for all user-facing text content in the game.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Global Strings](./strings.md) | stable | Main string table system | Character data, UI text, action descriptions |

### [Translation Infrastructure](./createstringspo.md)
Tools and systems for generating translation files and managing localization workflows.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [POT Generation](./createstringspo.md) | stable | Main POT file generation tool | Multi-platform support, UTF-8 compliance |
| [DLC POT Generation](./createstringspo_dlc.md) | stable | DLC-specific localization tool | Reign of Giants support, specialized workflows |

### [Pre-localized Content](./strings_pretranslated.md)
Ready-to-use translated strings for essential UI elements and language selection.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Pre-translated Strings](./strings_pretranslated.md) | stable | Multi-language UI text | 23 language support, UTF-8 encoding |

### [Specialized Content](./skin_strings.md)
Auto-generated strings for cosmetic items and character customization.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Skin Strings](./skin_strings.md) | stable | Cosmetic item localization | Auto-generated quotes, skin names, descriptions |

## Common Localization Patterns

### Accessing Global Strings
```lua
-- Access character information
local char_name = STRINGS.CHARACTER_NAMES.wilson -- "Wilson P. Higgsbury"
local char_quote = STRINGS.CHARACTER_QUOTES.wilson -- "I'll conquer this world..."
local char_title = STRINGS.CHARACTER_TITLES.wilson -- "The Gentleman Scientist"

-- Access action text
local action_text = STRINGS.ACTIONS.CHOP -- "Chop"
local pickup_text = STRINGS.ACTIONS.PICKUP.GENERIC -- "Pick up"

-- Access item names
local item_name = STRINGS.NAMES.axe -- "Axe"
local recipe_desc = STRINGS.RECIPE_DESC.axe -- "Chop down trees efficiently."
```

### Translation File Generation
```lua
-- Basic POT generation
POT_GENERATION = true
PLATFORM = "WIN32_STEAM"
require "strings"

-- Generate POT file for translation
CreateStringsPOTv2("languages/strings.pot", "STRINGS", STRINGS)

-- Generate with translation data
local french_strings = LoadTranslationTable("french_strings.lua")
CreateStringsPOTv2("output/french.po", "STRINGS", french_strings, STRINGS)
```

### Multi-language Support
```lua
-- Access pre-translated language options
local language_id = LANGUAGE.FRENCH
local language_name = STRINGS.PRETRANSLATED.LANGUAGES[language_id] -- "Français (French)"

-- Create language selection dialog
local title = STRINGS.PRETRANSLATED.LANGUAGES_TITLE[language_id]
local body = STRINGS.PRETRANSLATED.LANGUAGES_BODY[language_id]
local yes_text = STRINGS.PRETRANSLATED.LANGUAGES_YES[language_id]
local no_text = STRINGS.PRETRANSLATED.LANGUAGES_NO[language_id]
```

### Skin Content Access
```lua
-- Access character skin quotes
local skin_quote = STRINGS.SKIN_QUOTES.wilson_formal -- "I hate parties."

-- Access skin display names
local skin_name = STRINGS.SKIN_NAMES.wilson_formal -- "The Gentleman Scientist"

-- Access skin type descriptions
local type_desc = STRINGS.SKIN_DESCRIPTIONS.TYPE.CHARACTER -- "Character"
```

## Localization System Dependencies

### Required Systems
- [Data Management](../data-management/index.md): String data loading and persistence
- [System Core](../system-core/index.md): Platform detection and file system access
- [User Interface](../user-interface/index.md): Text display and internationalization

### Optional Systems
- [Character Systems](../character-systems/index.md): Character-specific text integration
- [Content Systems](../content/index.md): Dynamic content text generation
- [Development Tools](../development-tools/index.md): Translation testing and validation

## Performance Considerations

### Memory Usage
- String tables use efficient memory layouts for fast access
- UTF-8 strings are properly encoded to minimize memory overhead
- Pre-translated content is loaded on-demand for language selection
- Skin strings are auto-generated to reduce manual maintenance

### Performance Optimizations
- Global string table provides O(1) lookup performance
- POT generation tools batch process strings efficiently
- Multi-language support uses cached translations
- String validation minimizes runtime processing overhead

### Scaling Considerations
- String tables support thousands of entries with minimal impact
- Translation tools handle large content volumes efficiently
- Multi-platform support scales across different system architectures
- Localization pipeline supports adding new languages without code changes

## Development Guidelines

### Best Practices
- Always use the global STRINGS table for user-facing text
- Generate POT files using the v2 format for modern translation workflows
- Validate UTF-8 encoding for all non-ASCII content
- Test localization on all supported platforms
- Use consistent string keys across related content

### Common Pitfalls
- Hard-coding user-facing text instead of using string tables
- Not handling UTF-8 encoding properly for special characters
- Generating POT files without proper platform configuration
- Assuming string availability without checking for localization
- Mixing content languages within single string entries

### Testing Strategies
- Verify all string table entries are accessible
- Test POT generation across multiple platforms
- Validate UTF-8 encoding for international character sets
- Check translation pipeline with sample language files
- Test string display across different UI contexts

## Localization Integration Patterns

### With User Interface
String systems drive all UI text presentation:
- Menu systems source text from global string tables
- Action prompts use standardized action text
- Character selection displays localized character information
- Error messages and notifications use consistent text formatting

### With Content Systems
Localization integrates with dynamic content:
- Procedural text generation respects current language settings
- Cosmetic items use auto-generated localized descriptions
- Achievement text integrates with string table systems
- Dynamic dialogue references global string content

### With Platform Systems
Multi-platform localization considerations:
- Platform-specific text variations for different markets
- Regional language support for console platforms
- Steam, PlayStation, Xbox, and Rail platform variations
- Character encoding differences across platforms

## Translation Workflow

### Development Phase
1. **String Definition**: Add new strings to global STRINGS table
2. **Key Assignment**: Use consistent, descriptive string keys
3. **Content Validation**: Verify string content and formatting
4. **System Integration**: Test strings in actual game contexts

### Translation Phase
1. **POT Generation**: Create template files using translation tools
2. **Translator Distribution**: Provide POT files to translation teams
3. **Translation Review**: Validate translated content quality
4. **Integration Testing**: Test translated strings in game

### Maintenance Phase
1. **Content Updates**: Maintain string tables with new content
2. **Translation Sync**: Keep translation files synchronized
3. **Quality Assurance**: Validate translation accuracy
4. **Platform Testing**: Verify localization across all platforms

## Quality Assurance Standards

### String Content Validation
- All user-facing text must use the global string system
- String keys must follow consistent naming conventions
- Content must be appropriate for all supported regions
- Special characters must use proper UTF-8 encoding

### Translation Quality
- All POT files must generate without errors
- Translation completeness must be verified
- Character encoding must be validated
- Platform-specific variations must be tested

### Performance Standards
- String access must maintain O(1) performance
- Memory usage must remain within acceptable bounds
- POT generation must complete within reasonable time
- Multi-language switching must be responsive

## Troubleshooting Localization Issues

### Common String Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Missing string entries | Text displays as key names | Add entries to STRINGS table |
| Encoding issues | Special characters display incorrectly | Verify UTF-8 encoding |
| POT generation failures | Translation files not created | Check platform configuration |
| Language switching problems | Text doesn't update properly | Verify language file loading |

### Debugging Localization Systems
- Use string validation tools to check table completeness
- Test POT generation with known string sets
- Verify UTF-8 encoding with character validation tools
- Monitor memory usage during large string operations
- Check platform-specific localization behavior

## Localization Maintenance

### Regular Maintenance Tasks
- Update string tables with new game content
- Regenerate POT files when strings change
- Validate translation file completeness
- Test multi-language functionality
- Clean up deprecated string entries

### System Evolution
- Add support for new languages as needed
- Enhance translation tools for improved workflows
- Expand character encoding support
- Improve platform-specific localization
- Optimize string access performance

## Future Development

### Extensibility Design
- String tables support easy addition of new content categories
- Translation tools accommodate new workflow requirements
- Multi-language system handles diverse character sets
- Platform support adapts to new gaming platforms
- Auto-generation tools scale with content growth

### Integration Planning
- Design localization for mod compatibility
- Plan for real-time language switching
- Consider voice localization integration
- Support dynamic content localization
- Enable community translation contributions

## Language Support Matrix

### Currently Supported Languages

| Language | Code | Region | Platform Support |
|----------|------|--------|------------------|
| English | EN | Global | All platforms |
| French | FR | France/Canada | All platforms |
| Spanish | ES | Spain/Latin America | All platforms |
| German | DE | Germany | All platforms |
| Italian | IT | Italy | All platforms |
| Portuguese | PT | Brazil | All platforms |
| Russian | RU | Russia | All platforms |
| Chinese (Simplified) | ZH-CN | China | Steam, Rail |
| Chinese (Traditional) | ZH-TW | Taiwan | All platforms |
| Japanese | JA | Japan | All platforms |
| Korean | KO | Korea | All platforms |

### Platform-Specific Considerations
- **Steam**: Full language support with community translations
- **Console (PS4/Xbox)**: Regional variants for Spanish and other languages
- **Rail**: Specialized Chinese market support with regional content
- **Mobile**: Limited language support based on platform capabilities

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [User Interface](../user-interface/index.md) | Text Display | All UI text rendering, menu systems |
| [Character Systems](../character-systems/index.md) | Content Source | Character names, quotes, descriptions |
| [Content Systems](../content/index.md) | Dynamic Text | Item descriptions, procedural content |
| [Platform Systems](../system-core/index.md) | Infrastructure | Platform detection, file system access |

## Contributing to Localization Systems

### Adding New Languages
1. Define language constants and identifiers
2. Create translation template files using POT tools
3. Add language entries to pre-translated string tables
4. Test platform-specific language handling
5. Validate character encoding and display

### Modifying String Content
1. Update global STRINGS table with new content
2. Regenerate POT files for translator distribution
3. Test string integration across all UI contexts
4. Verify translation pipeline compatibility
5. Update documentation for new string categories

### Translation Review Checklist
- [ ] String keys follow established naming conventions
- [ ] Content is appropriate for all supported regions
- [ ] UTF-8 encoding is properly handled
- [ ] POT files generate without errors
- [ ] Platform-specific variations are tested
- [ ] Translation completeness is verified
- [ ] Performance impact is acceptable
- [ ] Documentation accurately reflects string capabilities

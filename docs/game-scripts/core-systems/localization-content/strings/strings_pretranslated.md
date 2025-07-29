---
id: strings-pretranslated
title: Strings Pretranslated
description: Pre-translated language strings and localization support for multi-language user interfaces
sidebar_position: 2

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Strings Pretranslated

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `Strings Pretranslated` module provides pre-translated text strings for multi-language support in Don't Starve Together. This module contains UTF-8 encoded strings for various supported languages, specifically designed to handle language selection prompts and translation option dialogs without requiring the full localization pipeline.

The module is kept separate from the main strings system to avoid UTF-8 encoding issues in editors that don't handle Unicode properly. It focuses on essential user interface elements needed for language selection and translation activation.

## Usage Example

```lua
-- Get language name for display
local language_id = LANGUAGE.FRENCH
local language_name = STRINGS.PRETRANSLATED.LANGUAGES[language_id]
print(language_name) -- "Français (French)"

-- Get localized translation prompt
local title = STRINGS.PRETRANSLATED.LANGUAGES_TITLE[language_id]
local body = STRINGS.PRETRANSLATED.LANGUAGES_BODY[language_id]
local yes_text = STRINGS.PRETRANSLATED.LANGUAGES_YES[language_id]
local no_text = STRINGS.PRETRANSLATED.LANGUAGES_NO[language_id]

-- Create language selection dialog
ShowLanguageDialog(title, body, yes_text, no_text)

-- Check if platform-specific strings exist
if IsConsole() then
    -- Console may have different Spanish variants
    local spanish_name = STRINGS.PRETRANSLATED.LANGUAGES[LANGUAGE.SPANISH]
end
```

## Language Constants

### _LANGUAGE

**Type:** `table`

**Status:** `stable`

**Description:**
Internal language identifier constants used to index into the pretranslated strings tables.

#### Language Identifiers

| Constant | Value | Language |
|----------|-------|----------|
| `ENGLISH` | 0 | English |
| `ENGLISH_UK` | 1 | English (UK) |
| `FRENCH` | 2 | French |
| `FRENCH_CA` | 3 | French (Canada) |
| `SPANISH` | 4 | Spanish |
| `SPANISH_LA` | 5 | Spanish (Latin America) |
| `GERMAN` | 6 | German |
| `ITALIAN` | 7 | Italian |
| `PORTUGUESE` | 8 | Portuguese |
| `PORTUGUESE_BR` | 9 | Portuguese (Brazil) |
| `DUTCH` | 10 | Dutch |
| `FINNISH` | 11 | Finnish |
| `SWEDISH` | 12 | Swedish |
| `DANISH` | 13 | Danish |
| `NORWEGIAN` | 14 | Norwegian |
| `POLISH` | 15 | Polish |
| `RUSSIAN` | 16 | Russian |
| `TURKISH` | 17 | Turkish |
| `ARABIC` | 18 | Arabic |
| `KOREAN` | 19 | Korean |
| `JAPANESE` | 20 | Japanese |
| `CHINESE_T` | 21 | Traditional Chinese |
| `CHINESE_S` | 22 | Simplified Chinese |
| `CHINESE_S_RAIL` | 23 | Simplified Chinese (Rail) |

## String Tables

### STRINGS.PRETRANSLATED.LANGUAGES

**Type:** `table`

**Status:** `stable`

**Description:**
Maps language IDs to display names shown in language selection interfaces. Each entry contains the language name in both the native script and English.

**Supported Languages:**
- `[ENGLISH]`: "English"
- `[FRENCH]`: "Français (French)"
- `[SPANISH]`: "Español (Spanish)"
- `[SPANISH_LA]`: "Español (Latino)\n(Spanish - Latin America)"
- `[GERMAN]`: "Deutsch (German)"
- `[ITALIAN]`: "Italiano (Italian)"
- `[TURKISH]`: "Türkçe (Turkish)"
- `[PORTUGUESE_BR]`: "Português (Portuguese)"
- `[POLISH]`: "Polski (Polish)"
- `[RUSSIAN]`: "Русский (Russian)"
- `[KOREAN]`: "한국어 (Korean)"
- `[CHINESE_S]`: "简体中文 (Simplified Chinese)"
- `[CHINESE_T]`: "繁體中文 (Traditional Chinese)"

**Example:**
```lua
-- Display available languages
for language_id, language_name in pairs(STRINGS.PRETRANSLATED.LANGUAGES) do
    print(language_id .. ": " .. language_name)
end
```

### STRINGS.PRETRANSLATED.LANGUAGES_TITLE

**Type:** `table`

**Status:** `stable`

**Description:**
Localized titles for translation option dialogs, displayed when prompting users to enable translation for their language.

**Sample Entries:**
- `[ENGLISH]`: "Translation Option"
- `[FRENCH]`: "Option de traduction"
- `[SPANISH]`: "Opción de traducción"
- `[GERMAN]`: "Übersetzungsoption"
- `[RUSSIAN]`: "Вариант перевода"
- `[KOREAN]`: "번역 옵션"
- `[CHINESE_S]`: "语言设定"
- `[CHINESE_T]`: "語言設定"

### STRINGS.PRETRANSLATED.LANGUAGES_BODY

**Type:** `table`

**Status:** `stable`

**Description:**
Localized body text for translation prompts, asking users if they want to enable translation for their detected language.

**Sample Entries:**
- `[ENGLISH]`: "Your interface language is set to English. Would you like to enable the translation for your language?"
- `[FRENCH]`: "Votre langue d'interface est définie sur Français. Voulez-vous activer la traduction pour votre langue?"
- `[SPANISH]`: "El idioma de la interfaz está configurado a español. ¿Quieres permitir la traducción a tu idioma?"
- `[GERMAN]`: "Deine Sprache ist auf Deutsch eingestellt. Möchtest du die Übersetzung für deine Sprache aktivieren?"
- `[CHINESE_S]`: "是否把语言设定为中文？"
- `[CHINESE_T]`: "是否把語言設定為繁體中文？"

### STRINGS.PRETRANSLATED.LANGUAGES_YES

**Type:** `table`

**Status:** `stable`

**Description:**
Localized "Yes" button text for translation confirmation dialogs.

**Sample Entries:**
- `[ENGLISH]`: "Yes"
- `[FRENCH]`: "Oui"
- `[SPANISH]`: "Sí"
- `[GERMAN]`: "Ja"
- `[ITALIAN]`: "Sì"
- `[RUSSIAN]`: "Да"
- `[KOREAN]`: "예"
- `[CHINESE_S]`: "是"
- `[CHINESE_T]`: "是"

### STRINGS.PRETRANSLATED.LANGUAGES_NO

**Type:** `table`

**Status:** `stable`

**Description:**
Localized "No" button text for translation confirmation dialogs.

**Sample Entries:**
- `[ENGLISH]`: "No"
- `[FRENCH]`: "Non"
- `[SPANISH]`: "No"
- `[GERMAN]`: "Nein"
- `[ITALIAN]`: "No"
- `[TURKISH]`: "Hayır"
- `[PORTUGUESE_BR]`: "Não"
- `[POLISH]`: "Nie"
- `[RUSSIAN]`: "Нет"
- `[KOREAN]`: "아니"
- `[CHINESE_S]`: "否"
- `[CHINESE_T]`: "否"

## Platform-Specific Handling

### Console Platform Modifications

**Status:** `stable`

**Description:**
The module includes special handling for console platforms that may require different language naming conventions.

```lua
if IsConsole() then
    STRINGS.PRETRANSLATED.LANGUAGES[_LANGUAGE.SPANISH] = "Español - España\n(Spanish - Spain)"
end
```

This modification provides more specific regional identification for Spanish language variants on console platforms.

## Implementation Details

### UTF-8 Encoding

The module specifically handles UTF-8 encoded strings to support:

- **Accented Characters**: French, Spanish, German diacritics
- **Cyrillic Script**: Russian text
- **CJK Characters**: Chinese, Japanese, Korean text
- **Special Characters**: Turkish and other language-specific characters

### File Separation Rationale

This module is intentionally separated from the main strings system because:

1. **Editor Compatibility**: Some text editors struggle with UTF-8 encoding mixed with ASCII content
2. **Build Pipeline**: Reduces encoding conflicts during build processes  
3. **Localization Focus**: Contains only essential pre-translation content
4. **Maintenance**: Easier to update and validate UTF-8 content in isolation

## Integration Patterns

### Language Detection Flow

```lua
-- Typical usage in language selection
local function ShowTranslationPrompt(detected_language)
    local language_id = detected_language
    
    -- Get localized strings
    local title = STRINGS.PRETRANSLATED.LANGUAGES_TITLE[language_id]
    local body = STRINGS.PRETRANSLATED.LANGUAGES_BODY[language_id]
    local yes_text = STRINGS.PRETRANSLATED.LANGUAGES_YES[language_id]
    local no_text = STRINGS.PRETRANSLATED.LANGUAGES_NO[language_id]
    
    -- Create dialog with proper text
    local dialog = CreateTranslationDialog(title, body, yes_text, no_text)
    return dialog
end
```

### Language List Generation

```lua
-- Generate language selection menu
local function BuildLanguageMenu()
    local menu_items = {}
    
    for language_id, language_name in pairs(STRINGS.PRETRANSLATED.LANGUAGES) do
        table.insert(menu_items, {
            id = language_id,
            text = language_name,
            callback = function() SetGameLanguage(language_id) end
        })
    end
    
    return menu_items
end
```

## Best Practices

### Language Support

- **Complete Coverage**: Ensure all supported languages have entries in all string tables
- **Consistent Formatting**: Maintain uniform format across language entries
- **Regional Variants**: Handle regional differences appropriately (e.g., Spanish vs Spanish LA)
- **Platform Awareness**: Consider platform-specific requirements

### Text Quality

- **Native Speakers**: Use native speaker translations for quality
- **Cultural Sensitivity**: Respect cultural norms in language presentation
- **Length Considerations**: Account for text length variations between languages
- **Special Characters**: Ensure proper UTF-8 encoding for all characters

### Maintenance

- **Synchronized Updates**: Keep all language tables in sync when adding new languages
- **Encoding Validation**: Verify UTF-8 encoding integrity after changes
- **Platform Testing**: Test console-specific modifications on target platforms
- **Fallback Handling**: Implement fallbacks for unsupported languages

## Common Usage Patterns

### Language Selection Dialog
```lua
local function CreateLanguageSelectionDialog(current_language)
    local options = {}
    
    for lang_id, lang_name in pairs(STRINGS.PRETRANSLATED.LANGUAGES) do
        local option = {
            text = lang_name,
            selected = (lang_id == current_language),
            callback = function() 
                SetInterfaceLanguage(lang_id)
            end
        }
        table.insert(options, option)
    end
    
    return ShowSelectionDialog("Select Language", options)
end
```

### First-Time Setup Prompt
```lua
local function ShowFirstTimeLanguagePrompt()
    local system_language = GetSystemLanguage()
    
    if STRINGS.PRETRANSLATED.LANGUAGES[system_language] then
        local title = STRINGS.PRETRANSLATED.LANGUAGES_TITLE[system_language]
        local body = STRINGS.PRETRANSLATED.LANGUAGES_BODY[system_language]
        local yes = STRINGS.PRETRANSLATED.LANGUAGES_YES[system_language]
        local no = STRINGS.PRETRANSLATED.LANGUAGES_NO[system_language]
        
        ShowConfirmationDialog(title, body, yes, no, function(accepted)
            if accepted then
                EnableTranslation(system_language)
            else
                SetLanguagePreference("english")
            end
        end)
    end
end
```

### Multi-Platform Language Handling
```lua
local function GetPlatformLanguageName(language_id)
    local base_name = STRINGS.PRETRANSLATED.LANGUAGES[language_id]
    
    -- Apply platform-specific modifications
    if IsConsole() and language_id == _LANGUAGE.SPANISH then
        return "Español - España\n(Spanish - Spain)"
    end
    
    return base_name
end
```

## Related Modules

- [Strings](./strings.md): Main localization and string management system
- [Config](./config.md): Configuration system for language preferences
- [Platform](./platform.md): Platform detection and handling utilities
- [Profile](./profile.md): User profile system that stores language preferences

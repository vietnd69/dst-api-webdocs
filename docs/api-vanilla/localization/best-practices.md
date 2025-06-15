---
id: best-practices
title: Localization Best Practices
sidebar_position: 5
version: 619045
---

# Localization Best Practices

This guide covers best practices for creating high-quality, maintainable localizations for your Don't Starve Together mods. Following these guidelines will help ensure your translations are accurate, consistent, and user-friendly.

## Planning for Localization

### Start Early

- **Design with localization in mind** from the beginning of your mod development
- **Separate text from code** to make translations easier to manage
- **Create a localization plan** identifying which languages to support and how to obtain translations

### Choose Target Languages Strategically

Consider these factors when selecting languages to support:

- **Player demographics**: Which languages are most common among DST players?
- **Mod complexity**: More text-heavy mods require more translation effort
- **Available resources**: Do you have access to native speakers for quality control?
- **Common languages**: English, Simplified Chinese, Russian, Spanish, and Portuguese cover a large portion of the player base

## Writing for Translation

### Keep Text Simple and Clear

- **Use simple sentence structures** that are easier to translate
- **Avoid idioms, slang, and cultural references** that may not translate well
- **Be consistent with terminology** throughout your mod
- **Provide context for translators** about where and how text is used

### Example: Writing Translation-Friendly Text

```lua
-- Difficult to translate
STRINGS.MY_MOD.UI.TOOLTIP = "Hit the road to kick off your adventure!"

-- Better for translation
STRINGS.MY_MOD.UI.TOOLTIP = "Start your adventure by traveling."
```

### Handle Variables Carefully

- **Use named placeholders** instead of positional ones
- **Provide context about what variables represent**
- **Consider word order differences** between languages

```lua
-- Problematic for translation (order may differ in other languages)
local message = string.format("Found %d %s in %s", count, item_name, location)

-- Better approach with named variables
STRINGS.MY_MOD.MESSAGES.ITEM_FOUND = "Found {count} {item} in {location}"

local message = FormatString(STRINGS.MY_MOD.MESSAGES.ITEM_FOUND, {
    count = count,
    item = item_name,
    location = location
})
```

### Avoid Concatenation

- **Never build sentences by concatenating strings**
- **Use complete sentences with placeholders** instead

```lua
-- Problematic (impossible to translate properly)
local message = STRINGS.MY_MOD.PREFIXES.FOUND .. count .. " " .. item_name

-- Better approach
local message = FormatString(STRINGS.MY_MOD.MESSAGES.FOUND_ITEMS, {count = count, item = item_name})
```

### Handle Plurals Properly

- **Create separate strings for singular and plural forms**
- **Consider that some languages have more than two plural forms**

```lua
-- Basic approach
if count == 1 then
    message = FormatString(STRINGS.MY_MOD.MESSAGES.FOUND_SINGLE, {item = item_name})
else
    message = FormatString(STRINGS.MY_MOD.MESSAGES.FOUND_MULTIPLE, {count = count, item = item_name})
end

-- More comprehensive approach for languages with complex plural rules
local function GetPluralForm(count, language)
    if language == "en" then
        return count == 1 and "one" or "other"
    elseif language == "ru" then
        -- Russian has more complex plural rules
        if count % 10 == 1 and count % 100 ~= 11 then
            return "one"
        elseif count % 10 >= 2 and count % 10 <= 4 and (count % 100 < 10 or count % 100 >= 20) then
            return "few"
        else
            return "many"
        end
    end
    -- Default
    return "other"
end

local plural_form = GetPluralForm(count, GLOBAL.LanguageTranslator.defaultlanguage)
local message = FormatString(STRINGS.MY_MOD.MESSAGES["FOUND_" .. string.upper(plural_form)], 
                            {count = count, item = item_name})
```

## Working with Translators

### Provide Clear Context

- **Add comments in string tables** explaining where and how text is used
- **Provide screenshots** of UI elements showing text in context
- **Explain game-specific terminology** that might be unfamiliar

```lua
-- Good context for translators
-- CONTEXT: Shown when player discovers a new recipe. {item} is the recipe name.
STRINGS.MY_MOD.MESSAGES.RECIPE_DISCOVERED = "New recipe discovered: {item}"

-- CONTEXT: Button text for crafting menu, should be short (max 10 chars)
STRINGS.MY_MOD.UI.BUTTONS.CRAFT = "Craft"
```

### Create a Translation Guide

Provide translators with:

1. **Glossary of terms** specific to your mod
2. **Style guide** for tone and voice
3. **Character limits** for UI elements
4. **Variable explanations** and how they're used
5. **Screenshots or mockups** showing text in context

### Establish a Review Process

- **Have native speakers review translations** when possible
- **Test translations in-game** to catch context issues
- **Create a feedback channel** for players to report translation issues

## Technical Implementation

### Use a Modular Approach

- **Separate string tables by language and category**
- **Use a consistent loading system** for all languages
- **Implement fallbacks** for missing translations

### Create Maintainable String Tables

- **Use descriptive, hierarchical keys**
- **Group related strings together**
- **Comment string tables thoroughly**

```lua
STRINGS.MY_MOD = {
    -- Item names and descriptions
    ITEMS = {
        -- CONTEXT: A magical sword that glows
        MAGIC_SWORD = {
            NAME = "Magic Sword",
            DESCRIPTION = "A sword imbued with magical energy.",
        },
        
        -- CONTEXT: A staff that shoots fireballs
        FIRE_STAFF = {
            NAME = "Fire Staff",
            DESCRIPTION = "Launches fireballs at enemies.",
        },
    },
    
    -- UI elements
    UI = {
        -- CONTEXT: Main menu buttons
        BUTTONS = {
            -- CONTEXT: Opens crafting menu
            CRAFT = "Craft",
            -- CONTEXT: Opens inventory
            INVENTORY = "Inventory",
        },
    },
}
```

### Handle Special Cases

- **Create special handling for languages with unique requirements**
- **Implement custom formatting for dates, numbers, and currencies**

```lua
local function FormatNumber(number)
    local language = GLOBAL.LanguageTranslator.defaultlanguage
    
    if language == "en" then
        -- 1,234.56
        return string.format("%s", number):gsub("^(-?)(%d+)(%d%d%d)", '%1%2,%3')
    elseif language == "de" or language == "fr" then
        -- 1.234,56
        return string.format("%s", number):gsub("^(-?)(%d+)(%d%d%d)", '%1%2.%3'):gsub("%.", ",")
    end
    
    -- Default format
    return tostring(number)
end
```

## Testing and Quality Assurance

### Automated Testing

- **Create scripts to verify all strings are translated**
- **Check for missing or untranslated strings**
- **Validate string formatting and placeholders**

```lua
local function ValidateTranslations(base_strings, translated_strings, language)
    local missing = {}
    
    -- Check for missing translations
    for key, value in pairs(base_strings) do
        if type(value) == "table" then
            if translated_strings[key] == nil then
                table.insert(missing, key)
            else
                -- Recursively check nested tables
                ValidateTranslations(base_strings[key], translated_strings[key], language)
            end
        else
            if translated_strings[key] == nil or translated_strings[key] == value then
                table.insert(missing, key)
            end
        end
    end
    
    if #missing > 0 then
        print("Missing translations for " .. language .. ":")
        for _, key in ipairs(missing) do
            print("  - " .. key)
        end
    end
end

-- Usage
ValidateTranslations(STRINGS.MY_MOD, TRANSLATIONS.ZH.MY_MOD, "zh")
```

### Visual Testing

- **Check text rendering in all supported languages**
- **Verify UI layout with different text lengths**
- **Test with different font sizes and screen resolutions**

### Common Issues to Watch For

- **Text overflow**: Translations may be longer than the original text
- **Font rendering**: Some characters may not display correctly
- **Line breaks**: Different languages may require different line break rules
- **Right-to-left issues**: For languages like Arabic and Hebrew
- **Special characters**: Ensure proper encoding and font support

## Maintenance and Updates

### Version Control for Translations

- **Track changes to string tables** between versions
- **Clearly mark new strings** that need translation
- **Maintain a changelog** specifically for localization

```lua
-- Version 1.0 strings
STRINGS.MY_MOD.ITEMS.SWORD.NAME = "Sword"

-- Version 1.1 strings
-- New in v1.1
STRINGS.MY_MOD.ITEMS.STAFF.NAME = "Staff"

-- Changed in v1.1 (was "Sword")
STRINGS.MY_MOD.ITEMS.SWORD.NAME = "Magic Sword"
```

### Community Contributions

- **Create clear guidelines** for community translators
- **Set up a platform** for submitting and reviewing translations
- **Credit all translators** in your mod documentation

### Regular Updates

- **Update translations with each mod update**
- **Communicate with translators** about upcoming changes
- **Prioritize fixing reported translation issues**

## Next Steps

After implementing localization best practices, explore:

- [Testing Localized Content](testing-localization.md) - For thorough quality assurance

By following these best practices, you can create high-quality localizations that make your mod accessible and enjoyable for players around the world, significantly expanding your mod's reach and impact in the Don't Starve Together community. 
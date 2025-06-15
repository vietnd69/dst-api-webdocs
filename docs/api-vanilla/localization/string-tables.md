---
id: string-tables
title: Managing String Tables
sidebar_position: 3
last_updated: 2023-07-06
version: 619045
---

# Managing String Tables for Localization

This guide covers best practices for organizing, maintaining, and scaling string tables in your Don't Starve Together mods to support multiple languages efficiently.

## String Table Structure

A well-organized string table structure is essential for maintainable localization. Here's a recommended structure:

```lua
STRINGS.MY_MOD = {
    -- Categorize by content type
    ITEMS = {
        ITEM_1 = { NAME = "Item Name", DESCRIPTION = "Item description." },
        ITEM_2 = { NAME = "Another Item", DESCRIPTION = "Another description." },
    },
    CHARACTERS = {
        CHARACTER_1 = {
            DESCRIBE = {
                ITEM_1 = "Character's comment about item 1",
                ITEM_2 = "Character's comment about item 2",
            },
            ACTIONFAIL = {
                ITEM_1 = "Failed action comment",
            },
        },
    },
    UI = {
        BUTTONS = {
            CRAFT = "Craft",
            CANCEL = "Cancel",
        },
        TOOLTIPS = {
            ITEM_1 = "Tooltip for item 1",
        },
    },
    -- Add more categories as needed
}
```

## Naming Conventions

Consistent naming conventions make string tables easier to manage:

- Use `UPPERCASE` for keys
- Use descriptive, hierarchical names
- Group related strings together
- Use consistent patterns for similar items

```lua
-- Good naming convention
STRINGS.MY_MOD.ITEMS.MAGIC_SWORD = { NAME = "Magic Sword" }
STRINGS.MY_MOD.ITEMS.MAGIC_STAFF = { NAME = "Magic Staff" }

-- Avoid inconsistent naming
STRINGS.MY_MOD.SWORD_NAME = "Magic Sword" -- Inconsistent structure
STRINGS.MY_MOD.staff = { name = "Magic Staff" } -- Inconsistent casing
```

## String Table Management for Large Mods

For mods with extensive content, consider breaking down string tables into multiple files:

```
modroot/
  ├── scripts/
  │    └── languages/
  │         ├── en/
  │         │    ├── items.lua
  │         │    ├── characters.lua
  │         │    ├── ui.lua
  │         │    └── misc.lua
  │         ├── zh/
  │         │    ├── items.lua
  │         │    ├── characters.lua
  │         │    ├── ui.lua
  │         │    └── misc.lua
  │         └── strings_loader.lua
  └── modmain.lua
```

Then use a loader script to combine them:

```lua
-- strings_loader.lua
local function LoadLanguageFiles(language)
    local path = "scripts/languages/" .. language .. "/"
    
    -- Load each category file if it exists
    local categories = {"items", "characters", "ui", "misc"}
    for _, category in ipairs(categories) do
        local file_path = path .. category .. ".lua"
        if GLOBAL.kleifileexists(file_path) then
            modimport(file_path)
        end
    end
end

-- Load English as default
LoadLanguageFiles("en")

-- Load user's language if available
local language = GLOBAL.LanguageTranslator.defaultlanguage
if language ~= "en" and GLOBAL.kleifileexists("scripts/languages/" .. language) then
    LoadLanguageFiles(language)
end
```

## String Interpolation

For strings that require dynamic values, use a consistent pattern:

```lua
-- In string table
STRINGS.MY_MOD.UI.TOOLTIPS.DAMAGE = "Deals {damage} damage"
STRINGS.MY_MOD.UI.TOOLTIPS.HEALING = "Restores {amount} health over {duration} seconds"

-- In code
function FormatString(str, variables)
    local result = str
    for key, value in pairs(variables) do
        result = string.gsub(result, "{" .. key .. "}", tostring(value))
    end
    return result
end

local tooltip = FormatString(STRINGS.MY_MOD.UI.TOOLTIPS.DAMAGE, {damage = 25})
-- Result: "Deals 25 damage"

local healing_tooltip = FormatString(STRINGS.MY_MOD.UI.TOOLTIPS.HEALING, {amount = 50, duration = 10})
-- Result: "Restores 50 health over 10 seconds"
```

## Translation Management Tools

For larger mods with many strings, consider using external tools to manage translations:

### Spreadsheet Method

1. Create a spreadsheet with columns for key, English text, and each supported language
2. Export to CSV
3. Use a script to convert the CSV to Lua string tables

Example spreadsheet:
```
Key                     | English        | Chinese      | Russian
-----------------------|----------------|-------------|-------------
ITEMS.SWORD.NAME       | Magic Sword    | 魔法剑        | Магический меч
ITEMS.SWORD.DESCRIPTION | A magical sword| 一把魔法剑    | Магический меч
```

### JSON Intermediate Format

Store translations in JSON for easier collaboration:

```json
{
  "ITEMS": {
    "SWORD": {
      "NAME": {
        "en": "Magic Sword",
        "zh": "魔法剑",
        "ru": "Магический меч"
      },
      "DESCRIPTION": {
        "en": "A magical sword",
        "zh": "一把魔法剑",
        "ru": "Магический меч"
      }
    }
  }
}
```

Then convert to Lua string tables with a script.

## Version Control for Translations

When working with multiple translators, use these practices:

1. Keep each language in separate files
2. Use clear comments to provide context for translators
3. Mark untranslated strings clearly
4. Track translation progress

Example with comments for translators:

```lua
-- strings_zh.lua

-- CONTEXT: This is the name of a magical sword item
STRINGS.MY_MOD.ITEMS.MAGIC_SWORD.NAME = "魔法剑"

-- CONTEXT: This describes a sword that glows with magical energy
STRINGS.MY_MOD.ITEMS.MAGIC_SWORD.DESCRIPTION = "一把闪烁着魔法能量的剑。"

-- TODO: Translation needed
-- STRINGS.MY_MOD.ITEMS.MAGIC_STAFF.NAME = "Magic Staff"
```

## Handling Missing Translations

Always implement a robust system for handling missing translations:

```lua
function GetLocalizedString(stringTable, key, subKey, fallback)
    if stringTable and stringTable[key] then
        if subKey then
            if stringTable[key][subKey] then
                return stringTable[key][subKey]
            end
        else
            return stringTable[key]
        end
    end
    return fallback or (subKey and key .. "." .. subKey or key)
end

-- Usage for nested tables
local itemName = GetLocalizedString(STRINGS.MY_MOD.ITEMS, "MAGIC_SWORD", "NAME", "Magic Sword")
```

## Updating String Tables

When updating your mod, follow these practices for string table updates:

1. Never remove existing string keys (could break translations)
2. Add new strings at the end of each category
3. Comment deprecated strings rather than removing them
4. Use version numbers in comments for tracking changes

```lua
-- strings_en.lua

-- Version 1.0
STRINGS.MY_MOD.ITEMS.MAGIC_SWORD.NAME = "Magic Sword"
STRINGS.MY_MOD.ITEMS.MAGIC_SWORD.DESCRIPTION = "A magical sword."

-- Version 1.1
STRINGS.MY_MOD.ITEMS.MAGIC_STAFF.NAME = "Magic Staff"
STRINGS.MY_MOD.ITEMS.MAGIC_STAFF.DESCRIPTION = "A magical staff."

-- Deprecated in version 1.1, kept for backwards compatibility
-- STRINGS.MY_MOD.ITEMS.OLD_ITEM.NAME = "Old Item"
```

## Automated String Extraction

For large mods, consider automating string extraction:

1. Use consistent string access patterns in your code
2. Create a script that scans your code for these patterns
3. Generate a template string table with all required keys
4. Compare against existing translations to find missing strings

Example pattern for automated extraction:
```lua
-- In your code, use a consistent pattern
local itemName = STRINGS.MY_MOD.ITEMS.MAGIC_SWORD.NAME

-- A script can scan for patterns like:
-- STRINGS%.MY_MOD%.([%w_]+)%.([%w_]+)%.?([%w_]*)
-- to extract string keys
```

## Next Steps

After mastering string table management, explore:

- [Font Handling](font-handling.md) - For languages with special character requirements
- [Localization Best Practices](best-practices.md) - For effective translations
- [Testing Localized Content](testing-localization.md) - For quality assurance

Effective string table management is the foundation of a well-localized mod, making it easier to add new languages and maintain existing translations as your mod evolves. 

---
id: multilingual-support
title: Implementing Multilingual Support
sidebar_position: 2
last_updated: 2023-07-06
version: 619045
---

# Implementing Multilingual Support in Mods

This guide covers the essential steps for adding multilingual support to your Don't Starve Together mods, allowing players worldwide to enjoy your content in their preferred language.

## Basic Structure

The localization system in Don't Starve Together uses string tables organized by language. Here's how to set up the basic structure:

```lua
-- In your modmain.lua or a separate strings.lua file
STRINGS = GLOBAL.STRINGS

-- Create namespaces for your mod's strings
STRINGS.MY_MOD = {}
STRINGS.MY_MOD.ITEMS = {}
STRINGS.MY_MOD.CHARACTERS = {}
STRINGS.MY_MOD.UI = {}
```

## Language Detection

Don't Starve Together automatically detects the player's language setting. You can access the current language using:

```lua
local language = GLOBAL.LanguageTranslator.defaultlanguage
-- Returns language code like "en", "zh", "ru", etc.
```

## String Tables Organization

Create separate files for each supported language:

```
modroot/
  ├── scripts/
  │    └── languages/
  │         ├── strings_en.lua  -- English (default)
  │         ├── strings_zh.lua  -- Chinese
  │         ├── strings_ru.lua  -- Russian
  │         └── strings_es.lua  -- Spanish
  └── modmain.lua
```

## Loading Language Files

In your modmain.lua, load the appropriate language file:

```lua
-- Default to English
modimport("scripts/languages/strings_en.lua")

-- Load language-specific strings if available
local language = GLOBAL.LanguageTranslator.defaultlanguage
if language ~= "en" then
    local language_file = "scripts/languages/strings_" .. language .. ".lua"
    
    -- Check if we have a translation for this language
    if GLOBAL.kleifileexists("scripts/languages/strings_" .. language .. ".lua") then
        modimport(language_file)
    end
end
```

## Creating String Tables

Here's an example of how to structure your English strings file (strings_en.lua):

```lua
STRINGS = GLOBAL.STRINGS

-- Item names and descriptions
STRINGS.MY_MOD.ITEMS.MAGIC_SWORD = {
    NAME = "Magic Sword",
    DESCRIPTION = "A powerful magical weapon.",
}

-- Character speech
STRINGS.MY_MOD.CHARACTERS.HERO = {
    DESCRIBE = {
        MAGIC_SWORD = "This sword glows with magical energy!",
        MONSTER = "What a terrifying creature!",
    },
    ACTIONFAIL = {
        MAGIC_SWORD = "I'm not skilled enough to use this yet.",
    },
}

-- UI elements
STRINGS.MY_MOD.UI = {
    BUTTON_CRAFT = "Craft",
    BUTTON_CANCEL = "Cancel",
    TOOLTIP_MAGIC = "Increases magical abilities by {magic_value}%",
}
```

And a corresponding Chinese translation (strings_zh.lua):

```lua
STRINGS = GLOBAL.STRINGS

-- Item names and descriptions
STRINGS.MY_MOD.ITEMS.MAGIC_SWORD = {
    NAME = "魔法剑",
    DESCRIPTION = "一把强大的魔法武器。",
}

-- Character speech
STRINGS.MY_MOD.CHARACTERS.HERO = {
    DESCRIBE = {
        MAGIC_SWORD = "这把剑闪烁着魔法能量！",
        MONSTER = "多么可怕的生物！",
    },
    ACTIONFAIL = {
        MAGIC_SWORD = "我还不够熟练，无法使用它。",
    },
}

-- UI elements
STRINGS.MY_MOD.UI = {
    BUTTON_CRAFT = "制作",
    BUTTON_CANCEL = "取消",
    TOOLTIP_MAGIC = "增加魔法能力 {magic_value}%",
}
```

## Using Localized Strings

Once your string tables are set up, you can use them throughout your mod:

```lua
-- For item names and descriptions
local item = CreateEntity()
item.entity:AddNetwork()

local inventoryitem = item:AddComponent("inventoryitem")
inventoryitem:SetAtlas("images/inventoryimages/magic_sword.xml")
inventoryitem:SetImage("magic_sword")

item:AddComponent("inspectable")
item.components.inspectable:SetDescription(STRINGS.MY_MOD.ITEMS.MAGIC_SWORD.DESCRIPTION)

-- For UI text
local button = Button("button_craft", STRINGS.MY_MOD.UI.BUTTON_CRAFT)

-- For dynamic text with variables
local magic_value = 25
local tooltip_text = string.gsub(
    STRINGS.MY_MOD.UI.TOOLTIP_MAGIC,
    "{magic_value}",
    tostring(magic_value)
)
```

## Supporting Special Characters

For languages with special characters or non-Latin scripts, ensure your text files are saved with UTF-8 encoding. This is essential for proper display of characters in languages like Chinese, Russian, Japanese, and Korean.

## Fallback Mechanism

Always implement a fallback mechanism for missing translations:

```lua
function GetLocalizedString(stringTable, key, fallback)
    if stringTable and stringTable[key] then
        return stringTable[key]
    else
        return fallback or key
    end
end

-- Usage
local itemName = GetLocalizedString(STRINGS.MY_MOD.ITEMS.MAGIC_SWORD, "NAME", "Magic Sword")
```

## Handling Language Changes

To handle language changes during gameplay (rare but possible), you can listen for the language change event:

```lua
local function OnLanguageChanged()
    -- Reload your language files
    -- Update any visible UI elements
end

AddPrefabPostInit("world", function(world)
    world:ListenForEvent("languagechanged", OnLanguageChanged, world)
end)
```

## Testing Different Languages

During development, you can test different languages by temporarily changing the language detection code:

```lua
-- For testing purposes only
local test_language = "zh"  -- Test Chinese
local language_file = "scripts/languages/strings_" .. test_language .. ".lua"
if GLOBAL.kleifileexists(language_file) then
    modimport(language_file)
end
```

Remember to remove this testing code before releasing your mod.

## Next Steps

After implementing basic multilingual support, explore more advanced topics:

- [String Table Management](string-tables.md) - For organizing larger translation projects
- [Font Handling](font-handling.md) - For languages requiring special fonts
- [Localization Best Practices](best-practices.md) - For making your translations more effective
- [Testing Localized Content](testing-localization.md) - For ensuring quality across languages

By following these guidelines, you can make your mod accessible to a global audience and significantly increase its reach and popularity in the Don't Starve Together community. 

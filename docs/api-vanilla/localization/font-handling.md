---
id: font-handling
title: Font Handling for Different Languages
sidebar_position: 4
version: 619045
---

# Font Handling for Different Languages

This guide covers techniques for handling fonts in Don't Starve Together mods to support various languages, especially those with non-Latin scripts like Chinese, Japanese, Korean, Russian, and Arabic.

## Font Challenges in Localization

Different languages present unique font challenges:

- **Character Set Coverage**: Many languages use characters outside the basic Latin set
- **Glyph Complexity**: Some languages have thousands of unique characters (CJK languages)
- **Text Direction**: Some languages read right-to-left (Arabic, Hebrew)
- **Character Size**: Some scripts need larger font sizes to remain legible
- **Line Height**: Some scripts require more vertical space

## Default Font Support in Don't Starve Together

Don't Starve Together includes built-in support for several languages:

- Latin scripts (English, Spanish, French, etc.)
- Cyrillic scripts (Russian)
- Chinese (Simplified and Traditional)
- Japanese
- Korean

For these languages, the game automatically handles font selection based on the user's language setting.

## Using Built-in Fonts

To use the game's built-in fonts:

```lua
-- Access the game's font system
local NEWFONT = GLOBAL.NEWFONT
local DIALOGFONT = GLOBAL.DIALOGFONT
local TITLEFONT = GLOBAL.TITLEFONT
local NUMBERFONT = GLOBAL.NUMBERFONT
local SMALLNUMBERFONT = GLOBAL.SMALLNUMBERFONT
local TALKINGFONT = GLOBAL.TALKINGFONT
local UIFONT = GLOBAL.UIFONT

-- Example: Creating text with the appropriate font
local text = widget:AddChild(Text(NEWFONT, 30))
text:SetString(STRINGS.MY_MOD.UI.TITLE)
```

The game will automatically use the appropriate font for the current language.

## Font Size Adjustments for Different Languages

Some languages need different font sizes to be readable:

```lua
-- Adjust font size based on language
local function GetAdjustedFontSize(base_size)
    local language = GLOBAL.LanguageTranslator.defaultlanguage
    
    -- CJK languages often need larger fonts
    if language == "zh" or language == "ja" or language == "ko" then
        return base_size * 1.2 -- 20% larger
    -- Cyrillic may need slight adjustments
    elseif language == "ru" then
        return base_size * 1.1 -- 10% larger
    else
        return base_size
    end
end

-- Usage
local title_text = widget:AddChild(Text(TITLEFONT, GetAdjustedFontSize(30)))
title_text:SetString(STRINGS.MY_MOD.UI.TITLE)
```

## Custom Font Integration

For languages or special characters not supported by the default fonts, you can add custom fonts:

### 1. Prepare Font Assets

Create your custom font using a tool like BMFont or Glyph Designer. You'll need:
- A .tex file (texture atlas containing glyphs)
- A .xml file (describing glyph positions and metrics)

### 2. Add Font Files to Your Mod

```
modroot/
  ├── fonts/
  │    ├── my_custom_font.tex
  │    └── my_custom_font.xml
  └── modmain.lua
```

### 3. Register the Font

```lua
-- In modmain.lua
Assets = {
    Asset("FONT", "fonts/my_custom_font.xml"),
}

-- Register the font
local function RegisterCustomFont()
    -- Wait until the game is fully loaded
    AddSimPostInit(function()
        -- Register your custom font
        GLOBAL.TheSim:RegisterFont("fonts/my_custom_font.xml")
        
        -- Create a global reference
        GLOBAL.MY_CUSTOM_FONT = "fonts/my_custom_font.xml"
    end)
end

RegisterCustomFont()
```

### 4. Use Your Custom Font

```lua
-- Create text with your custom font
local function CreateCustomText(parent, text_string, size)
    local text = parent:AddChild(Text(GLOBAL.MY_CUSTOM_FONT, size or 30))
    text:SetString(text_string)
    return text
end

-- Usage
local my_text = CreateCustomText(root, STRINGS.MY_MOD.UI.TITLE)
```

## Language-Specific Font Selection

To use different fonts for different languages:

```lua
local function GetLanguageFont(default_font)
    local language = GLOBAL.LanguageTranslator.defaultlanguage
    
    if language == "zh" then
        return GLOBAL.NEWFONT -- Chinese font
    elseif language == "ja" then
        return GLOBAL.MY_JAPANESE_FONT -- Custom Japanese font
    elseif language == "ko" then
        return GLOBAL.NEWFONT -- Korean font
    elseif language == "ru" then
        return GLOBAL.NEWFONT -- Cyrillic font
    elseif language == "ar" then
        return GLOBAL.MY_ARABIC_FONT -- Custom Arabic font
    else
        return default_font -- Default Latin font
    end
end

-- Usage
local text = widget:AddChild(Text(GetLanguageFont(GLOBAL.DIALOGFONT), 30))
text:SetString(STRINGS.MY_MOD.UI.MESSAGE)
```

## Text Wrapping and Line Height

Different languages may require different text wrapping and line height settings:

```lua
local function ConfigureTextForLanguage(text_widget)
    local language = GLOBAL.LanguageTranslator.defaultlanguage
    
    -- Base settings
    local line_spacing = 2
    local max_width = 200
    
    -- Adjust for specific languages
    if language == "zh" or language == "ja" or language == "ko" then
        line_spacing = 4 -- More space between lines for CJK
        max_width = 180 -- Narrower width for CJK characters
    elseif language == "ru" then
        line_spacing = 3 -- Slightly more space for Cyrillic
    elseif language == "de" then
        max_width = 220 -- German words can be longer
    end
    
    -- Apply settings
    text_widget:SetLineSpacing(line_spacing)
    text_widget:SetRegionSize(max_width, 100)
    text_widget:EnableWordWrap(true)
end

-- Usage
local description = widget:AddChild(Text(DIALOGFONT, 25))
description:SetString(STRINGS.MY_MOD.ITEMS.MAGIC_SWORD.DESCRIPTION)
ConfigureTextForLanguage(description)
```

## Right-to-Left (RTL) Language Support

For RTL languages like Arabic and Hebrew:

```lua
local function ConfigureRTLText(text_widget)
    local language = GLOBAL.LanguageTranslator.defaultlanguage
    
    -- Check if current language is RTL
    local is_rtl = (language == "ar" or language == "he")
    
    if is_rtl then
        -- For RTL languages, reverse the string
        -- This is a simplified approach; proper RTL support is more complex
        local original_text = text_widget:GetString()
        local reversed_text = ""
        
        for i = string.len(original_text), 1, -1 do
            reversed_text = reversed_text .. string.sub(original_text, i, i)
        end
        
        text_widget:SetString(reversed_text)
        
        -- Align to the right
        text_widget:SetHAlign(GLOBAL.ANCHOR_RIGHT)
    else
        -- For LTR languages, use default alignment
        text_widget:SetHAlign(GLOBAL.ANCHOR_LEFT)
    end
end

-- Usage
local text = widget:AddChild(Text(DIALOGFONT, 25))
text:SetString(STRINGS.MY_MOD.UI.MESSAGE)
ConfigureRTLText(text)
```

**Note**: Full RTL support is complex and may require specialized libraries. The above is a simplified approach.

## Dynamic Text Sizing

For UI elements where space is limited, implement dynamic text sizing:

```lua
local function FitTextToWidth(text_widget, max_width)
    local text_width = text_widget:GetRegionSize()
    
    if text_width > max_width then
        -- Calculate scale factor to fit
        local scale = max_width / text_width
        local current_size = text_widget:GetSize()
        
        -- Apply new size
        text_widget:SetSize(math.max(current_size * scale, 12))
    end
end

-- Usage
local button_label = button:AddChild(Text(DIALOGFONT, 25))
button_label:SetString(STRINGS.MY_MOD.UI.BUTTONS.LONG_BUTTON_NAME)
FitTextToWidth(button_label, 100) -- Fit to 100 pixels width
```

## Font Fallbacks

Implement a fallback system for unsupported characters:

```lua
local function SetTextWithFallback(text_widget, text_string, primary_font, fallback_font)
    -- Try with primary font first
    text_widget:SetFont(primary_font)
    text_widget:SetString(text_string)
    
    -- Check if any characters are missing (will show as □ or ?)
    local rendered_text = text_widget:GetString()
    local has_missing_chars = string.find(rendered_text, "□") or string.find(rendered_text, "?")
    
    -- If missing characters, try fallback font
    if has_missing_chars and fallback_font then
        text_widget:SetFont(fallback_font)
        text_widget:SetString(text_string)
    end
end

-- Usage
local text = widget:AddChild(Text(DIALOGFONT, 25))
SetTextWithFallback(text, STRINGS.MY_MOD.UI.MESSAGE, DIALOGFONT, GLOBAL.MY_CUSTOM_FONT)
```

## Testing Font Rendering

To test font rendering for different languages:

```lua
local function TestFontRendering(widget, font, size)
    local languages = {
        { code = "en", sample = "The quick brown fox jumps over the lazy dog" },
        { code = "zh", sample = "敏捷的棕色狐狸跳过懒狗" },
        { code = "ja", sample = "素早い茶色のキツネが怠け者の犬を飛び越えます" },
        { code = "ko", sample = "빠른 갈색 여우가 게으른 개를 뛰어 넘습니다" },
        { code = "ru", sample = "Быстрая коричневая лиса прыгает через ленивую собаку" },
        { code = "de", sample = "Der schnelle braune Fuchs springt über den faulen Hund" },
    }
    
    local y_offset = 0
    for _, lang in ipairs(languages) do
        local text = widget:AddChild(Text(font, size))
        text:SetPosition(0, y_offset)
        text:SetString(lang.code .. ": " .. lang.sample)
        y_offset = y_offset - (size + 5)
    end
end

-- Usage during development
local root = GLOBAL.CreateScreen("FontTest")
TestFontRendering(root, DIALOGFONT, 25)
GLOBAL.TheFrontEnd:PushScreen(root)
```

## Next Steps

After implementing proper font handling, explore:

- [Localization Best Practices](best-practices.md) - For effective translations
- [Testing Localized Content](testing-localization.md) - For quality assurance

Proper font handling is essential for making your mod accessible to players worldwide, especially those using languages with non-Latin scripts. By implementing these techniques, you can ensure your mod's text is readable and appealing across all supported languages. 
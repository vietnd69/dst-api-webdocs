---
id: fonts
title: Fonts
description: Font constants and configuration system for text rendering in Don't Starve Together
sidebar_position: 57
slug: core-systems-fonts
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Fonts

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `fonts.lua` module defines the font system for Don't Starve Together, including font constants, fallback configurations, and the master font registry. It provides standardized font aliases and manages language-specific font variants to ensure consistent text rendering across different UI elements and languages.

## Usage Example

```lua
-- Use predefined font constants
local text_widget = Text(DEFAULTFONT, 24, "Hello World!")
local title = Text(TITLEFONT, 48, "Game Title")
local chat_message = Text(CHATFONT, 20, "Player message")

-- Access font configuration
for _, font_config in ipairs(FONTS) do
    print("Font: " .. font_config.alias .. " -> " .. font_config.filename)
end
```

## Font Constants

### Primary UI Fonts

#### DEFAULTFONT

**Value:** `"opensans"`

**Description:** Default font used for general UI text and dialogue.

#### DIALOGFONT

**Value:** `"opensans"`

**Description:** Font used for dialogue text. Currently identical to DEFAULTFONT.

#### TITLEFONT

**Value:** `"bp100"`

**Description:** Large decorative font used for game titles and headers.

#### UIFONT

**Value:** `"bp50"`

**Description:** Medium-sized font used for general UI elements.

#### BUTTONFONT

**Value:** `"buttonfont"`

**Description:** Font specifically designed for button text.

### Modern UI Fonts

#### NEWFONT

**Value:** `"spirequal"`

**Description:** Primary modern UI font for new interface elements.

#### NEWFONT_SMALL

**Value:** `"spirequal_small"`

**Description:** Smaller variant of the modern UI font.

#### NEWFONT_OUTLINE

**Value:** `"spirequal_outline"`

**Description:** Outlined version of the modern UI font for better visibility.

#### NEWFONT_OUTLINE_SMALL

**Value:** `"spirequal_outline_small"`

**Description:** Small outlined variant (currently not in use).

### Specialized Fonts

#### NUMBERFONT

**Value:** `"stint-ucr"`

**Description:** Font optimized for displaying numbers.

#### SMALLNUMBERFONT

**Value:** `"stint-small"`

**Description:** Smaller version of the number font.

#### BODYTEXTFONT

**Value:** `"stint-ucr"`

**Description:** Font used for body text and descriptions.

#### CODEFONT

**Value:** `"ptmono"`

**Description:** Monospaced font for code display (planned for promo-code verification).

### Character-Specific Fonts

#### TALKINGFONT

**Value:** `"talkingfont"`

**Description:** Default character dialogue font.

#### TALKINGFONT_WORMWOOD

**Value:** `"talkingfont_wormwood"`

**Description:** Special dialogue font for Wormwood character.

#### TALKINGFONT_TRADEIN

**Value:** `"talkingfont_tradein"`

**Description:** Dialogue font for trade-in related characters.

#### TALKINGFONT_HERMIT

**Value:** `"talkingfont_hermit"`

**Description:** Dialogue font for hermit characters.

### Chat and Communication

#### CHATFONT

**Value:** `"bellefair"`

**Description:** Font used for chat messages.

#### CHATFONT_OUTLINE

**Value:** `"bellefair_outline"`

**Description:** Outlined version of chat font for better readability.

#### HEADERFONT

**Value:** `"hammerhead"`

**Description:** Font used for section headers.

## Fallback Font System

### Fallback Font Constants

#### FALLBACK_FONT

**Value:** `"fallback_font"`

**Description:** Basic fallback font for missing glyphs.

#### FALLBACK_FONT_FULL

**Value:** `"fallback_font_full"`

**Description:** Full character set fallback font.

#### FALLBACK_FONT_OUTLINE

**Value:** `"fallback_font_outline"`

**Description:** Outlined fallback font.

#### FALLBACK_FONT_FULL_OUTLINE

**Value:** `"fallback_font_full_outline"`

**Description:** Full character set outlined fallback font.

### Fallback Tables

#### DEFAULT_FALLBACK_TABLE

**Configuration:**
```lua
DEFAULT_FALLBACK_TABLE = {
    CONTROLLERS,    -- Controller button glyphs
    EMOJIFONT,      -- Emoji support
    FALLBACK_FONT,  -- Basic fallback
    FALLBACK_FONT_FULL,  -- Extended fallback
}
```

**Description:** Standard fallback sequence for non-outlined fonts.

#### DEFAULT_FALLBACK_TABLE_OUTLINE

**Configuration:**
```lua
DEFAULT_FALLBACK_TABLE_OUTLINE = {
    CONTROLLERS,             -- Controller button glyphs
    EMOJIFONT,               -- Emoji support
    FALLBACK_FONT_OUTLINE,   -- Outlined fallback
    FALLBACK_FONT_FULL_OUTLINE,  -- Extended outlined fallback
}
```

**Description:** Fallback sequence for outlined fonts.

## Language Support

### Language-Specific Font Variants

The system supports language-specific font variants through the `font_posfix` system:

```lua
local font_posfix = ""

if LanguageTranslator then
    local lang = LanguageTranslator.defaultlang
    local specialFontLangs = {"jp"}
    
    for i,v in pairs(specialFontLangs) do
        if v == lang then
            font_posfix = "__"..lang
        end
    end
end
```

**Supported Languages:**
- **Japanese ("jp")**: Uses "__jp" suffix for specialized character support

**Example:**
- Default: `"fonts/opensans50.zip"`
- Japanese: `"fonts/opensans50__jp.zip"`

## FONTS Configuration Table

The `FONTS` table contains the complete font registry with detailed configurations:

```lua
FONTS = {
    {
        filename = "fonts/opensans50.zip",
        alias = DEFAULTFONT,
        fallback = DEFAULT_FALLBACK_TABLE_OUTLINE
    },
    {
        filename = "fonts/bellefair50.zip",
        alias = CHATFONT,
        fallback = DEFAULT_FALLBACK_TABLE
    },
    -- ... additional font configurations
}
```

### Font Configuration Structure

Each font entry contains:

#### filename

**Type:** `string`

**Description:** Path to the font file, including language suffix if applicable.

#### alias

**Type:** `string`

**Description:** Font constant name used for referencing the font in code.

#### fallback

**Type:** `table`

**Description:** Array of fallback fonts to use when glyphs are missing.

#### adjustadvance (optional)

**Type:** `number`

**Description:** Character spacing adjustment for the font.

**Example:**
```lua
{
    filename = "fonts/belisaplumilla50.zip",
    alias = UIFONT,
    fallback = DEFAULT_FALLBACK_TABLE_OUTLINE,
    adjustadvance = -2  -- Tighten character spacing
}
```

#### disable_color (optional)

**Type:** `boolean`

**Description:** Disables color rendering for special fonts like controllers and emoji.

## Font Categories

### Core UI Fonts

```lua
-- Essential fonts for game interface
{ filename = "fonts/opensans50.zip", alias = DEFAULTFONT, fallback = DEFAULT_FALLBACK_TABLE_OUTLINE },
{ filename = "fonts/belisaplumilla50.zip", alias = UIFONT, fallback = DEFAULT_FALLBACK_TABLE_OUTLINE, adjustadvance=-2 },
{ filename = "fonts/belisaplumilla100.zip", alias = TITLEFONT, fallback = DEFAULT_FALLBACK_TABLE_OUTLINE },
```

### Character Dialogue Fonts

```lua
-- Specialized fonts for character speech
{ filename = "fonts/talkingfont.zip", alias = TALKINGFONT, fallback = DEFAULT_FALLBACK_TABLE_OUTLINE },
{ filename = "fonts/talkingfont_wormwood.zip", alias = TALKINGFONT_WORMWOOD, fallback = DEFAULT_FALLBACK_TABLE_OUTLINE },
{ filename = "fonts/talkingfont_hermit.zip", alias = TALKINGFONT_HERMIT, fallback = DEFAULT_FALLBACK_TABLE_OUTLINE },
```

### Utility Fonts

```lua
-- Special purpose fonts
{ filename = "fonts/controllers.zip", alias = CONTROLLERS, disable_color = true },
{ filename = "fonts/emoji.zip", alias = EMOJIFONT, disable_color = true },
{ filename = "fonts/ptmono32.zip", alias = CODEFONT, fallback = DEFAULT_FALLBACK_TABLE },
```

### Fallback Fonts

```lua
-- Fallback fonts for missing glyphs
{ filename = "fonts/fallback.zip", alias = FALLBACK_FONT },
{ filename = "fonts/fallback_full_packed.zip", alias = FALLBACK_FONT_FULL },
{ filename = "fonts/fallback_outline.zip", alias = FALLBACK_FONT_OUTLINE },
{ filename = "fonts/fallback_full_outline_packed.zip", alias = FALLBACK_FONT_FULL_OUTLINE },
```

## Common Usage Patterns

### UI Text Creation

```lua
-- Create text widgets with appropriate fonts
local title = Text(TITLEFONT, 48, "Game Settings")
local description = Text(BODYTEXTFONT, 24, "Configure your game options")
local button_text = Text(BUTTONFONT, 32, "Apply Changes")
```

### Character Dialogue

```lua
-- Select appropriate dialogue font based on character
local font = TALKINGFONT
if character == "wormwood" then
    font = TALKINGFONT_WORMWOOD
elseif character == "hermit" then
    font = TALKINGFONT_HERMIT
end

local dialogue = Text(font, 28, character_line)
```

### Chat System Integration

```lua
-- Chat message with proper fallback support
local chat_text = Text(CHATFONT, 24, message)
if needs_outline then
    chat_text:SetFont(CHATFONT_OUTLINE)
end
```

### Language-Specific Font Loading

```lua
-- Font system automatically handles language variants
-- Japanese players automatically get "__jp" font variants
local ui_text = Text(UIFONT, 32, localized_string)
```

## Font Loading Process

1. **Language Detection**: System determines current language
2. **Font Suffix Application**: Adds language suffix to font filenames if needed
3. **Asset Registration**: Fonts are registered as game assets
4. **Loading**: Font files are loaded during game initialization
5. **Fallback Setup**: Fallback chains are established for missing glyphs
6. **Runtime Usage**: Fonts become available for UI text rendering

## Performance Considerations

### Memory Usage
- All registered fonts are loaded into memory
- Fallback fonts add to memory footprint
- Language variants duplicate font data

### Loading Time
- Font loading occurs during game startup
- Large font files can increase load times
- Multiple language variants affect startup performance

### Glyph Fallback
- Missing glyphs trigger fallback chain traversal
- Complex fallback chains can impact text rendering performance
- Emoji and controller fonts are frequently used fallbacks

## Related Modules

- [Font Helper](./fonthelper.md): Utility for adding font assets
- [Translator](./translator.md): Language detection and localization
- [Text Widgets](../widgets/text.md): UI text rendering components
- [Localization](./localization.md): Multi-language string management

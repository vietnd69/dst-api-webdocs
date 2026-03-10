---
id: fonts
title: Fonts
description: Central registry for game font configurations, mapping logical font names to physical font files and fallback sets.
tags: [ui, localization, assets]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 6230fad4
system_scope: ui
---

# Fonts

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`fonts.lua` defines the global font configuration system for Don't Starve Together. It establishes a mapping between logical font identifiers (e.g., `DEFAULTFONT`, `TITLEFONT`) and physical font asset files (`.zip` archives), along with fallback font sequences for multilingual and special-character support. This file is used during initialization to register fonts with the engine and is evaluated at both runtime and build time (e.g., by the localization pipeline). It has no component class or entity-level functionality—it serves as a top-level asset configuration module.

## Usage example
```lua
-- Example: Accessing configured font constants
local font_name = DEFAULTFONT  -- resolves to "opensans"
local fallbacks = DEFAULT_FALLBACK_TABLE  -- table of fallback font aliases
local font_entry = FONTS[1]  -- first entry: TALKINGFONT with outline fallbacks
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  
**External dependencies:** `translator` (loaded via `require "translator"`), `LanguageTranslator` (optional runtime module)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `DEFAULTFONT` | string | `"opensans"` | Logical name for the default game font. |
| `DIALOGFONT` | string | `"opensans"` | Alias for `DEFAULTFONT` (used in dialog contexts). |
| `TITLEFONT` | string | `"bp100"` | Logical name for title/ui header font. |
| `UIFONT` | string | `"bp50"` | Logical name for UI controls font. |
| `BUTTONFONT` | string | `"buttonfont"` | Logical name for button labels. |
| `NEWFONT` | string | `"spirequal"` | Logical name for the primary modern font. |
| `NEWFONT_SMALL` | string | `"spirequal_small"` | Small variant of `NEWFONT`. |
| `NEWFONT_OUTLINE` | string | `"spirequal_outline"` | Outlined variant of `NEWFONT`. |
| `NEWFONT_OUTLINE_SMALL` | string | `"spirequal_outline_small"` | Small outlined variant (unused). |
| `NUMBERFONT` | string | `"stint-ucr"` | Logical name for numeric display (legacy alias). |
| `TALKINGFONT` | string | `"talkingfont"` | Primary font for dialogue speech. |
| `TALKINGFONT_WORMWOOD` | string | `"talkingfont_wormwood"` | Wormwood-specific speech font. |
| `TALKINGFONT_TRADEIN` | string | `"talkingfont_tradein"` | Trade-in character speech font. |
| `TALKINGFONT_HERMIT` | string | `"talkingfont_hermit"` | Hermit-specific speech font. |
| `CHATFONT` | string | `"bellefair"` | Font used for chat messages. |
| `HEADERFONT` | string | `"hammerhead"` | Font for large headers. |
| `CHATFONT_OUTLINE` | string | `"bellefair_outline"` | Outlined variant for chat readability. |
| `SMALLNUMBERFONT` | string | `"stint-small"` | Font for small numeric displays. |
| `BODYTEXTFONT` | string | `"stint-ucr"` | Primary font for body text. |
| `CODEFONT` | string | `"ptmono"` | Font for code/monospaced text (reserved). |
| `CONTROLLERS` | string | `"controllers"` | Glyph font for controller icons. |
| `EMOJIFONT` | string | `"emoji"` | Glyph font for emoji rendering. |
| `FALLBACK_FONT` | string | `"fallback_font"` | Base fallback font for missing glyphs. |
| `FALLBACK_FONT_FULL` | string | `"fallback_font_full"` | Full fallback font (includes additional characters). |
| `FALLBACK_FONT_OUTLINE` | string | `"fallback_font_outline"` | Outlined base fallback. |
| `FALLBACK_FONT_FULL_OUTLINE` | string | `"fallback_font_full_outline"` | Outlined full fallback. |
| `DEFAULT_FALLBACK_TABLE` | table | `{CONTROLLERS, EMOJIFONT, FALLBACK_FONT, FALLBACK_FONT_FULL}` | Ordered fallback chain for standard (non-outline) fonts. |
| `DEFAULT_FALLBACK_TABLE_OUTLINE` | table | `{CONTROLLERS, EMOJIFONT, FALLBACK_FONT_OUTLINE, FALLBACK_FONT_FULL_OUTLINE}` | Ordered fallback chain for outline fonts. |
| `FONTS` | table of tables | — | Array of font definitions, each specifying `filename`, `alias`, optional `fallback` table, and optional `disable_color` or `adjustadvance` flags. |

## Main functions
None identified. This file defines only constants and table structures.

## Events & listeners
None identified. This file performs static configuration and does not register or dispatch events.
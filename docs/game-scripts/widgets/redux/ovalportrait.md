---
id: ovalportrait
title: OvalPortrait
description: A UI widget that renders a character's portrait, name, title, description, and optional event-specific data (e.g., Lava Arena stats and achievements) for character selection screens.
tags: [ui, character, portrait]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 8d3c46d4
system_scope: ui
---

# OvalPortrait

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`OvalPortrait` is a UI widget subclassed from `Widget`, designed to display a character’s visual identity in character selection contexts. It composites an oval portrait image, hero name texture, character title, and descriptive text, with conditional rendering of Lava Arena-specific data (health, items, difficulty, and achievements) when the current session is a Lava Arena event. It does not manage state persistence or network syncing; it is purely a visual rendering component for static or data-driven UI.

## Usage example
```lua
local OvalPortrait = require "widgets/redux/ovalportrait"
local my_portrait = OvalPortrait("waxwell", function(name) return GetCharacterDescription(name) end)
my_portrait:SetPosition(100, 100)
my_portrait:SetPortrait("waxwell")
```

## Dependencies & tags
**Components used:** None (does not use `inst.components.X` directly).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `portrait_root` | `Widget` | `nil` | Root widget containing all portrait sub-elements (child of `self`). |
| `heroportrait` | `Image` | `nil` | Image widget displaying the oval character portrait. |
| `heroname` | `Image` | `nil` | Image widget displaying the character's name texture. |
| `character_text` | `Widget` | `nil` | Container widget for title and description. |
| `charactertitle` | `Text` | `nil` | Text widget for the character’s title (gold-coloured). |
| `characterdetails` | `Text` | `nil` | Text widget for the character’s description (grey, wrapped). |
| `currentcharacter` | string | `nil` | Stores the identifier of the currently displayed character. |
| `description_getter_fn` | function | `GetCharacterDescription` | Function used to fetch the character description string. |
| `eventid` | string? | `nil` | Event identifier (e.g., `"lavaarena"`), set only if inside a Lava Arena session. |
| `achievements_root` | `Widget`? | `nil` | Container for achievement rows (Lava Arena only). |
| `la_health`, `la_difficulty`, `la_items` | `Text`? | `nil` | Text widgets for Lava Arena-specific stats. |
| `la_achievements` | table? | `nil` | Array of achievement subwidgets (`{image, name, desc}`) for Lava Arena. |

## Main functions
### `:SetPortrait(herocharacter)`
*   **Description:** Updates all portrait visuals (portrait image, name texture, title, description) and, if applicable in Lava Arena, populates health, items, difficulty, and achievement data for the specified character.
*   **Parameters:** `herocharacter` (string) — the character’s name identifier (e.g., `"waxwell"`, `"wx78"`). Must be a valid `STRINGS.CHARACTER_TITLES` key.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; calls `assert(herocharacter)` to ensure the argument is non-nil. silently skips optional UI updates (e.g., achievements, Lava Arena fields) if no data exists for the current context.

## Events & listeners
None identified.
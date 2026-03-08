---
id: characterprogress
title: Characterprogress
description: Renders a character's skin collection progress as a visual progress bar and percentage indicator in the character selection UI.
tags: [ui, inventory, progression]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 2beab933
system_scope: ui
---

# Characterprogress

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CharacterProgress` is a UI widget that visually displays a character's skin collection completion progress. It integrates with `CharacterButton` to show an icon, and renders a dynamic progress bar and text label indicating how many skins have been unlocked out of the total available for the selected character. It relies on `GetSkinCollectionCompletionForHero` from `characterutil.lua` and` skinsutils.lua` for data retrieval and supports display of Heirloom-tier bonuses via visual differentiation.

## Usage example
```lua
local CharacterProgress = require("widgets/redux/characterprogress")
local progress_widget = CharacterProgress(
    "wade", -- character name
    function() print("Portrait focused") end,
    function() print("Portrait clicked") end
)
self:AddChild(progress_widget)
progress_widget:SetCharacter("wade") -- refresh for another character
progress_widget:RefreshInventory()   -- update progress display manually
```

## Dependencies & tags
**Components used:** None (pure UI widget, no components attached to entities)  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `herocharacter` | string | `nil` | The name of the character whose skin progress is displayed. |
| `icon` | `CharacterButton` | `nil` | The clickable/focusable icon widget for the character. |
| `progress_root` | `Widget` | `nil` | Root container for the progress banner elements. |
| `progressbar` | `UIAnim` | `nil` | Animated progress bar widget. |
| `characterprogress` | `Text` | `nil` | Text widget displaying the completion percentage. |
| `show_heirloom_bonus` | boolean | `false` | Controls whether to display the Heirloom (platinum) visual variant. |

## Main functions
### `:RefreshInventory()`
* **Description:** Updates the progress bar and percentage text based on the current character's skin collection status. Adjusts visual style (gold vs platinum) based on `show_heirloom_bonus`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None — silently handles zero-total cases.

### `:SetCharacter(hero)`
* **Description:** Updates the widget to display progress for a different character, refreshing all UI elements accordingly.
* **Parameters:** `hero` (string) — the name of the new character to display progress for.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None
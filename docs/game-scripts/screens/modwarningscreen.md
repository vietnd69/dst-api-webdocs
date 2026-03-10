---
id: modwarningscreen
title: Modwarningscreen
description: Displays a modal warning screen for mod-related alerts with customizable title, body text, and action buttons.
tags: [ui, modal, mod]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 942d41f8
system_scope: ui
---

# Modwarningscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ModWarningScreen` is a UI screen that presents mod-related warnings to the player in a modal dialog. It is typically used to display critical messages about mod status (e.g., mods disabled, incompatibility warnings), and provides interactive options such as acknowledgment checkboxes and action buttons (e.g., "Back", "Mod Forums"). It inherits from `Screen` and manages its own visual hierarchy including background overlay, title, body text, optional additional text, version info, and focusable controls.

## Usage example
```lua
local ModWarningScreen = require "screens/modwarningscreen"
local screen = ModWarningScreen(
    "Mod Warning",
    "This mod may cause instability. Proceed with caution.",
    { "Back" },
    nil,  -- texthalign
    "Mod Name: ExampleMod v1.2.3",  -- additionaltext
    24, -- textsize
    true -- showdisable
)
TheFrontEnd:OpenScreen(screen)
```

## Dependencies & tags
**Components used:** `Profile` (via `Profile:GetModsWarning()`, `Profile:SetModsWarning()`, `Profile:Save()`), `TheInputProxy`, `APP_VERSION`, `PLATFORM`, `STRINGS.UI.MAINSCREEN.*` (localization keys).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | `Image` | — | Fullscreen dark overlay (alpha `.8`) to dim background. |
| `root` | `Widget` | — | Root container for dialog content, centered on screen. |
| `title` | `Text` | — | Large (50 pt) title text, positioned at `y = 170`. |
| `text` | `Text` | — | Main body text, wraps within `480×2 x 200` region, default font `BODYTEXTFONT`. |
| `additionaltext` | `Text` or `nil` | `nil` | Optional secondary text block, positioned above `text` (`y = -150`). |
| `version` | `Text` | — | Bottom-left version indicator (`Rev. <APP_VERSION> <PLATFORM>`). |
| `menu` | `Menu` or `nil` | `nil` | Horizontal button menu if `buttons` parameter provided. |
| `disablemodwarning` | `Widget` (LabelCheckbox) or `nil` | `nil` | Checkbox to disable future mod warnings; toggles `Profile.ModsWarning`. |
| `default_focus` | `Menu` or `nil` | `self.menu` | Initial focus target for keyboard navigation. |

## Main functions
No public methods beyond the constructor are defined in this screen class. All behavior is encapsulated during construction.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
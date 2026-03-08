---
id: characterbio
title: Characterbio
description: Renders the character biography UI panel, including portrait, status badges, inventory, and scrollable descriptive text sections for a selected character.
tags: [ui, character, rendering]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 995cb0bb
system_scope: ui
---

# Characterbio

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CharacterBio` is a UI widget responsible for displaying a character's bio screen in the Redux UI system. It constructs and arranges portrait graphics, status badges (health, hunger, sanity), starting inventory, and a scrollable text area containing title, description, and quote sections sourced from localization strings. It inherits from `Widget` and acts as a self-contained container for character information presentation during character selection or review.

## Usage example
```lua
local CharacterBio = require "widgets/redux/characterbio"
local bio_widget = CharacterBio("wolfgang")
-- bio_widget is now a fully constructed widget that can be added to a parent UI
```

## Dependencies & tags
**Components used:** None (pure UI widget, no game component interaction)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `portrait_root` | Widget | `nil` | Container widget holding the character portrait, name, and status/inventory badges. |
| `text_root` | Widget | `nil` | Container widget for the bio text layout and scroll area. |
| `portrait` | Image | `nil` | Oval-shaped character portrait image. |
| `charactername` | Image | `nil` | Gold-text character name image; hidden on failure. |
| `health_status` | Widget | `nil` | Health status badge (via `TEMPLATES.MakeUIStatusBadge`). |
| `hunger_status` | Widget | `nil` | Hunger status badge. |
| `sanity_status` | Widget | `nil` | Sanity status badge. |
| `inv` | Widget | `nil` | Starting inventory display widget. |
| `scroll_area` | TrueScrollArea | `nil` | Scrollable container for the bio text sections. |
| `focus_forward` | Widget | `scroll_area` | Enables focus navigation forwarding to the scroll area. |

## Main functions
### `_BuildPortraitWidgets(character)`
*   **Description:** Constructs and returns a widget containing the character's portrait, name, status badges, and inventory widgets.
*   **Parameters:** `character` (string) — character prefabricated name used to look up textures and data.
*   **Returns:** `Widget` — root container for all portrait-related UI elements.
*   **Error states:** If `SetHeroNameTexture_Gold` fails to set the name texture, `charactername` is hidden.

### `_BuildBioText(character)`
*   **Description:** Constructs and returns a scrollable text widget containing the character's bio data split into sections (title, about me, description, quote).
*   **Parameters:** `character` (string) — character prefabricated name used to fetch localized strings.
*   **Returns:** `Widget` — root container with scrollable text area.
*   **Error states:** Text sections are rendered regardless of content availability; empty or missing localized strings produce blank sections.

## Events & listeners
None identified.
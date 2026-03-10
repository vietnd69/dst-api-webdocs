---
id: playerinfopopupscreen
title: Playerinfopopupscreen
description: Displays a player-specific information screen with tabbed content (player avatar and skill tree) in Don't Starve Together.
tags: [ui, player, screen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: cb1d37f9
system_scope: ui
---

# Playerinfopopupscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PlayerInfoPopup` is a screen component that presents player-specific information in a tabbed interface. It supports two primary views: a player avatar panel (via `PlayerAvatarPopup`) and a skill tree panel (via `SkillTreeWidget`). It dynamically selects the content based on the player's character (e.g., default Wilson, modded characters, or no selection), and manages screen-level camera offset, pausing, and input handling. It interacts with `PlayerAvatarData` to fetch player profile data and integrates with the front-end UI system (`TheFrontEnd`, `TheCamera`, `TheInput`).

## Usage example
```lua
local screen = PlayerInfoPopup(owner, player_name, data, show_net_profile, force)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `playeravatardata` (via `GetData`)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `MakeTopPanel()`
*   **Description:** Constructs the top panel with background and title text. Sets the title’s color based on whether `self.data.colour` is present.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `MakeBG()`
*   **Description:** Adds background images (main backdrop and scratch overlay) to the popup content area.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `MakeTabs()`
*   **Description:** Creates two tab buttons: one for the player avatar panel and one for the skill tree panel. Buttons toggle between the views by calling `MakePlayerAvatarPopup()` or `MakeSkillTree()` on click.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDisplayName(player_name, character)`
*   **Description:** Returns the display name string (currently just `player_name` or empty string). Intended for future localization/customization.
*   **Parameters:** `player_name` (string), `character` (string) — unused in current implementation.
*   **Returns:** string — the name to display.

### `UpdateDisplayName()`
*   **Description:** Updates the title text in the top panel with a truncated, multiline-formatted display name.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ResolveCharacter(data)`
*   **Description:** Determines the active character based on `data`, returning special identifiers (`"notselected"` for empty prefab, `"unknownmod"` for missing assets) or the resolved character prefab name.
*   **Parameters:** `data` (table) — player data table with `prefab`/`character` keys.
*   **Returns:** string — resolved character identifier.

### `MakeSkillTree()`
*   **Description:** Replaces the current view with the skill tree widget. Hides the avatar popup if active, disables the skill tree tab, and enables the avatar tab.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `MakePlayerAvatarPopup()`
*   **Description:** Replaces the current view with the player avatar popup. Hides the skill tree if active, disables the avatar tab, and enables the skill tree tab.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnDestroy()`
*   **Description:** Cleans up screen state: restores camera offset, resumes unpause, and signals popup closure via `POPUPS.PLAYERINFO:Close`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles controller and keyboard input to switch tabs (L2/R2), or close the screen (MAP or CANCEL buttons).
*   **Parameters:** `control` (number) — control code, `down` (boolean) — key press state.
*   **Returns:** boolean — `true` if the event was handled.

### `GetHelpText()`
*   **Description:** Returns localized help text summarizing controller/input bindings (tab switching and back/cancel).
*   **Parameters:** None.
*   **Returns:** string — formatted help message.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
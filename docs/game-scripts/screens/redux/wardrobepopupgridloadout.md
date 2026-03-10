---
id: wardrobepopupgridloadout
title: Wardrobepopupgridloadout
description: Manages the UI screen for selecting and applying character skins via a grid-style loadout interface in DST's Redux UI system.
tags: [ui, skins, loadout]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 5e1f90d6
system_scope: ui
---

# Wardrobepopupgridloadout

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`GridWardrobePopupScreen` is a screen component that presents a skin selection interface for characters, allowing players to customize appearance (base skin, body, hands, legs, feet) using a Redux-style UI. It integrates with the `LoadoutSelect` widget to display skin spinners and manages persistence via a `profile` component. The screen handles controller and keyboard input, applies final skin selections on close, and ensures proper cleanup or rollback (via `Reset`) when cancelled.

## Usage example
```lua
-- Typically instantiated internally by DST when opening the wardrobe from a popup or menu.
-- Example of how it might be created (not usually done manually by mods):
local screen = GridWardrobePopupScreen(ThePlayer, character_profile, { "BASE_SKIN" }, { "character_base_skin_id" })
TheFrontEnd:AddScreen(screen)
```

## Dependencies & tags
**Components used:** None (no `inst.components.X` usage).
**Tags:** Adds `owned_by_wardrobe = true` implicitly on screens spawned *from* this screen (handled externally in `POPUPS.WARDROBE:Close()` and screen-popping logic).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner_player` | entity | `nil` | The player entity whose skins are being edited. |
| `profile` | table | `nil` | Profile object providing access to saved skin data for characters. |
| `initial_skins` | table | `{}` | Skin IDs stored at screen init, before any changes. |
| `previous_default_skins` | table | `{}` | Original skin IDs associated with `owner_player.prefab` before this session. |
| `loadout` | LoadoutSelect widget | `nil` | Widget that presents skin selection spinners. |
| `menu` | Menu widget | `nil` | Contains Cancel/OK buttons. |
| `proot`, `root` | Widget | — | Root UI containers. |
| `default_focus` | widget | `self.loadout` | Widget that receives initial focus. |

## Main functions
### `Close()`
* **Description:** Confirms and applies selected skins, validates ownership, and closes the screen. Sends final skin data to `POPUPS.WARDROBE:Close()` for further processing (e.g., saving, network sync).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Resets skin fields to safe defaults (e.g., `character_none`, `""`) if invalid or unowned.

### `Cancel()`
* **Description:** Resets the current selection to `initial_skins`, then closes the screen.
* **Parameters:** None.
* **Returns:** Nothing.

### `Reset()`
* **Description:** Restores `loadout.selected_skins` to `initial_skins`, discarding any unsaved changes.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetTimestamp()`
* **Description:** Scans current inventory for the newest `modified_time` to use as a collection version/timestamp.
* **Parameters:** None.
* **Returns:** `number` — highest `modified_time` among inventory items, or `0` if none found.

### `OnControl(control, down)`
* **Description:** Handles input events (Cancel/MenuStart) for keyboard and controller.
* **Parameters:**  
  `control` (string) — control identifier (e.g., `"CANCEL"`, `"MENU_START"`).  
  `down` (boolean) — whether key was pressed (`true`) or released (`false`).  
* **Returns:** `boolean` — `true` if event was handled; `false` otherwise.

### `OnUpdate(dt)`
* **Description:** Forwards updates to `self.loadout` to ensure animations and internal timing are updated every frame.
* **Parameters:** `dt` (number) — time elapsed since last frame.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Called when screen becomes active. Ensures sub-screens (e.g., skin pages) refresh their inventory state.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnDestroy()`
* **Description:** Handles cleanup on screen dismissal: restores original default skins, unpause game, pops Wardrobe-owned screens, and offsets camera back.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns localized help text for current input mode (keyboard/controller).
* **Parameters:** None.
* **Returns:** `string` — formatted help text (e.g., `"ESC Cancel  ENTER Set"`).

### `OffsetServerPausedWidget(serverpausewidget)`
* **Description:** Adjusts position of the server pause indicator relative to this screen's offset.
* **Parameters:** `serverpausewidget` (widget) — The pause indicator widget to reposition.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).

> Note: Screen lifecycle and focus behavior are managed by the `Screen` base class and `TheFrontEnd` system (e.g., `OnBecomeActive`, `OnDestroy`, focus navigation), not custom event listeners.
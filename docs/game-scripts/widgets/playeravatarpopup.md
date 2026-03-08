---
id: playeravatarpopup
title: Playeravatarpopup
description: Displays a UI popup window showing player avatar information including character portrait, equipment, and skins for a specified player.
tags: [ui, player, avatar]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 44c7425f
system_scope: ui
---

# Playeravatarpopup

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PlayerAvatarPopup` is a UI widget that renders a detailed popup panel displaying a player's avatar, character details, equipped items, and skins. It dynamically constructs its UI based on player data and supports dynamic updates and auto-close behavior when the player moves too far from the target or controls are disabled. It depends on `PlayerController:IsEnabled()` to determine when to close and uses `EquipSlot` utilities for equipment slot handling.

## Usage example
```lua
local popup = PlayerAvatarPopup(owner, player_name, data, show_net_profile)
popup:SetPlayer(player_name, data, show_net_profile)
-- The popup automatically updates and closes based on game conditions
```

## Dependencies & tags
**Components used:** `playercontroller`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The entity that owns/hosts this popup. |
| `player_name` | string | `nil` | Display name of the target player. |
| `userid` | string/number | `nil` | Unique identifier of the target user. |
| `target` | Entity | `nil` | The target entity instance (if available). |
| `anchorpos` | Vector3 | `nil` | Saved screen position for anchoring the popup. |
| `anchortime` | number | `0` / `-.3` | Timer used to track movement and decide auto-close timing. |
| `targetmovetime` | number | `.5` (controller) or `.75` (keyboard/mouse) | Duration of continuous movement before auto-closing. |
| `started` | boolean | `true` | Whether the popup has started and is active. |
| `settled` | boolean | `true` | State flag (unused in current implementation). |
| `time_to_refresh` | number | `REFRESH_INTERVAL` (`.5`) | Timer for periodic data refresh. |
| `currentcharacter` | string | `"wilson"` | Resolved character prefab name. |
| `data` | table | `nil` | Raw player data including skins, equipment, and profile info. |
| `proot`, `sroot` | Widget | `nil` | Root UI containers for popup layout. |

## Main functions
### `GetDisplayName(player_name, character)`
*   **Description:** Returns the display name for the player; provided for easy mod overriding.
*   **Parameters:**  
    * `player_name` (string or `nil`) — Raw player name.  
    * `character` (string or `nil`) — Character prefab.  
*   **Returns:** string — The resolved display name (by default, `player_name` or `""`).

### `UpdateDisplayName()`
*   **Description:** Updates the title text widget with the truncated display name.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `ResolveCharacter(data)`
*   **Description:** Resolves the character prefab from player data, handling special cases (empty, missing mod, etc.).  
*   **Parameters:**  
    * `data` (table) — Player data object with `prefab` or `character` keys.  
*   **Returns:** string — `"notselected"`, `"unknownmod"`, or the resolved character prefab.

### `SetPlayer(player_name, data, show_net_profile)`
*   **Description:** Sets or updates the popup’s target player data and re-layouts the UI.  
*   **Parameters:**  
    * `player_name` (string) — Player name.  
    * `data` (table) — Player profile data (see `Layout()` for required fields).  
    * `show_net_profile` (boolean) — Whether to show the network profile button. Ignored if using a controller.  
*   **Returns:** Nothing.

### `Layout(data, show_net_profile)`
*   **Description:** Constructs the entire UI layout for the popup based on player data. Handles two main cases: valid character selection vs. “not selected” or unknown state.  
*   **Parameters:**  
    * `data` (table) — Player data containing `prefab`, `character`, `colour`, `body_skin`, `hand_skin`, `legs_skin`, `feet_skin`, `base_skin`, `equip`, `playerage`, `userid`, `netid`.  
    * `show_net_profile` (boolean) — Flag to conditionally show the NetProfile button (disabled on controllers).  
*   **Returns:** Nothing.

### `UpdateData(data)`
*   **Description:** Updates the visible UI elements (skins, equipment, portrait, age, etc.) with new player data without re-layouting.  
*   **Parameters:**  
    * `data` (table) — Updated player profile data.  
*   **Returns:** Nothing.

### `SetTitleTextSize(size)`
*   **Description:** Sets the font size of the title text widget.  
*   **Parameters:**  
    * `size` (number) — Desired font size.  
*   **Returns:** Nothing.

### `SetButtonTextSize(size)`
*   **Description:** Sets the font size of the menu buttons (not directly used in current layout).  
*   **Parameters:**  
    * `size` (number) — Desired font size.  
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles UI control input. Delegates to the base Widget implementation.  
*   **Parameters:**  
    * `control` (CONTROL enum) — Input control.  
    * `down` (boolean) — Whether the control is pressed.  
*   **Returns:** boolean — `true` if handled by base, otherwise `nil`.

### `OnUpdate(dt)`
*   **Description:** Main update loop for auto-closing and periodic data refresh. Checks if controls are enabled, target is near and valid, and refreshes data periodically for remote users.  
*   **Parameters:**  
    * `dt` (number) — Delta time since last frame.  
*   **Returns:** Nothing. Calls `Close()` and returns early under several conditions.

### `CreateSkinWidgetForSlot()`
*   **Description:** Creates a reusable UI widget group for displaying skin names and preview images.  
*   **Parameters:** None.  
*   **Returns:** Widget — A group containing `_text`, `_shadow`, and `_image` sub-widgets.

### `UpdateSkinWidgetForSlot(image_group, slot, skin_name)`
*   **Description:** Updates a skin widget to reflect a specific skin for a given slot (`body`, `hand`, `legs`, `feet`).  
*   **Parameters:**  
    * `image_group` (Widget) — Pre-created skin widget group.  
    * `slot` (string) — Slot identifier.  
    * `skin_name` (string) — Skin name or `"none"`.  
*   **Returns:** Nothing.

### `CreateEquipWidgetForSlot()`
*   **Description:** Creates a reusable UI widget group for displaying equipped item names and icons.  
*   **Parameters:** None.  
*   **Returns:** Widget — A group containing `_text`, `_shadow`, and `_image` sub-widgets.

### `UpdateEquipWidgetForSlot(image_group, slot, equipdata)`
*   **Description:** Updates an equipment widget to reflect the equipped item in the specified slot (`HEAD`, `HANDS`, `BODY`).  
*   **Parameters:**  
    * `image_group` (Widget) — Pre-created equipment widget group.  
    * `slot` (EQUIPSLOTS enum) — Equipment slot identifier.  
    * `equipdata` (table or `nil`) — Equipment map keyed by `EquipSlot.ToID(slot)`.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls found in source).
- **Pushes:** None (no `inst:PushEvent` calls found in source).
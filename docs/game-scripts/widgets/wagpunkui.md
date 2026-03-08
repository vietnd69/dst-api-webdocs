---
id: wagpunkui
title: Wagpunkui
description: Manages the visual UI and HUD elements for the Wagpunk hat's targeting and level progression system in Don't Starve Together.
tags: [ui, hat, combat, targeting]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 73bd0be3
system_scope: ui
---

# Wagpunkui

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WagpunkUI` is a UI widget component responsible for rendering the visual feedback and overlay elements associated with the Wagpunk hat. It manages target tracking crosshairs, distance meter animations, HUD level progression visuals, and synchronization effects. It operates as a child widget of the owner entity and reacts to game events such as equipping/unequipping the hat, changing target, updating hat level, or syncing with the hat.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wagpunkui")  -- Automatically instantiated via prefabs using the Wagpunk hat
inst.components.wagpunkui:SetHat(some_hat_entity)
inst.components.wagpunkui:SetTarget(some_target_entity)
inst.components.wagpunkui:ChangeLevel({ level = 3 })
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity (typically the player) that owns this UI component. |
| `target` | `Entity?` | `nil` | The currently tracked target entity. |
| `hat` | `Entity?` | `nil` | The Wagpunk hat entity currently equipped. |
| `level` | number | `0` | Current Wagpunk level (0 to 5). |
| `overlay` | `Widget` | `wagpunkui_overlay` instance | HUD background/level indicator overlay widget. |
| `crosshair` | `Widget` | `wagpunkui_crosshair` instance | Targeting reticle displayed over the target. |
| `crosshairDist` | `Widget` | `wagpunkui_crosshair` instance | Distance meter reticle shown alongside target. |
| `synch` | `Widget` | `wagpunkui_crosshair` instance | Sync indicator shown during synchronization animation (scaled 0.5). |
| `distmeter` | `Widget` | `wagpunkui_distmeter` instance | Distance meter widget positioned on screen. |

## Main functions
### `SetTarget(target)`
*   **Description:** Sets the target entity to track. Begins playing distance and target animations, starts updating the widget per frame, and prepares UI elements for rendering. Clears them if target is `nil`.
*   **Parameters:** `target` (`Entity?`) — The entity to track, or `nil` to stop tracking.
*   **Returns:** Nothing.

### `ShowSynch(hat)`
*   **Description:** Plays the synchronization animation on the `synch` widget if the provided hat matches the currently tracked `self.hat`.
*   **Parameters:** `hat` (`Entity`) — The hat entity to verify and animate.
*   **Returns:** Nothing.

### `OnUnequip()`
*   **Description:** Checks if the currently tracked hat is no longer equipped by the player and triggers `HatRemoved` if so. Called on the `unequip` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEquip()`
*   **Description:** Same logic as `OnUnequip` — verifies the hat's state on equip and removes UI if the hat is no longer equipped. Called on the `equip` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetHat(hat)`
*   **Description:** Assigns the given hat as the current hat and displays the initial UI overlay with the `hud_0_to_1` → `hud1` animation.
*   **Parameters:** `hat` (`Entity`) — The Wagpunk hat entity to associate.
*   **Returns:** Nothing.

### `HatRemoved(hat)`
*   **Description:** Cleans up all UI elements if the given hat matches `self.hat`. Hides overlays and widgets, resets internal state, and cancels tracking.
*   **Parameters:** `hat` (`Entity`) — The hat entity that was removed.
*   **Returns:** Nothing.

### `ChangeLevel(data)`
*   **Description:** Updates the UI overlay and crosshair animations to reflect the new Wagpunk level. Supports both level-up and level-down transitions with appropriate animation chains.
*   **Parameters:** `data` (table) — Must contain `level` (number) — the new Wagpunk level (0–5).
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Runs every frame when a target is active. Updates screen position of the crosshairs based on target world position and distance. Plays audio feedback when distance changes. Updates the distance meter percentage. Hides elements if no valid target exists.
*   **Parameters:** `dt` (number) — Delta time since last frame.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `wagpunkui_targetupdate` — Updates the target via `SetTarget`.  
  - `wagpunkui_worn` — Sets the hat via `SetHat`.  
  - `wagpunkui_removed` — Calls `HatRemoved` on hat removal.  
  - `wagpunk_changelevel` — Calls `ChangeLevel` with level data.  
  - `wagpunkui_synch` — Calls `ShowSynch` to show sync animation.  
  - `unequip` — Calls `OnUnequip` to validate and reset UI.  
  - `equip` — Calls `OnEquip` to validate and reset UI.  
  - `animover` — On `synch` and `crosshairDist` widgets, to hide themselves after specific animations complete.

- **Pushes:** None identified.
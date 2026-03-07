---
id: moonrockseed
title: Moonrockseed
description: A handheld celestial orb that provides ambient light and can be upgraded; serves as a prototype device that activates when turned on and interacts with containers and inventory systems.
tags: [inventory, light, prototype, celestial]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3fd17329
system_scope: inventory
---

# Moonrockseed

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moonrockseed` is a prefab that represents a portable, upgradeable light source (celestial orb) in DST. It integrates with the `inventoryitem`, `prototyper`, and `container` systems to manage its behavior when held, dropped, stored in containers, or activated. It dynamically adjusts its light radius and intensity based on state transitions (`onturnon`, `onturnoff`, `onactivate`) and supports visual and audio feedback (e.g., blinking, idle sounds, drop sounds). The component is network-aware and includes save/load support for persistence across sessions.

## Usage example
```lua
-- Typical usage in a prefab definition (already provided as `moonrockseed` prefab)
-- Within a custom mod, you could spawn and configure it like:
local orb = SpawnPrefab("moonrockseed")
orb.components.prototyper.on = true
orb:PushEvent("turnon") -- triggers onturnon
orb:DoUpgrade() -- upgrades the prototyper trees
```

## Dependencies & tags
**Components used:** `inventoryitem`, `prototyper`, `inspectable`  
**Tags added:** `irreplaceable`, `nonpotatable`, `celestial_station`  
**Tags checked:** `INLIMBO`, `CLASSIFIED` (on icon prefab)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_light` | number | `0` | Current light intensity (0.0 to 1.0), interpolated over time during fade transitions. |
| `_targetlight` | number | `0` | Desired light intensity; used as the fade target in `fadelight`. |
| `_owner` | entity or nil | `nil` | The grand owner of the item when stored; used to parent the minimap icon. |
| `_container` | entity or nil | `nil` | Reference to the container (e.g., inventory) storing the item; used to listen for `onputininventory`, `ondropped`, `onremove`. |
| `_upgraded` | boolean | `false` | Whether the orb has been upgraded (affects prototyper trees). |
| `_tasks` | table | `{}` | Table of task IDs for scheduled drop sounds. |
| `_blinktask` | task or nil | `nil` | Periodic task handle for the blinking animation. |
| `icon` | entity or nil | `nil` | The minimap icon entity (`moonrockseed_icon` prefab). |

## Main functions
### `DoUpgrade()`
*   **Description:** Upgrades the orb, setting the `moonrockseed._upgraded` flag and updating the `prototyper.trees` to `TUNING.PROTOTYPER_TREES.MOONORB_UPGRADED`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `fadelight(inst, target, instant)`
*   **Description:** Initiates or completes a light intensity fade to `target`. If `instant` is true, sets the light immediately; otherwise, starts a periodic task to smoothly interpolate toward the target.
*   **Parameters:**  
    `target` (number) — the target light intensity (typically `0` or `0.15`).  
    `instant` (boolean) — if `true`, bypass interpolation and set light immediately.
*   **Returns:** Nothing.

### `onturnon(inst)`
*   **Description:** Called when the orb is activated (turned on). Cancels pending drop sounds, plays proximity animations (`proximity_pre` then `proximity_loop` loop), enables light if upgraded, fades to `0.15` intensity, and starts idle sound.
*   **Parameters:** `inst` — the moonrockseed instance.
*   **Returns:** Nothing.

### `onturnoff(inst)`
*   **Description:** Called when the orb is turned off. Cancels drop sounds, kills idle sound, disables light. If not held, plays `proximity_pst` and idle animations with fade-out and re-schedules drop sounds; otherwise plays idle animation with instant fade to `0`.
*   **Parameters:** `inst` — the moonrockseed instance.
*   **Returns:** Nothing.

### `onactivate(inst)`
*   **Description:** Triggers when the orb is first activated (e.g., via prototyper UI). Plays blinking animation, active sound, and pushes the `moonrockseed._fx` network event for visual effect.
*   **Parameters:** `inst` — the moonrockseed instance.
*   **Returns:** Nothing.

### `topocket(inst, owner)`
*   **Description:** Prepares the orb for storage in a container or inventory: cancels blinking, turns off light, and updates container ownership tracking.
*   **Parameters:** `owner` (entity) — the container or inventory entity storing the item.
*   **Returns:** Nothing.

### `toground(inst)`
*   **Description:** Prepares the orb for being dropped on the ground: re-enables light if active, and removes container tracking.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpgrade(inst)`
*   **Description:** (Note: alias for `DoUpgrade`; listed as `inst.DoUpgrade` on the instance) Handles upgrade logic and persists state via save/load hooks.
*   **Parameters:** None (method called on `inst`).
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves the `_upgraded` state to the provided `data` table for persistence.
*   **Parameters:**  
    `inst` — the moonrockseed instance.  
    `data` (table) — the save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores the `_upgraded` state from save data if present and calls `DoUpgrade` to reapply upgrades.
*   **Parameters:**  
    `inst` — the moonrockseed instance.  
    `data` (table or nil) — the loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    `moonrockseed._fx` — triggers `OnFX` (client-side only) to spawn visual effect entity.  
    `turnon`, `turnoff`, `activate` — handled by `prototyper` callbacks (`onturnon`, `onturnoff`, `onactivate`).  
    `onputininventory` — triggers `topocket`.  
    `ondropped` — triggers `toground` and `ondropped` (disables light).  
    Container events: `onputininventory`, `ondropped`, `onremove` — managed in `storeincontainer`/`unstore` via `_oncontainerownerchanged` and `_oncontainerremoved`.  
    `animover` — on FX entity to remove itself after animation.
- **Pushes:**  
    `moonrockseed._fx` — via `inst._fx:push()` to trigger client-side FX event.  
    Inventory and prototyper events are pushed by their respective components, not directly by this prefab code.

## Notes
- Light radius is calculated as `UPGRADED_LIGHT_RADIUS * _light / _targetlight`; `UPGRADED_LIGHT_RADIUS = 2.5`.
- Blinking is implemented via an easing function (`easing.outQuad`) and a periodic task updating the add-color alpha channel.
- Drop sounds are scheduled on spawn and after turning off when on the ground (using `scheduledropsounds`), and canceled when picked up or turned on.
- The minimap icon (`moonrockseed_icon`) is spawned as a child and tracks the parent entity for visibility on the map.
- The orb is marked as `INLIMBO`-aware for FX spawning to avoid creating FX in invalid contexts.
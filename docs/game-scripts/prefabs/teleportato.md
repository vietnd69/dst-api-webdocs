---
id: teleportato
title: Teleportato
description: Manages the Teleportato structure, handling its activation, part collection, power-up sequence, and level transition in DST.
tags: [crafting, inventory, ui, network, world]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 22b3f821
system_scope: crafting
---

# Teleportato

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `teleportato` prefab implements the full lifecycle of the Teleportato structure — from a partially assembled device to a fully powered gateway for level transitions. It manages part collection (via `trader`), state tracking (`collectedParts`), visual feedback (via `AnimState`), and orchestrates transitions to subsequent game instances. It relies on several components: `activatable` for player interaction, `container` for inventory handling, `inspectable` for status reporting, `playerprox` for auto-closing when the player leaves, and `trader` for accepting parts.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("teleportato")
inst:AddComponent("teleportato")
-- Note: teleportato is a full prefab, not a reusable component.
-- In practice, it is instantiated via Prefab("teleportato_base", fn, assets, prefabs)
-- and registered in the prefabs table of worldgen or level setup.
```

## Dependencies & tags
**Components used:** `inspectable`, `activatable`, `container`, `playerprox`, `trader`
**Tags:** Adds `teleportato`, `trader`; checks `rodbase` for lock state during `GetStatus`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `collectedParts` | table | `{teleportato_ring=false, teleportato_crank=false, teleportato_box=false, teleportato_potato=false}` | Tracks which of the four required parts have been collected. |
| `activatedonce` | boolean | `nil` | Set to `true` after the first activation animation plays. |
| `travel_action_fn` | function | `nil` | Stores the callback (`CheckNextLevelSure`) to execute when ready to travel. |
| `teleportpos` | Vector3 or `nil` | `nil` | Position to which the player should be teleported (used in adventure mode). |
| `action` | string | `"survival"` | Mode of behavior (`"survival"`, `"restart"`, or `"adventure"`). |
| `maxwell` | boolean | `nil` | Flag indicating whether Maxwell is present (used in adventure mode). |

## Main functions
### `OnActivate(inst, doer)`
*   **Description:** Handles player activation of the Teleportato. Plays activation animation and sound, then schedules transition (survival) or opens container (adventure), based on game mode and state. Only triggers once per instance (`activatedonce`).
*   **Parameters:**  
    `inst` (Entity) — the Teleportato entity.  
    `doer` (Entity) — the player activating the Teleportato.
*   **Returns:** Nothing.
*   **Error states:** Has no effect if `activatedonce` is already `true`.

### `CheckNextLevelSure(inst, doer)`
*   **Description:** Displays a confirmation dialog before teleporting. Pauses the game, shows a `PopupDialogScreen`, and schedules `TransitionToNextLevel` on confirmation. Otherwise, deactivates the Teleportato.
*   **Parameters:**  
    `inst` (Entity) — the Teleportato entity.  
    `doer` (Entity) — the player triggering the action.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns the Teleportato's status string (`"ACTIVE"`, `"PARTIAL"`, or implicitly `nil`/`"INACTIVE"`), used by the inspect UI.
*   **Parameters:** `inst` (Entity) — the Teleportato entity.
*   **Returns:**  
    `"ACTIVE"` if all 4 parts collected.  
    `"PARTIAL"` if at least one part collected.  
    `nil` otherwise.
*   **Error states:** Does not return `"LOCKED"`; that branch is commented out.

### `ItemTradeTest(inst, item)`
*   **Description:** Determines whether a given item can be traded to the Teleportato (only `teleportato_part` items are accepted).
*   **Parameters:**  
    `inst` (Entity) — the Teleportato entity.  
    `item` (Entity) — the item being offered.
*   **Returns:** `true` if `item` has tag `"teleportato_part"`, otherwise `false`.

### `PowerUp(inst)`
*   **Description:** Transitions the Teleportato to its fully powered state: plays `power_on`/`idle_on` animations, sets `inactive`, and schedules the travel action callback.
*   **Parameters:** `inst` (Entity) — the Teleportato entity.
*   **Returns:** Nothing.

### `TestForPowerUp(inst)`
*   **Description:** Checks if all parts are collected. If so, disables the `trader`, reveals all parts visually, and either triggers `PowerUp` directly (if no lock exists on `rodbase`) or waits for an `"ready"` event (in adventure mode).
*   **Parameters:** `inst` (Entity) — the Teleportato entity.
*   **Returns:** Nothing.

### `ItemGet(inst, giver, item)`
*   **Description:** Called on successful part trade. Updates `collectedParts`, plays sound, and invokes `TestForPowerUp`.
*   **Parameters:**  
    `inst` (Entity) — the Teleportato entity.  
    `giver` (Entity) — the player giving the part.  
    `item` (Entity) — the part entity.
*   **Returns:** Nothing.

### `MakeComplete(inst)`
*   **Description:** Utility function to force-set all parts as collected. Used on reload when save data indicates full assembly.
*   **Parameters:** `inst` (Entity) — the Teleportato entity.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes Teleportato state for persistence: `collectedParts`, `action`, `maxwell`, and `teleportpos` (if present).
*   **Parameters:**  
    `inst` (Entity) — the Teleportato entity.  
    `data` (table) — the save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores Teleportato state from save data: `collectedParts`, `action`, `maxwell`, `teleportpos`. If `data.makecomplete == 1`, forces all parts collected.
*   **Parameters:**  
    `inst` (Entity) — the Teleportato entity.  
    `data` (table) — the loaded save data.
*   **Returns:** Nothing.

### `OnPlayerFar(inst)`
*   **Description:** Auto-closes the container when the player moves out of proximity.
*   **Parameters:** `inst` (Entity) — the Teleportato entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    `"powerup"` — triggers `PowerUp` in adventure mode when `rodbase` becomes ready (and is locked).  
    `"ready"` — indirect via `rodbase:PushEvent("ready")` when unlocked (see `TestForPowerUp`).
- **Pushes:**  
    None directly (event observers are defined in `container`, `inspectable`, etc., but not in this file).
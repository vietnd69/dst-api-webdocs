---
id: carnival_cannons
title: Carnival Cannons
description: A decorative and interactive prop used in Carnival events that fires visual FX when activated or supplied with a game token, and resets into a cooldown state.
tags: [event, decoration, interact, firework]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: aa8acdd4
system_scope: entity
---

# Carnival Cannons

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `carnival_cannons` file defines prefabs for decorative carnival cannons used in the Carnival event. These cannons support two activation paths: direct player interaction (`OnActivate`) and item-based trading via `carnival_gametoken`. Upon activation, they play a shooting animation, spawn a particle effect (`confetti`, `sparkle`, or `streamer`), enter a cooldown state, and optionally trigger a chained cannon if present. They also support inspection status display, work (hammer) interaction, and loot drop.

The prefabs are defined as three variants: `carnivalcannon_confetti`, `carnivalcannon_sparkle`, and `carnivalcannon_streamer`, each differing only in visual FX type.

## Usage example
```lua
-- Example of manually firing a cannon instance
local cannon = Prefab("carnivalcannon_confetti")
cannon.components.activatable:OnActivate(cannon, player)

-- Or trigger via token trade
local item = CreateEntity()
item:AddTag("item")
item.prefab = "carnival_gametoken"
cannon.components.trader.onaccept(cannon, item)

-- Cannon cooldown resets automatically after 4 seconds via Enable()
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `carnivaldecor`, `trader`, `workable`, `activatable`, `burnable`, `propagator`  
**Tags added:** `carnivaldecor`, `carnivalcannon`, `structure`, `cattoy`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `def` | table | `nil` (set on master) | Stores cannon variant metadata (`bank`, `build`, `fx`) for FX spawning and setup. Set after `TheWorld.ismastersim` check. |
| `_lastchaintime` | number | `nil` | Timestamp of last chain activation (set during chain firing). |

## Main functions
### `FireCannon(inst, chain)`
*   **Description:** Initiates the cannon firing sequence: sets active, plays "shoot" then "cooldown" animation, spawns FX after 10 frames, and enables cooldown after 4 seconds. If `chain` is true, schedules a chain-reaction trigger for the nearest inactive cannon within 4 units.
*   **Parameters:**  
    `inst` (Entity) – The cannon instance to fire.  
    `chain` (boolean) – If `true`, attempts to trigger a linked cannon.  
*   **Returns:** Nothing.  
*   **Error states:** No explicit error handling; relies on entity integrity and network sync.

### `OnActivate(inst, doer)`
*   **Description:** Callback for direct player activation (e.g., via quick action). Fires the cannon without chain propagation.
*   **Parameters:**  
    `inst` (Entity) – Cannon instance.  
    `doer` (Entity) – Entity triggering activation (unused).  
*   **Returns:** `true` (indicates successful activation).

### `OnAcceptItem(inst, doer)`
*   **Description:** Callback for the `trader` component when a valid item is accepted. Fires the cannon *with* chain propagation (`chain = true`).
*   **Parameters:**  
    `inst` (Entity) – Cannon instance.  
    `doer` (Entity) – Entity accepting trade (unused).  
*   **Returns:** `true`.

### `AbleToAcceptTest(inst, item, giver)`
*   **Description:** Predicate used by `trader` to determine if the cannon will accept a given item. Only accepts `carnival_gametoken` and only while the cannon is `inactive`.
*   **Parameters:**  
    `inst` (Entity) – Cannon instance.  
    `item` (Entity) – Item being offered.  
    `giver` (Entity) – Item's owner (unused).  
*   **Returns:**  
    `true` if `item.prefab == "carnival_gametoken"` and `inst:HasTag("inactive")`;  
    `false, "CARNIVALGAME_INVALID_ITEM"` otherwise.

### `Enable(inst)`
*   **Description:** Marks the cannon as ready for reuse by setting `inactive = true` and playing the "idle" animation.
*   **Parameters:** `inst` (Entity) – Cannon instance.  
*   **Returns:** Nothing.

### `ChainActivate(inst)`
*   **Description:** Finds the nearest inactive cannon within radius `4` (must have tags `"carnivalcannon"` and `"inactive"`) and triggers its `trader.onaccept` callback.
*   **Parameters:** `inst` (Entity) – Source cannon triggering the chain.  
*   **Returns:** Nothing.  
*   **Error states:** No-op if entity is not awake or no matching cannon found.

### `GetStatus(inst)`
*   **Description:** Returns the current status string for inspection UI: `"COOLDOWN"` when active, `nil` when inactive.
*   **Parameters:** `inst` (Entity) – Cannon instance.  
*   **Returns:** `"COOLDOWN"` or `nil`.

### `onhammered(inst, worker)`
*   **Description:** Callback for `workable` (HAMMER action). Spawns a "collapse_small" FX, drops loot, and removes the cannon entity.
*   **Parameters:**  
    `inst` (Entity) – Cannon instance.  
    `worker` (Entity) – Hammering entity (unused).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `onbuilt` – Triggers `OnBuilt`, which plays "place" then "idle" animation and plays the placement sound.

- **Pushes:** None directly. Visual FX like "collapse_small" and loot are managed by `lootdropper:DropLoot()` and `SpawnPrefab`.

> Note: `inst.FireCannon` is exposed as a public method, enabling external code to directly fire the cannon (e.g., via world events or scripts).
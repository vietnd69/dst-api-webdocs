---
id: carpentry_station
title: Carpentry Station
description: A multiplayer-compatible structure that enables crafting of carpentry recipes and supports blade-based upgrades; handles states including construction, usage, burning, and destruction.
tags: [crafting, structure,烧毁, looting]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4ff6261a
system_scope: crafting
---

# Carpentry Station

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `carpentry_station` prefab provides a functional crafting station that supports prototyping with carpentry recipes. It integrates with the `prototyper`, `workable`, `inventoryitemholder`, `burnable`, and `lootdropper` components to manage construction, tool interaction (via carpentry blades), state changes (idle/active), burning, and loot generation upon destruction. As a structure, it supports multi-player interaction and server-authoritative state persistence.

## Usage example
```lua
local inst = SpawnPrefab("carpentry_station")
inst.Transform:SetPosition(x, y, z)
inst:PushEvent("onbuilt") -- triggers placement animation/sound
inst.components.prototyper.on = true -- activates proximity loop animation
inst.components.inventoryitemholder:GiveItem(blade_item) -- inserts blade to upgrade tech tree
```

## Dependencies & tags
**Components used:** `hauntable`, `inspectable`, `lootdropper`, `prototyper`, `workable`, `inventoryitemholder`, `burnable`, `propagator`, `inventoryitem`  
**Tags added:** `structure`, `carpentry_station`, `prototyper`, `burnable`, `worker` (via `workable`), `outofreach` (applied conditionally)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.prototyper.on` | boolean | `false` | Whether the station is in active (proximity loop) state. Set externally via `OnTurnOn/Off`. |
| `inst.components.prototyper.trees` | TechTree | `TUNING.PROTOTYPER_TREES.CARPENTRY_STATION` | Tech tree used for recipe availability; replaced dynamically when a blade is inserted. |
| `inst.components.inventoryitemholder.item` | Entity or nil | `nil` | Currently inserted carpentry blade (if any). |

## Main functions
### `OnHammered(inst, worker)`
*   **Description:** Handles hammering interaction; extinguishes fire if burning, drops loot (or ash if burnt), removes any held blade, spawns collapse FX, and destroys the entity.
*   **Parameters:**  
    `inst` (Entity) — the carpentry station instance.  
    `worker` (Entity) — the entity performing the hammer action.
*   **Returns:** Nothing.
*   **Error states:** No special failure conditions; always removes the entity.

### `OnHit(inst, worker)`
*   **Description:** Plays the "hit_open" animation followed by either "proximity_loop" (if active) or "idle" animation. Triggered during workable work progress.
*   **Parameters:**  
    `inst` (Entity) — the station instance.  
    `worker` (Entity) — the worker entity (unused in logic).
*   **Returns:** Nothing.
*   **Error states:** Returns early without animation if `inst:HasTag("burnt")`.

### `OnTurnOn(inst)`
*   **Description:** Activates the proximity loop animation and playing ambient sound. Used when a recipe is started or a blade is inserted.
*   **Parameters:** `inst` (Entity) — the station instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if burnt.

### `OnTurnOff(inst)`
*   **Description:** Returns to idle animation, kills proximity sound, and plays exit sound.
*   **Parameters:** `inst` (Entity) — the station instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if burnt.

### `OnActivate(inst, doer, recipe)`
*   **Description:** Plays use animation and ambient sound when crafting begins; optionally replaces the "woodshaving" symbol based on carpentry tech level.
*   **Parameters:**  
    `inst` (Entity) — the station instance.  
    `doer` (Entity) — the entity initiating crafting.  
    `recipe` (Recipe) — the recipe being crafted; used to determine build override symbol.
*   **Returns:** Nothing.
*   **Error states:** No effect if burnt.

### `OnBuilt(inst)`
*   **Description:** Called automatically after the entity is placed in the world (via `onbuilt` event). Plays placement animation, sound, and sets idle state.
*   **Parameters:** `inst` (Entity) — the station instance.
*   **Returns:** Nothing.

### `OnBladeGiven(inst, item, giver)`
*   **Description:** Handles insertion of a carpentry blade; replaces the prototyper's tech tree and updates visual override. Fails silently and returns the item if blade is invalid.
*   **Parameters:**  
    `inst` (Entity) — the station instance.  
    `item` (Entity) — the blade item.  
    `giver` (Entity) — the entity giving the item.
*   **Returns:** Nothing.
*   **Error states:** Returns early without installing blade if `item.blade_tech_tree` or `item.build_override` is missing.

### `OnBladeTaken(inst, item, taker)`
*   **Description:** Resets the tech tree and visual override when a blade is removed.
*   **Parameters:**  
    `inst` (Entity) — the station instance.  
    `item` (Entity) — the blade item being taken.  
    `taker` (Entity) — the entity taking the item.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — triggers `OnBuilt`.  
- **Pushes:** None directly; delegates entity lifecycle via component events (`onextinguish`, `on_loot_dropped`, etc.).  
- **Save/Load:** Uses `inst.OnSave` and `inst.OnLoad` to persist burn state.
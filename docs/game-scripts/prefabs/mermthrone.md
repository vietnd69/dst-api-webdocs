---
id: mermthrone
title: Mermthrone
description: Represents the Merm King’s throne structure in DST, supporting construction phases, occupation by the Merm King, burning, and destruction with appropriate game events and loot behavior.
tags: [structure, boss, fire, merm]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a9e79172
system_scope: entity
---

# Mermthrone

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mermthrone` prefab implements the Merm King’s throne structure, which appears in the Forest world. It exists in two forms: an unoccupied, buildable construction stage (`mermthrone_construction`) and a fully built throne (`mermthrone`). When the Merm King appears, the throne is "occupied", becoming indestructible and immune to fire and propagator damage, and updates its minimap icon accordingly. The structure supports construction, hammering, burning, and deconstruction, emitting world-level events (`onthronebuilt`, `onthronedestroyed`) for orchestration.

The component logic is embedded directly in the `fn` (for built throne) and `construction_fn` (for construction site) functions, and uses several standard components (`workable`, `burnable`, `lootdropper`, `constructionsite`) to handle game mechanics.

## Usage example
```lua
-- Example: Spawn a throne and check if it’s occupied by the Merm King
local throne = SpawnPrefab("mermthrone")
throne.Transform:SetPosition(0, 0, 0)

-- Check occupied status via MermKingManager (requires mastersim)
if TheWorld.components.mermkingmanager then
    if TheWorld.components.mermkingmanager:IsThrone(throne) then
        print("Throne is occupied!")
    end
end
```

## Dependencies & tags
**Components used:** `workable`, `burnable`, `lootdropper`, `constructionsite`, `inspectable`, `propagator` (removed when occupied), `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`, `hauntable`
**Tags added/removed:** Adds `mermthrone` to built throne; `constructionsite` to construction stage. Removes `propagator`/`burnable` when occupied.

## Properties
No public properties are defined or modified directly in this file.

## Main functions
The logic is implemented in local callback functions bound to component events and entity lifecycle hooks. No methods are exported as standalone public functions, but the following are core internal helpers:

### `OnConstructed(inst, doer)`
*   **Description:** Called when construction is completed. Verifies material requirements; if satisfied, replaces the construction site with `mermthrone`, emits build sound, and fires `onthronebuilt`.
*   **Parameters:** `inst` (Entity) — the construction site entity; `doer` (Entity) — builder (unused).
*   **Returns:** Nothing.
*   **Error states:** Does not proceed unless all materials for `CONSTRUCTION_PLANS[inst.prefab]` are met.

### `ondeconstruct_common(inst)`
*   **Description:** Fires `onthronedestroyed` event when a throne (occupied or not) is deconstructed.
*   **Parameters:** `inst` (Entity) — the throne entity.
*   **Returns:** Nothing.

### `onburnt_common(inst)`
*   **Description:** Fires `onthronedestroyed` event when the throne is fully burnt.
*   **Parameters:** `inst` (Entity) — the throne entity.
*   **Returns:** Nothing.

### `onhammered_common(inst, worker)`
*   **Description:** Handles hammering logic for both construction and regular throne: extinguishes fire (if burning), drops loot, spawns collapse FX.
*   **Parameters:** `inst` (Entity); `worker` (Entity) — the hammerer.
*   **Returns:** Nothing.

### `onhammered_construction(inst, worker)`
*   **Description:** Hammer callback for construction site. Calls `onhammered_common`, drops all construction materials, and removes the entity.
*   **Parameters:** `inst` (Entity); `worker` (Entity).
*   **Returns:** Nothing.

### `onhammered_regular(inst, worker)`
*   **Description:** Hammer callback for built throne. Calls `onhammered_common`, fires `onthronedestroyed`, and removes the entity.
*   **Parameters:** `inst` (Entity); `worker` (Entity).
*   **Returns:** Nothing.

### `onhit_construction(inst, worker)`
*   **Description:** Called on partial hammer hits during construction. Plays hit animation, cancels construction.
*   **Parameters:** `inst` (Entity); `worker` (Entity).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if entity is `burnt`.

### `onconstruction_built(inst)`
*   **Description:** Called when construction finishes. Prevents collisions, plays placement animation/sound, and prevents future construction.
*   **Parameters:** `inst` (Entity) — now a `mermthrone`.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes burning state. Stores `data.burnt = true` if currently burnt or burning and ignoring fuel.
*   **Parameters:** `inst` (Entity); `data` (table) — save data table.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores burnt state on load. Calls `onburnt` callback if saved as burnt.
*   **Parameters:** `inst` (Entity); `data` (table | nil) — loaded data.
*   **Returns:** Nothing.

### `OnMermKingCreated(inst, data)`
*   **Description:** Reacts to Merm King spawn event. Disables workability, removes fire propagator, removes burnable component, and updates minimap icon.
*   **Parameters:** `inst` (Entity) — the throne; `data` (table) — event data containing `throne`.
*   **Returns:** Nothing.

### `OnMermKingDestroyed(inst, data)`
*   **Description:** Reacts to Merm King removal. Re-enables workability, restores `burnable` and `propagator`, sets canlight, and resets minimap icon.
*   **Parameters:** `inst` (Entity); `data` (table) — event data containing `throne`.
*   **Returns:** Nothing.

### `OnThroneRemoved(inst)`
*   **Description:** Fallback listener for when throne is removed indirectly (e.g., via `Remove()`). Fires `onthronedestroyed` if throne is registered with `mermkingmanager`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `Throne_Initialize(inst)`
*   **Description:** Deferred initializer run on startup (after `OnLoad`). Checks if a Merm King already exists and triggers `OnMermKingCreated`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `invalid_placement_fn(player, placer)`
*   **Description:** Validation function for placement. Alerts player via talker if placement blocked (e.g., invalid terrain).
*   **Parameters:** `player` (Entity | nil); `placer` (Entity | nil).
*   **Returns:** Nothing (early return on `mouse_blocked`).

## Events & listeners
- **Listens to:**
  - `onburnt` — calls `onburnt_common`.
  - `ondeconstructstructure` — calls `ondeconstruct_common`.
  - `onmermkingcreated` — triggers `OnMermKingCreated` if throne matches `data.throne`.
  - `onmermkingdestroyed` — triggers `OnMermKingDestroyed` if throne matches `data.throne`.
  - `onremove` — triggers `OnThroneRemoved` if throne is registered in `mermkingmanager`.
  - `onbuilt` (construction) — triggers `onconstruction_built`.
- **Pushes:**
  - `onthronebuilt` — after successful construction.
  - `onthronedestroyed` — on destruction via hammer, burn, deconstruct, or removal.

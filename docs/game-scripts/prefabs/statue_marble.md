---
id: statue_marble
title: Statue Marble
description: A breakable decorative statue prefab that yields marbles and chess piece sketches upon mining, with type-specific behavior and save/load state management.
tags: [decoration, mining, loot, state]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b27125b1
system_scope: world
---

# Statue Marble

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`statue_marble` is a breakable decorative object placed in the world, implemented as a prefab using the Entity Component System. It integrates with the `workable`, `lootdropper`, and `inspectable` components to define its mining interaction, loot table, and inspection status. The statue supports four visual types (determined by `typeid`) and tracks state across saves, including type-specific behavior like publishing `ms_unlockchesspiece` events and using dedicated scrapbook assets for specific variants.

## Usage example
```lua
-- Spawn a default statue (type 1, Muse)
local statue = SpawnPrefab("statue_marble")

-- Explicitly set the statue type (e.g., type 4, Pawn)
statue:SetStatueType(4)

-- Wait for mining to complete (e.g., via listening for entity removal)
statue:ListenForEvent("onremove", function()
    print("Statue destroyed!")
end)
```

## Dependencies & tags
**Components used:** `lootdropper`, `inspectable`, `workable`  
**Tags:** Adds `statue` to the entity; uses `swap_statue` symbol override for animation variants.  
**Special tags checked:** None beyond `statue`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `typeid` | number | `1` (via `math.random(4)`) | Index (1–4) indicating visual and loot type; used to select animation, loot, and scrapbook assets. |
| `scrapbook_anim` | string | `"full"` (only for specific prefabs) | Animation name used in scrapbook UI. |
| `scrapbook_speechname` | string | `"statue_marble"` (only for specific prefables) | Localized speech name used in scrapbook. |
| `scrapbook_build` | string | `"statue_small_type1_build"` (only for specific prefabs) | Symbol build override used in scrapbook. |

## Main functions
### `SetStatueType(inst, typeid)`
* **Description:** Sets the visual and loot type of the statue based on `typeid`. Applies the appropriate animation override for the `swap_statue` symbol and updates `inst.typeid`.
* **Parameters:**  
  - `inst` (entity) — The statue instance.  
  - `typeid` (number, optional) — Integer 1–4 specifying statue appearance and loot. Defaults to `math.random(4)`.  
* **Returns:** Nothing.  
* **Error states:** None; gracefully handles defaulting and duplicate calls.

### `LootSetFn(lootdropper)`
* **Description:** Configures the loot dropped by this statue based on its `typeid`. Uses the global `SKETCH_UNLOCKS` table to determine the sketch prefab (e.g., `"chesspiece_muse_sketch"`) and updates the `LootDropper`'s fixed loot list.
* **Parameters:**  
  - `lootdropper` (component) — The `LootDropper` component instance.  
* **Returns:** Nothing.  
* **Error states:** Returns without modifying loot if the corresponding `SKETCH_UNLOCKS` entry is an empty string (`""`).

### `OnWorked(inst, worker, workleft)`
* **Description:** Called each tick during mining and when work completes (`workleft <= 0`). Plays animation segments based on progress and handles destruction logic.
* **Parameters:**  
  - `inst` (entity) — The statue instance.  
  - `worker` (entity or `nil`) — The mining actor (may be `nil` during load).  
  - `workleft` (number) — Remaining work units.  
* **Returns:** Nothing.  
* **Error states:** When `workleft <= 0`, removes the entity. On load (when `worker == nil`), delegates to `OnWorkLoad`, which re-invokes `OnWorked`.

### `GetStatus(inst)`
* **Description:** Returns a string identifier for the statue’s type, used by the `inspectable` component for UI display (e.g., `"TYPE1"`).
* **Parameters:**  
  - `inst` (entity) — The statue instance.  
* **Returns:** `string` — Formatted type string (`"TYPE"..tostring(inst.typeid)`).  

## Events & listeners
- **Listens to:** None directly (event listeners are registered externally for `statue_marble` entities, e.g., in prefabs using `inst:ListenForEvent(...)`).  
- **Pushes:**  
  - `ms_unlockchesspiece` — Triggered when a statue of type 1 (Muse) or 4 (Pawn) is fully mined; value is `"muse"` or `"pawn"` respectively.  
  - `entity_droploot` — Implicitly fired by `lootdropper:DropLoot`.  
  - `onremove` — Emitted when the entity is removed after mining.
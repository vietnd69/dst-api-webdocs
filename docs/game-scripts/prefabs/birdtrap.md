---
id: birdtrap
title: Birdtrap
description: A portable trap prefab that captures birds when baited and sprung, supporting multiple bird species with symbol swaps and finite uses.
tags: [trap, bird, inventory, loot, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3b5aa122
system_scope: entity
---

# Birdtrap

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`birdtrap` is a prefab that defines a portable trap designed to catch birds. It leverages the `trap` and `finiteuses` components to handle springing behavior and use-count tracking. When a bird steps on the trap, it is captured, removed from the world, and the trap’s animation updates to reflect the trapped bird type. The trap supports multiple bird species by swapping animation symbols based on the caught bird’s `trappedbuild` property. It also includes persistence support (`OnSave`/`OnLoad`) and state graph integration via `SGtrap`.

## Usage example
```lua
local inst = SpawnPrefab("birdtrap")
inst.Transform:SetPosition(x, y, z)
inst.components.finiteuses:SetUses(3)
inst.components.trap.targettag = "bird"
```

## Dependencies & tags
**Components used:** `trap`, `finiteuses`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`  
**Tags added:** `trap`  
**Tags checked (via target):** `bird`, `baitstealer`, `mole`, `molebait`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `trappedbuild` | string? | `nil` | Animation build name used for the `trapped` symbol swap; set when a bird is caught and persisted via save/load. |
| `_sleeptask` | Task? | `nil` | Delayed task for off-screen catching logic; managed during entity sleep/wake. |
| `scrapbook_animoffsetbgx` | number | `5` | Offset used in Scrapbook UI rendering. |
| `scrapbook_animoffsetbgy` | number | `30` | Offset used in Scrapbook UI rendering. |
| `sounds` | table | `close`/`rustle` sound paths | Sound names mapped for trap close/rustle events. |

## Main functions
### `SetTrappedSymbols(inst, build)`
*   **Description:** Updates the trap’s `trapped` animation symbol to reflect the specified build (e.g., `robin`, `crow`), allowing visual identification of the captured bird type.
*   **Parameters:** `build` (string) — the build name to use for the symbol override.
*   **Returns:** Nothing.
*   **Error states:** Only applies to the client; safe to call on both server and client.

### `OnHarvested(inst)`
*   **Description:** Called when the trap is harvested manually; consumes one use via `finiteuses:Use()`.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.
*   **Error states:** No effect if `finiteuses` component is absent.

### `OnSpring(inst, target, bait)`
*   **Description:** Called when the trap springs; sets the `trappedbuild` symbol swap if the caught `target` has a `trappedbuild` property defined.
*   **Parameters:**  
  - `inst` (Entity) — the trap entity.  
  - `target` (Entity) — the caught bird entity.  
  - `bait` (Entity?) — the bait consumed during springing.  
*   **Returns:** Nothing.
*   **Error states:** No effect if `target.trappedbuild` is `nil`.

### `CatchOffScreen(inst)`
*   **Description:** Attempted fallback for catching birds that are off-screen (e.g., during world generation or large gaps); spawns a bird using `TheWorld.components.birdspawner` and triggers springing.
*   **Parameters:** `inst` (Entity) — the trap entity.
*   **Returns:** Nothing.
*   **Error states:** Early exit if the world lacks `birdspawner` component or random chance fails (`< 0.5`).

### `OnEntitySleep(inst)` / `OnEntityWake(inst)`
*   **Description:** Manages the off-screen catching task. On sleep, schedules `CatchOffScreen` after 1 second; on wake, cancels the task.
*   **Parameters:** `inst` (Entity) — the trap entity.
*   **Returns:** Nothing.
*   **Error states:** None identified.

## Events & listeners
- **Listens to:** (None — event handlers are assigned as object methods like `inst.OnEntitySleep`, not via `inst:ListenForEvent`.)
- **Pushes:** (None directly.)

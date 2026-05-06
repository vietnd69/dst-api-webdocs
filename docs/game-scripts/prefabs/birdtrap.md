---
id: birdtrap
title: Birdtrap
description: Spawnable trap entity that catches birds using bait, with finite uses and visual feedback for trapped bird type.
tags: [prefab, trap, inventory, creature]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 0fe4b446
system_scope: entity
---

# Birdtrap

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`birdtrap.lua` registers a spawnable trap entity designed to catch birds. The prefab's `fn()` constructor builds the physics body, attaches client-side components (AnimState, SoundEmitter, MiniMap), and adds the "trap" tag. On the server (master-only block within `fn()`, guarded by `if not TheWorld.ismastersim then return end`), it attaches gameplay components (`trap`, `finiteuses`, `inspectable`, `inventoryitem`) and configures bird-specific trapping behavior. The trap visually displays the caught bird type via symbol overrides and depletes uses on each successful harvest.

## Usage example
```lua
-- Spawn a birdtrap at world origin:
local inst = SpawnPrefab("birdtrap")
inst.Transform:SetPosition(0, 0, 0)

-- Place bait (seeds) near the trap:
local bait = SpawnPrefab("seeds")
bait.Transform:SetPosition(0, 1, 0)
-- The trap component will automatically claim nearby bait when a creature approaches

-- Check if trap is baited and ready:
if inst.components.trap:IsBaited() then
    print("Trap is set and waiting for birds")
end
```

## Dependencies & tags
**External dependencies:**
- `MakeInventoryPhysics` -- applies physics and floatable behavior for inventory items
- `MakeInventoryFloatable` -- configures the entity to float on water as an inventory item
- `SGtrap` -- stategraph attached via `inst:SetStateGraph("SGtrap")` for animation control
- `scripts/prefabs/wortox_soul_common.lua` -- SCRIPT asset for soul handling on trapped creatures
- `birdspawner` -- accessed via TheWorld.components.birdspawner in CatchOffScreen for off-screen bird spawning

**Components used:**
- `trap` -- core trapping logic; configured with `targettag = "bird"`, harvest/spring callbacks
- `finiteuses` -- tracks remaining uses; set to `TUNING.TRAP_USES`, removes entity when depleted
- `inspectable` -- allows players to inspect the trap
- `inventoryitem` -- enables the trap to be picked up and carried

**Tags:**
- `trap` -- added in `fn()`; used for entity identification and targeting

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries for animations (birdtrap, bird builds), sounds, and scripts. |
| `prefabs` | table | `{...}` | Array of bird prefab names that can be trapped and may need symbol swaps (crow, robin, canary, etc.). |
| `sounds` | table | `{close, rustle}` | Local table mapping sound names to FMOD paths; assigned to `inst.sounds` for stategraph access. |
| `trappedbuild` | string | `nil` | Stores the build name of the trapped bird for symbol override persistence across save/load. |
| `_sleeptask` | task | `nil` | Scheduled task reference for off-screen bird catching; managed in `OnEntitySleep`/`OnEntityWake`. |
| `scrapbook_animoffsetbgx` | number | `5` | X offset for scrapbook animation background (master only). |
| `scrapbook_animoffsetbgy` | number | `30` | Y offset for scrapbook animation background (master only). |

## Main functions
### `CatchOffScreen(inst)` (local)
* **Description:** Handles off-screen bird catching when the trap is sleeping. Spawns a bird via `birdspawner`, teleports it to trap position, assigns it as the trap target, and triggers `DoSpring()` to catch it. Only executes if trap is baited and passes a 50% random check.
* **Parameters:** `inst` -- trap entity instance
* **Returns:** None
* **Error states:** None — `birdspawner` is nil-checked before use; function exits gracefully if missing.

### `OnEntitySleep(inst)` (local)
* **Description:** Called when the trap entity goes to sleep (players far away). Cancels any existing sleep task and schedules `CatchOffScreen` to run after 1 second, allowing off-screen trapping to continue.
* **Parameters:** `inst` -- trap entity instance
* **Returns:** None
* **Error states:** None.

### `OnEntityWake(inst)` (local)
* **Description:** Called when the trap entity wakes up (players nearby). Cancels the pending sleep task and clears `_sleeptask` reference to prevent duplicate scheduling.
* **Parameters:** `inst` -- trap entity instance
* **Returns:** None
* **Error states:** None.

### `OnHarvested(inst)` (local)
* **Description:** Called when the trap is harvested by a player. Clears `trappedbuild` and decrements `finiteuses` by 1. When uses reach 0, the trap is removed via `SetOnFinished` callback.
* **Parameters:** `inst` -- trap entity instance
* **Returns:** None
* **Error states:** None — `finiteuses` component is nil-checked before access; function skips use decrement if missing.

### `SetTrappedSymbols(inst, build)` (local)
* **Description:** Applies visual symbol override to display the trapped bird type. Sets `trappedbuild` and overrides the "trapped" symbol with the specified build's trapped symbol.
* **Parameters:**
  - `inst` -- trap entity instance
  - `build` -- string build name (e.g., "crow_build", "robin_build")
* **Returns:** None
* **Error states:** None.

### `OnSpring(inst, target, bait)` (local)
* **Description:** Called when the trap springs and catches a target. If the target has a `trappedbuild` property, applies the corresponding symbol override to display the caught bird type visually.
* **Parameters:**
  - `inst` -- trap entity instance
  - `target` -- caught bird entity
  - `bait` -- bait entity used (may be nil)
* **Returns:** None
* **Error states:** None.

### `OnSave(inst, data)` (local)
* **Description:** Saves the trap's state when the world saves. Stores `trappedbuild` in the data table if set, enabling visual persistence across save/load cycles.
* **Parameters:**
  - `inst` -- trap entity instance
  - `data` -- table to populate with save data
* **Returns:** None (modifies `data` table in-place)
* **Error states:** None.

### `OnLoad(inst, data)` (local)
* **Description:** Restores the trap's state when the world loads. If `trappedbuild` exists in saved data, reapplies the symbol override to restore the visual of the trapped bird.
* **Parameters:**
  - `inst` -- trap entity instance
  - `data` -- table containing saved state
* **Returns:** None
* **Error states:** None.

### `fn()`
* **Description:** Prefab constructor that creates the entity and attaches base components. Client-side: builds physics, attaches AnimState/SoundEmitter/MiniMap components, sets default animation, and adds the "trap" tag. Returns early on clients (`if not TheWorld.ismastersim then return end`). On master: continues with gameplay component attachment (`inspectable`, `inventoryitem`, `finiteuses`, `trap`), scrapbook offset configuration, stategraph assignment, and save/load handler registration.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — `TheNet:GetServerGameMode()` nil comparison (`~= "quagmire"`) evaluates correctly even if nil is returned.

## Events & listeners
None — callbacks (`onharvest`, `onspring`, `onfinished`) are set via `SetOnHarvestFn`/`SetOnSpringFn`/`SetOnFinished` and invoked directly by components, not through `ListenForEvent`.
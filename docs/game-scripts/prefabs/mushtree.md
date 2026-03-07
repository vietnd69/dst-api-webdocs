---
id: mushtree
title: Mushtree
description: Manages lifecycle, growth, seasonal changes, acid rain effects, and loot generation for mushtree entities in the Cave biome.
tags: [environment, growth, season, loot, acid]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 844f25bc
system_scope: environment
---

# Mushtree

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mushtree.lua` file defines three distinct mushtree prefabs (`mushtree_small`, `mushtree_medium`, `mushtree_tall`) with dynamic behavior driven by seasons, acid rain events, and player interaction. Each mushtree supports growth through stages, transforms into a stump when chopped or burnt, and blooms only during its matching season. It integrates with components like `acidinfusible`, `growable`, `periodicspawner`, `burnable`, and `workable` to manage its lifecycle, acid-related visual effects, spore spawning, and interaction responses. The prefabs also handle spawning loot, especially under burnt or acid-covered conditions.

## Usage example
```lua
-- The mushtree prefab is instantiated automatically via Prefab() registration.
-- To spawn a mushtree entity in a mod:
local tree = SpawnPrefab("mushtree_tall")
if tree and tree.components then
    tree.components.growable:DoGrowth()      -- Force immediate growth step
    tree:_Bloom(true)                        -- Instantly bloom the tree
    tree.components.acidinfusible:Infuse()   -- Simulate acid rain coverage
end
```

## Dependencies & tags
**Components used:** `acidinfusible`, `burnable`, `growable`, `knownlocations`, `lootdropper`, `periodicspawner`, `perishable`, `plantregrowth`, `simplemagicgrower`, `timer`, `workable`, `inspectable`, `propagator`  
**Tags:** Adds `shelter`, `mushtree`, `cavedweller`, `plant`, `tree`, `webbable` (tall only), `stump` (when chopped/burnt), `FX` (for burnt effects), `burnt` (when on fire)  
**Removed tags:** `shelter`, `webbable`, and component `propagator` when converted to a stump.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `treestate` | string | `TREESTATES.NORMAL` (`"normal"`) | Current visual state: `"normal"` or `"bloom"`. |
| `_is_stump` | boolean | `false` | True when the mushtree has been chopped or burnt into a stump. |
| `_last_acid_start_time` | number | `nil` | Timestamp of the last acid rain start (in seconds since epoch). Used to calculate acid duration. |
| `_phase1_show` | number | `nil` (randomized on first use) | Which of the first-phase acid globes (`1..3`) is shown during phase 1. |
| `_smoke_number` | `net_tinybyte` | `0` | Networked value for acid phase visuals: `0=none`, `1..3=phase 1`, `4=phase 2`. |
| `_bloomed` | `net_bool` | `false` | Networked flag indicating if the tree is in bloom state. |
| `_acidsmokes` | table | `{}` (client only) | Map of `acidsmoke_endless` prefabs to symbol index (client-side only). |
| `_sporetime` | number | `nil` | Saved spawn time when entity goes to sleep; used to resume spore timing correctly on wake. |

## Main functions
### `tree_burnt(inst)`
* **Description:** Handles post-burn behavior for a full mushtree (non-stump). Drops ash and possibly charcoal, spawns burnt visual FX, and removes the tree.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance being burnt.
* **Returns:** Nothing.
* **Error states:** Calls `SpawnPrefab` for FX—does not validate the returned FX entity.

### `stump_burnt(inst)`
* **Description:** Handles post-burn behavior for a stump. Only drops ash and removes the stump.
* **Parameters:** `inst` (EntityInstance) - The stump instance being burnt.
* **Returns:** Nothing.

### `dig_up_stump(inst)`
* **Description:** Callback for when a player successfully finishes digging up a stump. Drops one `log` and removes the stump.
* **Parameters:** `inst` (EntityInstance) - The stump instance.
* **Returns:** Nothing.

### `MakeAcidSmokeForSymbol(inst, symbol_index)`
* **Description:** Spawns a persistent `acidsmoke_endless` entity that follows a named symbol on the tree (`swap_acidglob{symbol_index}` or `swap_acidglob_bloom{symbol_index}`). Attached only on the client.
* **Parameters:**  
  * `inst` (EntityInstance) - The mushtree instance.  
  * `symbol_index` (number) - Integer `1..3` indicating which symbol to follow.  
* **Returns:** Nothing. Registers `onremove` event listener to clean up tracking.

### `get_acid_perish_time(inst)`
* **Description:** Computes how long the current acid exposure has lasted (in seconds). If the acid recovery task is running, it returns remaining time; otherwise, it calculates elapsed time since `_last_acid_start_time`.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance.
* **Returns:** `number` - Elapsed acid duration in seconds (or remaining recovery time if recovery is active).
* **Error states:** Returns `0` if no acid state is tracked.

### `try_acid_art_update(inst)`
* **Description:** Updates acid-phase visual symbols and networked flags (`_smoke_number`, `_bloomed`) on the client to match current acid state. Triggers choppa animation if visual changes occur.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance.
* **Returns:** Nothing.
* **Error states:** Skips work if network values don’t require updates; avoids expensive C++ calls unnecessarily.

### `acid_initialize(inst)`
* **Description:** Starts acid exposure phase. Resets recovery task, sets `_last_acid_start_time`, starts visual update timer, and temporarily increases spore density and spawn interval.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance.
* **Returns:** Nothing.

### `OnAcidInfused(inst)`
* **Description:** Delayed callback triggered when acid rain begins. Schedules `acid_initialize` after a random delay.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance.
* **Returns:** Nothing.

### `acid_reset(inst)`
* **Description:** Ends acid exposure and resets state. Cancels initialization task, restores spore density, clears `_last_acid_start_time`, stops visual updates, and updates visuals.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance.
* **Returns:** Nothing.

### `OnAcidUninfused(inst)`
* **Description:** Schedules acid recovery (delayed reset) based on elapsed acid time. Spawns `acid_reset` task for the remaining duration.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance.
* **Returns:** Nothing.

### `acidcovered_on_loot_prefab_spawned(inst, event_data)`
* **Description:** Reduces perish rate of loot spawned while the tree is acid-covered. Applies a time-based multiplier to the loot’s perish percentage.
* **Parameters:**  
  * `inst` (EntityInstance) - The mushtree instance.  
  * `event_data` (table) - Event payload containing `loot` (EntityInstance).  
* **Returns:** Nothing. Modifies `loot.components.perishable` if present and acid duration > `0`.
* **Error states:** Returns early if `loot` has no `perishable` component or acid duration is `<= 0`.

### `inspect_tree(inst)`
* **Description:** Returns a string status for UI/inspect tooltip based on tree state: `"CHOPPED"`, `"BLOOM"`, `"ACIDCOVERED"`, or `nil`.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance.
* **Returns:** `"CHOPPED"` if stump, `"BLOOM"` if blooming, `"ACIDCOVERED"` if acid-infused or recovery pending, else `nil`.

### `onspawnfn(inst, spawn)`
* **Description:** Callback for newly spawned spores. Sets their home location and attempts to place them at a walkable offset.
* **Parameters:**  
  * `inst` (EntityInstance) - The mushtree instance.  
  * `spawn` (EntityInstance) - The newly spawned spore entity.  
* **Returns:** Nothing.

### `ontimerdone(inst, data)`
* **Description:** Handles timer completion events: decay timer (removes entity with effects), and acid visuals timer (calls `try_acid_art_update`).
* **Parameters:**  
  * `inst` (EntityInstance) - The mushtree instance.  
  * `data` (table) - Timer payload with `name` (e.g., `"decay"`, `"acidvisualsupdate"`).  
* **Returns:** Nothing.

### `DoGrowNextStage(inst)`
* **Description:** Advances the mushtree’s grow stage (except for stumps). Calls `SetStage()` on the next stage index.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance.
* **Returns:** Nothing.

### `DoGrow(inst, tostage, targetscale)`
* **Description:** Plays grow/shrink animation, sound, and schedules `DoGrowNextStage` after animation finishes.
* **Parameters:**  
  * `inst` (EntityInstance) - The mushtree instance.  
  * `tostage` (number) - Target stage index (`1`, `2`, or `3`).  
  * `targetscale` (number) - Ignored (legacy).  
* **Returns:** Nothing.

### `swapbuild(inst, treestate, build)`
* **Description:** Swaps the tree’s visual build and updates acid visuals. Starts spore spawning if blooming; stops otherwise.
* **Parameters:**  
  * `inst` (EntityInstance) - The mushtree instance.  
  * `treestate` (string) - `"normal"` or `"bloom"`.  
  * `build` (string) - Asset build name (e.g., `"mushroom_tree_tall_bloom"`).  
* **Returns:** Nothing. Does nothing for stumps.

### `forcespore(inst)`
* **Description:** Manually triggers an immediate spore spawn if the tree is blooming, awake, and not burnt.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance.
* **Returns:** Nothing.

### `startchange(inst, treestate, build, soundname)`
* **Description:** Begins a state change (bloom/normal) with animation and sound. Schedules `swapbuild` after animation and triggers a forced spore if blooming.
* **Parameters:**  
  * `inst` (EntityInstance) - The mushtree instance.  
  * `treestate` (string) - Target `treestate`.  
  * `build` (string) - Target build name.  
  * `soundname` (string) - Sound event name (e.g., `"dontstarve/cave/mushtree_tall_grow_3"`).  
* **Returns:** Nothing. Cancels existing `_changetask` if present.

### `workcallback(inst, worker, workleft)`
* **Description:** Callback during chopping. Plays chop animation and sound. No effect if `workleft <= 0`.
* **Parameters:**  
  * `inst` (EntityInstance) - The mushtree instance.  
  * `worker` (EntityInstance) - Chopping actor (ignored for sound).  
  * `workleft` (number) - Remaining work to finish.  
* **Returns:** Nothing.

### `CLIENT_OnSmokeNumberDirty(inst)`
* **Description:** (Client-side only) Syncs acid smoke visibility to the current `_smoke_number` value.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance.
* **Returns:** Nothing.

### `CLIENT_OnBloomedDirty(inst)`
* **Description:** (Client-side only) Updates acid smoke follow symbol depending on bloom state.
* **Parameters:** `inst` (EntityInstance) - The mushtree instance.
* **Returns:** Nothing.

### `maketree(name, data, state)`
* **Description:** Factory function returning the full `maketree` function for a given tree configuration (`small`, `medium`, `tall`). Defines all entity setup logic (components, tags, events, callbacks) and handles spawn/load logic and stump/burnt states.
* **Parameters:**  
  * `name` (string) - Prefab name (e.g., `"mushtree_tall"`).  
  * `data` (table) - Tree configuration (`tree_data.small`, `medium`, `tall`).  
  * `state` (string) - Initial state: `"stump"` or `nil`.  
* **Returns:** `function` - A closure that constructs the entity.

### `makeburntfx(name, data, bloom)`
* **Description:** Factory function returning a closure to spawn a burnt visual FX entity with one-time animation (`chop_burnt`).
* **Parameters:**  
  * `name` (string) - Tree name (e.g., `"mushtree_tall"`).  
  * `data` (table) - Tree configuration.  
  * `bloom` (boolean) - If true, uses bloom build; otherwise base build.  
* **Returns:** `function` - A closure that creates and returns the FX entity.

### `makeset(...)` → `treeset(name, data, build, bloombuild)`
* **Description:** Registers four prefabs: tree, stump, burnt FX (normal), and burnt FX (bloomed) for a mushtree type.
* **Parameters:**  
  * `name` (string) - Base prefab name (e.g., `"mushtree_tall"`).  
  * `data` (table) - Tree configuration.  
  * `build` (string) - Animation asset path (e.g., `"anim/mushroom_tree_tall.zip"`).  
  * `bloombuild` (string) - Bloom animation asset path.  
* **Returns:** Nothing. Adds prefabs to `treeprefabs` table.

## Events & listeners
- **Listens to:**  
  - `loot_prefab_spawned` → `acidcovered_on_loot_prefab_spawned` (reduces loot perish rate under acid rain).  
  - `timerdone` → `ontimerdone` (handles decay and acid visuals timers).  
  - `acidphasedirty` (client) → `CLIENT_OnSmokeNumberDirty`.  
  - `bloomeddirty` (client) → `CLIENT_OnBloomedDirty`.  
  - `onremove` (on `acidsmoke_endless`) → internal cleanup of `_acidsmokes` map.  
  - `animover` (on burnt FX) → `inst.Remove`.  
  - Season state (`isSpring`, `isSummer`, `isWinter`) → `onisinseason` (bloom control).  
- **Pushes:** None directly. Visual changes and state transitions rely on component events (e.g., `periodicspawner`, `burnable`) and the above listeners.
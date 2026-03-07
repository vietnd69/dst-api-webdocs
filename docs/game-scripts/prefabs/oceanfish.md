---
id: oceanfish
title: Oceanfish
description: Generates both underwater swimming fish entities and their corresponding inventory item versions used in ocean fishing and cooking, including lifecycle management, prey behavior, and fire-suppression capabilities.
tags: [ocean, fishing, entity, inventory, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0de2e162
system_scope: entity
---

# Oceanfish

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`oceanfish.lua` is a prefabs generator script that defines both the underwater and landed (inventory) forms of fish in DST’s ocean ecosystems. It dynamically creates two entity types per fish definition: one for swimming in water (`oceanfish_*`) and one for inventory/hand use (`oceanfish_*_inv`). The script integrates deeply with components for fishing mechanics (`oceanfishable`), physics, movement, fire suppression (`firedetector`, `wateryprotection`), weighing (`weighable`), herd behavior (`herdmember`), and perishability. It handles transitions between states (swimming, hooked, landed, fishing), lifecycle (lifespan timer, entity sleep/wake), and loot generation.

## Usage example
```lua
-- This file does not provide a reusable component; it generates prefabs.
-- To spawn a fish programmatically, use:
local fish = SpawnPrefab("oceanfish_small_1")
fish.Transform:SetPosition(x, y, z)

-- To spawn its inventory version (after catching):
local landed_fish = SpawnPrefab("oceanfish_small_1_inv")
```

## Dependencies & tags
**Components used:**  
`locomotor`, `oceanfishable`, `eater`, `timer`, `herdmember`, `weighable`, `firedetector`, `wateryprotection`, `inventoryitem`, `perishable`, `murderable`, `lootdropper`, `edible`, `cookable`, `tradable`, `inspectable`, `propagator`, `luckitem`, `heater`, `childspawner`

**Tags added (swimming version):** `ignorewalkableplatforms`, `notarget`, `NOCLICK`, `NOBLOCK`, `oceanfishable`, `oceanfishable_creature`, `oceanfishinghookable`, `oceanfish`, `swimming`, `herd_<prefab>`, `ediblefish_<fishtype>`, optionally `HASHEATER`, `luckyitem`/`unluckyitem`  
**Tags added (inventory version):** `fish`, `oceanfish`, `catfood`, `smallcreature`, `smalloceancreature`, `weighable_fish`, `HASHEATER`, `luckyitem`/`unluckyitem`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fish_def` | table | `data` (from `prefabs/oceanfishdef.lua`) | Contains all fish-specific definitions (anims, stats, loot, diet, etc.) |
| `leaving` | boolean | `nil`/`false` | Flag to indicate if fish should auto-remove after teleporting/spawning elsewhere |
| `persists` | boolean | `true` | Whether the fish persists across world saves/loads |
| `heavy` | boolean | `nil`/`false` | Indicates if fish is heavy (affects loot, set during load/save) |
| `remove_task` | task | `nil` | Delayed removal task used during entity sleep |
| `flop_task` | task | `nil` | Timer to periodically re-trigger flop animation |
| `flopsnd[1–4]` | task | `nil` | Sound-trigger tasks for flop animation sequence |
| `scrapbook_anim` | string | `"flop_pst"` | Animation used for scrapbook entry |

## Main functions
### `water_common(data)`
*   **Description:** Constructor for the swimming ocean fish entity. Initializes physics (underwater collision mask), components (`locomotor`, `oceanfishable`, `eater`, `herdmember`, `weighable`, `firedetector`, `wateryprotection`, `propagator`, `heater`, `luckitem`), state graph, and brain. Also registers lifecycle callbacks and net sync.
*   **Parameters:** `data` (table) — fish definition (from `FISH_DATA.fish`), must contain keys like `prefab`, `bank`, `build`, `walkspeed`, `runspeed`, `stamina`, `weight_min`, `weight_max`, `diet`, `loot`, etc.
*   **Returns:** `inst` (Entity) — the fully constructed swimming fish entity.
*   **Error states:** Returns early on client without master simulation; no error, just skips master-side initialization.

### `inv_common(fish_def)`
*   **Description:** Constructor for the landed inventory fish item (`_inv` variant). Sets up inventory physics, animation, edible/cookable properties, perishability, weighing, loot, trading value, and listener-based transition logic (e.g., respawn into water or re-flop on land).
*   **Parameters:** `fish_def` (table) — same structure as `data` above; used to configure item stats.
*   **Returns:** `inst` (Entity) — the landed inventory fish entity ready for pickup.
*   **Error states:** None documented; returns client entity early in non-master simulation.

### `OnMakeProjectile(inst)`
*   **Description:** Converts the swimming fish into a projectile launched from a fishing rod. Adds `complexprojectile` component, updates collision layer to land-only, enables lighting, plays splash FX, and transitions the state graph to `"launched_out_of_water"`.
*   **Parameters:** `inst` (Entity) — the fish entity currently being reeled in.
*   **Returns:** `inst` (Entity) — same entity, now with projectile behavior.

### `OnProjectileLand(inst)`
*   **Description:** Called when a projectile (hooked fish) hits land. Checks if it landed in water or on solid ground; respawns in water if underwater, or spawns a new `_inv` fish and removes the projectile if landed on ground.
*   **Parameters:** `inst` (Entity) — the projectile entity hitting the ground.
*   **Returns:** Nothing.

### `Flop(inst)`
*   **Description:** Initiates a looping flop animation with randomized repetitions and associated sound events. Used for idle animation and when landed. Starts itself recursively via a delayed task.
*   **Parameters:** `inst` (Entity) — fish entity to animate.
*   **Returns:** Nothing.

### `Inv_LootSetupFn(lootdropper)`
*   **Description:** Loot setup function that checks the fish’s weight percentage. If `>= TUNING.WEIGHABLE_HEAVY_LOOT_WEIGHT_PERCENT`, it overrides loot to `heavy_loot` instead of default `loot`.
*   **Parameters:** `lootdropper` (Component) — the owned `lootdropper` component.
*   **Returns:** Nothing.

### `launch_water_projectile(inst, target_position)`
*   **Description:** Spawns a `waterstreak_projectile` from the fish toward a fire target, calculating speed via linear easing over detection range. Used by fire-suppression-capable fish.
*   **Parameters:**  
  `inst` (Entity) — the fish entity.  
  `target_position` (Vector) — target point (e.g., fire position).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `timerdone` — handled by `OnTimerDone` to extend or remove `oceanfishable` component when lifespan expires.
  - `on_landed` — handled by `OnInventoryLanded` to decide whether to respawn in water or remain as inventory.
  - `animover` — handled by `OnInvCommonAnimOver` to trigger final flop sound.
  - `onputininventory` (`topocket`) — stops fire-spreading propagation when picked up.
  - `ondropped` (`toground`) — resumes fire-spreading propagation when dropped.
  - `on_loot_dropped` (`ondroppedasloot`) — records looting entity as override owner for weighing.
  - `putoutfire` — triggers `SpreadProtectionAtPoint` to extinguish nearby fire.
- **Pushes:**
  - `ms_shoalfishhooked_redux` — fired when a shoal fish is fully hooked (requires home `oceanfish_shoalspawner` to exist).
  - `on_no_longer_landed` — implied via `InventoryItem` component.
  - `on_landed` — via `InventoryItem` when transitioning to landed state.
  - `buff_expired`, `onhitother`, `onperish`, `oncooked` — via other components (not defined here, but expected integrations).

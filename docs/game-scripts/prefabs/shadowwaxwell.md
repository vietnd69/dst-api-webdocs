---
id: shadowwaxwell
title: Shadowwaxwell
description: Provides prefabricated spawn logic and component setup for Maxwell's shadow minions and related FX in DST.
tags: [combat, ai, minion, boss, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6c0986d0
system_scope: entity
---

# Shadowwaxwell

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines prefabs and core logic for Maxwell's shadow-themed minions (`shadowdancer`, `shadowworker`, `shadowprotector`, `shadowduelist`, `shadowlumber`, `shadowminer`, `shadowdigger`) and associated FX (`shadow_despawn`, builders). It centralizes entity initialization for shadow minions via the `MakeMinion` helper, configures components like `combat`, `health`, `follower`, `locomotor`, `health`, and sets up behavior hooks (e.g., retarget logic, health clamping for protectors, oblivion timers). It also supports legacy builder prefabs for summoning minions through the `MakeBuilder` mechanism.

## Usage example
```lua
-- Spawn a shadow protector at a given position
local protector = SpawnPrefab("shadowprotector")
if protector ~= nil then
    protector.Transform:SetPosition(x, y, z)
    protector.components.follower:FollowEntity(player)
end

-- Access leader-dependent behavior from a minion
local leader = minion.components.follower:GetLeader()
if leader ~= nil then
    print("Minion is following:", leader.prefab)
end
```

## Dependencies & tags
**Components used:** `skinner`, `locomotor`, `health`, `combat`, `follower`, `timer`, `knownlocations`, `entitytracker`, `lootdropper`, `petleash`, `minigame_participator`, `domesticatable`, `saltlicker`, `inventoryitem`, `inventory`, `burnable`, `heavyobstaclephysics`.

**Tags added/used:**  
- `scarytoprey`, `shadowminion`, `NOBLOCK`, `FX`, `NOCLICK`, `CLASSIFIED`, `playerghost`, `INLIMBO`, `companion`, `monster`, `prey`, `insect`, `hostile`, `character`, `animal`, `_combat`, `_health`, `dancing`.

## Properties
No public properties are exposed directly on the `shadowwaxwell` file itself. The prefabs it defines instantiate internal properties (e.g., `inst.despawnpetloot`, `inst.isprotector`, `inst._obliviatetask`) used during entity lifecycle.

## Main functions
### `MakeMinion(prefab, tool, hat, master_postinit)`
* **Description:** Main factory function to generate shadow minion prefabs with consistent setup. Applies default animations, tags, and components, then calls an optional `master_postinit` function for type-specific configuration.
* **Parameters:**  
  - `prefab` (string) – Name of the prefab to create (`"shadowdancer"`, `"shadowworker"`, `"shadowprotector"`, `"shadowlumber"`, `"shadowminer"`, `"shadowdigger"`, `"shadowduelist"`).  
  - `tool` (string or table of strings) – Animation symbol(s) for held tools (e.g., `"swap_axe"` or `{"swap_axe", "swap_pickaxe"}`).  
  - `hat` (string or `nil`) – Animation symbol name for hat override; `nil` hides default hats.  
  - `master_postinit` (function or `nil`) – Per-prefab post-initialization hook (e.g., `protectorfn`, `workerfn`).
* **Returns:** `Prefab` – A reusable prefab definition.
* **Error states:** None documented.

### `protectorfn(inst)`
* **Description:** Configures `shadowprotector` components: sets health/armor, speed, combat retarget/keep-target functions, spawns oblivion timer, tracks spawn point, and manages health clamping during combat engagement.
* **Parameters:** `inst` (Entity) – The minion instance being initialized.
* **Returns:** `nil`.
* **Key effects:**  
  - Registers listeners: `"newcombattarget"`, `"droppedtarget"`, `"attacked"`.  
  - Calls `MakeSpawnPointTracker` and `MakeOblivionSeeker`.

### `workerfn(inst)`
* **Description:** Sets up `shadowworker` with inventory, no-leashing behavior, and oblivion timer. Does *not* configure combat stats or retarget logic (combat is disabled via `nokeeptargetfn`).
* **Parameters:** `inst` (Entity)
* **Returns:** `nil`.

### `spearfn(inst)` *(deprecated)*
* **Description:** Legacy function used by `shadowduelist` for basic self-protecting minion behavior. Deprecated in favor of `protectorfn`.
* **Parameters:** `inst` (Entity)
* **Returns:** `inst`.

### `MakeBuilder(prefab)`
* **Description:** Creates a temporary builder entity that, when placed, uses `petleash` to spawn the specified minion prefab at a nearby valid location.
* **Parameters:** `prefab` (string) – Prefab name to spawn (e.g., `"shadowlumber"`).
* **Returns:** `Prefab` – The builder entity definition.
* **Key behavior:** Calls `FindWalkableOffset` to avoid holes and spawns via `builder.components.petleash:SpawnPetAt`.

### `GetSpawnPoint(inst)`
* **Description:** Retrieves the remembered spawn point (platform or absolute) for the minion.
* **Parameters:** `inst` (Entity)
* **Returns:** `Vector3` or `nil` – Position of spawn point in world space.

### `SaveSpawnPoint(inst, dont_overwrite)`
* **Description:** Records the current position as a spawn point (platform-local or world space) using `knownlocations` and `entitytracker`.
* **Parameters:**  
  - `inst` (Entity)  
  - `dont_overwrite` (boolean) – If `true`, only saves if no prior spawn point exists.
* **Returns:** `nil`.

### `OnSeekOblivion(inst)`
* **Description:** Handles obliteration of a minion by killing it or rescheduling based on invincibility.
* **Parameters:** `inst` (Entity)
* **Returns:** `nil`.

### `OnEntitySleep(inst)` / `OnEntityWake(inst)`
* **Description:** Manages delayed removal of sleeping minions via `_obliviatetask`.
* **Parameters:** `inst` (Entity)
* **Returns:** `nil`.

### `DropAggro(inst)`
* **Description:** Pushes `"transfercombattarget"` event to drop current target if leader is dead, hiding, too far, invisible, or a ghost.
* **Parameters:** `inst` (Entity)
* **Returns:** `nil`.

### `protector_updatehealthclamp(inst)`
* **Description:** Incrementally increases the per-hit health clamp threshold during sustained combat for `shadowprotector`.
* **Parameters:** `inst` (Entity)
* **Returns:** `nil`.

### `protector_attacked(inst, data)`
* **Description:** Resets health clamp on damage received and reactivates health clamp increment task.
* **Parameters:**  
  - `inst` (Entity)  
  - `data` (table) – Attack event data containing `damage` (number).
* **Returns:** `nil`.

### `TryRipple(inst, map)`
* **Description:** Generates water ripples when the minion moves across ocean tiles (client-side FX only).
* **Parameters:**  
  - `inst` (Entity)  
  - `map` (Map)
* **Returns:** `nil`.

## Events & listeners
- **Listens to:**  
  - `"attacked"` – Triggers `OnAttacked` and `protector_attacked` (for protectors).  
  - `"seekoblivion"` – Calls `OnSeekOblivion`.  
  - `"death"` – Calls `DropAggro`.  
  - `"dancingplayerdata"` – Updates internal dance state via `OnDancingPlayerData`.  
  - `"newcombattarget"` – Initiates health clamp increment (protector).  
  - `"droppedtarget"` – Resets health clamp after combat engagement ends (protector).  
  - `"animover"` – Triggers `"despawn_fx"` removal or `"ripple"` cleanup.  
  - `"timerdone"` – Calls `OnTimerDone` (for oblivion timer).
- **Pushes:**  
  - `"transfercombattarget"` – With leader as payload to reassign combat target.  
  - `"loot_prefab_spawned"` – From `lootdropper:SpawnLootPrefab`.
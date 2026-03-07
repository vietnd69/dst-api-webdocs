---
id: houndmound
title: Houndmound
description: A structure that spawns hounds periodically and releases them upon damage or death; it also haunts players under certain conditions.
tags: [structure, spawner, combat, hound]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3c90eff5
system_scope: world
---

# Houndmound

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`houndmound` is a passive structure prefab that spawns hounds (standard, ice, or fire variants) over time and releases them when damaged or killed. It integrates with several core components: `childspawner` for periodic and emergency hound release, `combat` to respond to attacks by spawning defenders, `lootdropper` for item rewards, and `hauntable` to trigger aggressive responses during player haunting attempts. It also responds to world season changes and sleep/wake states.

## Usage example
```lua
-- Typical usage: The prefab is instantiated via the game's prefab system.
-- Modders should not manually construct it but can extend or override its behavior:
local inst = Prefab("houndmound", fn, assets, prefabs)
-- or inspect/modify its components post-creation:
inst.components.childspawner:SetSpawnPeriod(60) -- slower hound release
inst.components.childspawner:SetMaxChildren(5)   -- more hounds in reserve
```

## Dependencies & tags
**Components used:** `health`, `childspawner`, `lootdropper`, `combat`, `hauntable`, `inspectable`  
**Tags added:** `structure`, `beaverchewable`, `houndmound`

## Properties
No public properties exposed beyond the standard `ChildSpawner`, `Combat`, `Health`, `LootDropper`, and `Hauntable` interfaces.

## Main functions
### `OnKilled(inst)`
*   **Description:** Called when the houndmound dies. Releases all remaining hounds and drops loot.
*   **Parameters:** `inst` (Entity) - the houndmound instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `SpawnGuardHound(inst, attacker)`
*   **Description:** Spawns one defensive hound (type depends on season and special chance) in response to an attack. Sets the new hound to target the attacker and grants brief attack immunity.
*   **Parameters:**  
    - `inst` (Entity) - the houndmound instance.  
    - `attacker` (Entity or nil) - the entity that attacked the houndmound.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the houndmound is dead; spawning may fail silently.

### `SpawnAllGuards(inst, attacker)`
*   **Description:** Releases *all* currently reserved hounds in response to damage (e.g., on hit).
*   **Parameters:**  
    - `inst` (Entity) - the houndmound instance.  
    - `attacker` (Entity) - the entity that damaged the houndmound.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the houndmound is dead or has no `childspawner`.

### `OnHaunt(inst)`
*   **Description:** Handles player haunting attempts. If the haunt succeeds, releases all hounds against the haunter.
*   **Parameters:** `inst` (Entity) - the houndmound instance.
*   **Returns:** `true` if hounds were spawned against a valid target; `false` otherwise.
*   **Error states:** Returns `false` if spawning is blocked (no room, dead, or random chance).

### `OnSeasonChange(inst, season)`
*   **Description:** Adjusts the rare child spawn chance based on the current season (spring/winter → icehound; summer → firehound).
*   **Parameters:**  
    - `inst` (Entity) - the houndmound instance.  
    - `season` (string) - current world season (`"winter"`, `"summer"`, `"spring"`, `"fall"`).
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Called when the world wakes up. Starts spawning hounds and plays loop sound.
*   **Parameters:** `inst` (Entity) - the houndmound instance.
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Called when the world sleeps. Stops loop sound.
*   **Parameters:** `inst` (Entity) - the houndmound instance.
*   **Returns:** Nothing.

### `OnPreLoad(inst, data)`
*   **Description:** Called during savegame load to restore world settings–controlled parameters.
*   **Parameters:**  
    - `inst` (Entity) - the houndmound instance.  
    - `data` (table) - saved state data (used by `WorldSettings_ChildSpawner_*` helpers).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `death` - triggers `OnKilled`.
- **Pushes:** None directly; interacts indirectly via component events (`childspawner`, `lootdropper`).
- **World state watches:** `"season"` - triggers `OnSeasonChange` when season changes.

## Loot table
The `hound_mound` loot table contains:
- `houndstooth` (x3)
- `boneshard` (x2)
- `redgem` (1%)
- `bluegem` (1%)
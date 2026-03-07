---
id: wasphive
title: Wasphive
description: A hive-like structure that periodically spawns killer bees and reacts to nearby players and attacks by releasing aggressive wasps.
tags: [combat, spawner, structure, enemy]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 92326582
system_scope: entity
---

# Wasphive

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wasphive` is a prefabricated structure entity that functions as an aggressive, AI-controlled spawner of `killerbee` enemies. It integrates multiple components to manage health, spawning behavior, player proximity detection, combat interaction, burning, and hauntable properties. It serves as a environmental hazard that dynamically responds to player presence, damage, and hauntings by releasing waves of bees under configurable tuning parameters.

## Usage example
The `wasphive` prefab is instantiated automatically by the world generation system and should not be manually created by modders. However, modders can customize its behavior by modifying the underlying tuning values (e.g., `TUNING.WASPHIVE_WASPS`, `TUNING.WASPHIVE_ENABLED`) or by overriding its prefab function.

```lua
-- Not intended for direct use in mod code — created by worldgen
-- Example of how it behaves once spawned:
-- - Periodically spawns killer bees based on WASPHIVE_RELEASE_TIME
-- - Releases bees on player proximity within 10–13 units
-- - Releases bees when attacked
-- - Can be haunted by ghosts (per HAUNT_MEDIUM value) to trigger bee release
```

## Dependencies & tags
**Components used:**  
`health`, `childspawner`, `lootdropper`, `burnable`, `playerprox`, `combat`, `hauntable`, `inspectable`

**Tags:**  
- Added: `structure`, `hive`, `WORM_DANGER`  
- Checked: `character`, `animal`, `monster`, `insect`, `playerghost`, `INLIMBO`, `_combat`, `burnt`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.health` | Health | — | Entity health manager; max health `250`. |
| `inst.components.childspawner` | ChildSpawner | — | Manages bee spawning; includes regen and spawn periods, max children, emergency spawn logic. |
| `inst.components.lootdropper` | LootDropper | — | Drops `honey` ×4 and `honeycomb` upon destruction. |
| `inst.components.burnable` | Burnable | — | Enables burning; triggers `OnIgnite` to release all bees. |
| `inst.components.playerprox` | PlayerProx | — | Detects players within 10–13 units; triggers bee release via `onnear`. |
| `inst.components.combat` | Combat | — | Handles hits; triggers bee release via `onhitbyplayer`. |
| `inst.components.hauntable` | Hauntable | — | Haunt value `TUNING.HAUNT_MEDIUM`; triggers bee release via `OnHaunt`. |

## Main functions
### `OnIgnite(inst)`
*   **Description:** Callback invoked when the hive catches fire. Releases all pending bees (even those not yet spawned), stops the hive’s looping sound, and calls `DefaultBurnFn`.
*   **Parameters:** `inst` (Entity) — the hive entity.
*   **Returns:** Nothing.

### `OnKilled(inst)`
*   **Description:** Executed when the hive is destroyed (health reaches zero). Removes the `childspawner` component, switches to dead animation, removes physics colliders, stops looping sound, plays destruction sound, and drops loot.
*   **Parameters:** `inst` (Entity) — the hive entity.
*   **Returns:** Nothing.

### `onnear(inst, target)`
*   **Description:** Triggered when a player enters the hive’s proximity zone. Unless the player has the `"wormwood_bugs"` skill activated, releases bees targeting the player.
*   **Parameters:**  
    - `inst` (Entity) — the hive entity.  
    - `target` (Entity) — the player who entered proximity.  
*   **Returns:** Nothing.

### `onhitbyplayer(inst, attacker, damage)`
*   **Description:** Triggered when the hive is hit in combat. Releases bees targeting the attacker, plays hit sound, and plays hit animation followed by the default small animation.
*   **Parameters:**  
    - `inst` (Entity) — the hive entity.  
    - `attacker` (Entity) — the entity that hit the hive.  
    - `damage` (number) — damage amount (unused).  
*   **Returns:** Nothing.

### `OnHaunt(inst)`
*   **Description:** Called when the hive is haunted by a ghost. Attempts to find a valid target (`character`, `animal`, or `monster`, not `insect`, `playerghost`, or `INLIMBO`) within 25 units that the hive can target. If found and a random roll succeeds (≤ `HAUNT_CHANCE_HALF`), triggers `onhitbyplayer` and returns `true`.
*   **Parameters:** `inst` (Entity) — the hive entity.
*   **Returns:** `true` if bees were successfully released; `false` otherwise.

### `OnPreLoad(inst, data)`
*   **Description:** Lifecycle hook invoked during prefab loading from saved world data. Applies world-settings-driven overrides for spawner periods via `WorldSettings_ChildSpawner_PreLoad`.
*   **Parameters:**  
    - `inst` (Entity) — the hive entity.  
    - `data` (table) — saved world data.  
*   **Returns:** Nothing.

### `fn()`
*   **Description:** Prefab constructor. Initializes all components, animations, sounds, tags, physics, and default behaviors. Runs separately on master (server) and client.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — fully configured hive entity.
*   **Error states:** On clients, returns early after setting up transform, anim state, sound emitter, minimap, and network components; server-side logic runs only on `ismastersim`.

## Events & listeners
- **Listens to:**  
  - `death` — triggers `OnKilled`.
- **Pushes:**  
  - None directly (uses `inst:PushEvent` indirectly through components like `lootdropper`).

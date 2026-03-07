---
id: stalker_minions
title: Stalker Minions
description: A factory that generates stalker minion prefabs with lifecycle management, stalker tracking, and environment interaction logic.
tags: [ai, boss, combat, entity, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8baf4249
system_scope: entity
---

# Stalker Minions

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`stalker_minions` is a prefab factory script that dynamically creates three distinct minion variants (`stalker_minion1`, `stalker_minion2`, and a fallback `stalker_minion`). These minions are summoned by the Stalker boss and feature a fixed lifespan, stalker dependency tracking, environmental destructiveness, and health protection against non-Stalker or earthquake debris sources. The script configures core components (health, combat, sanity aura, locomotion, workable interaction) and integrates with the Stalker's lifecycle events (e.g., death, feeding).

## Usage example
```lua
-- Typical instantiation by the Stalker boss
local minion1 = SpawnPrefab("stalker_minion1")
if minion1 ~= nil then
    minion1.components.entitytracker:TrackEntity("stalker", stalker_inst)
    minion1.OnSpawnedBy(minion1, stalker_inst)
end
```

## Dependencies & tags
**Components used:** `combat`, `entitytracker`, `health`, `locomotor`, `sanityaura`, `timer`, `workable`, `inspectable`.  
**Tags added:** `monster`, `hostile`, `stalkerminion`, `fossil`.  
**Tags checked:** `player`, `stalker`, `quakedebris`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `MINIONS` | table | (see code) | Static configuration table defining minion variants with names, animation banks, builds, timing, and speed. |
| `recentlycharged` | table | `{}` | Tracks recently damaged workable entities to prevent spam-destruct. Keys are entity instances; values are `true`. |

## Main functions
### `MakeMinion(name, data, prefabs)`
*   **Description:** Creates and returns a prefab definition for a stalker minion. If `data` is `nil`, it randomly selects a variant from `MINIONS` and uses a shared fallback prefab name. This function sets up all components, tags, animations, state graph, brain, and event callbacks.
*   **Parameters:** `name` (string) - prefab identifier; `data` (table or `nil`) - variant-specific override configuration; `prefabs` (table or `nil`) - list of required child prefabs for dependencies.
*   **Returns:** Prefab (table) - The configured prefab definition ready for return from `return unpack(ret)`.

### `OnSpawnedBy(inst, stalker)`
*   **Description:** Attaches a new Stalker entity as the minion's tracked target, updates facing, and initiates the `emerge` state. Handles replacement of an existing Stalker tracker cleanly.
*   **Parameters:** `inst` (Entity) - The minion instance; `stalker` (Entity) - The Stalker instance to track.
*   **Returns:** Nothing.
*   **Error states:** Safely ignores duplicate or stale tracker updates via `ForgetEntity`/`TrackEntity` guards.

### `OnDeath(inst)`
*   **Description:** Notifies the tracked Stalker of the minion's death via a `"miniondeath"` event.
*   **Parameters:** `inst` (Entity) - The dying minion.
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Handles the `"selfdestruct"` timer expiration. If the minion is within range and the Stalker is feasting, it re-arms the timer. Otherwise, it kills the minion or removes it if it is asleep.
*   **Parameters:** `inst` (Entity) - The minion; `data` (table) - Event payload, expected to contain `{ name = "selfdestruct" }`.
*   **Returns:** Nothing.

### `OnDecay(inst)`
*   **Description:** Called after 10 seconds of inactivity (entity sleep). Kills the minion, notifies the Stalker, and optionally heals the Stalker if conditions (near Atrium, feasting) are met.
*   **Parameters:** `inst` (Entity) - The sleeping minion.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the minion is already dead.

### `OnCollide(inst, other)`
*   **Description:** Handles collision with workable structures. Schedules a `2 * FRAMES` delay before calling `OnDestroyOther`, unless the entity was recently charged.
*   **Parameters:** `inst` (Entity) - The minion; `other` (Entity) - The collided entity.
*   **Returns:** Nothing.

### `OnDestroyOther(inst, other)`
*   **Description:** Destroys the target workable entity (excluding `DIG` and `NET` actions) and spawns a `"collapse_small"` FX. Records the target in `recentlycharged` to prevent re-destruction within 3 seconds.
*   **Parameters:** `inst` (Entity) - The minion; `other` (Entity) - The target workable entity.
*   **Returns:** Nothing.

### `ClearRecentlyCharged(inst, other)`
*   **Description:** Helper callback to clear an entry in `recentlycharged` after 3 seconds.
*   **Parameters:** `inst` (Entity) - The minion; `other` (Entity) - The tracked entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"timerdone"` - triggers `OnTimerDone`.
- **Pushes:** `"miniondeath"` - fired on death and decay to notify the Stalker.
- **Callback listeners registered via `inst:ListenForEvent`:** `"death"` (via `OnDeath`); `"death"` (via `inst._onstalkerdeath`) to track Stalker death.
- **Callbacks set via `inst.OnEntitySleep` / `inst.OnEntityWake`:** `OnEntitySleep` schedules decay; `OnEntityWake` cancels it.
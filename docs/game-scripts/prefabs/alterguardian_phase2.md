---
id: alterguardian_phase2
title: Alterguardian Phase2
description: Implements the Phase 2 stage of the Alter Guardian boss, handling movement, combat, spawning spikes, music triggering, health regeneration on waking, and loot drops.
tags: [combat, boss, ai, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d1c40e8b
system_scope: world
---

# Alterguardian Phase2

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `alterguardian_phase2` prefab represents the second transformation stage of the Alter Guardian boss in DST. It functions as a combat-capable entity that dynamically spawns ring-shaped spike projectiles in patterns, interacts with players and monsters via its combat system, manages ambient music triggers based on player proximity, and regenerates health over time when the world sleeps. It transitions to Phase 3 upon receiving a `phasetransition` event. The prefab is instantiated through a constructor function `fn()` and relies heavily on external components for health, combat, locomotion, and AI behavior.

## Usage example
This prefab is not typically created directly by modders but is spawned internally during the boss encounter:
```lua
local phase2 = SpawnPrefab("alterguardian_phase2")
phase2.Transform:SetPosition(x, y, z)
phase2.sg:GoToState("idle")
```
Modders may interact with its public methods:
```lua
-- Force a spike attack
phase2.DoSpikeAttack()

-- Disable ambient music
phase2:SetNoMusic(true)
```

## Dependencies & tags
**Components used:** `locomotor`, `health`, `combat`, `explosiveresist`, `sanityaura`, `lootdropper`, `inspectable`, `knownlocations`, `timer`, `teleportedoverride`, `drownable`, `hauntable`.  
**Tags added:** `"brightmareboss"`, `"epic"`, `"hostile"`, `"largecreature"`, `"mech"`, `"monster"`, `"noepicmusic"`, `"scarytoprey"`, `"soulless"`, `"lunar_aligned"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `DoSpikeAttack` | function | `nil` | Public method reference to trigger the spike attack sequence. |
| `SetNoMusic` | function | `nil` | Public method reference to toggle music presence via tag. |
| `_musicdirty` | net_event | `nil` | Network event used to sync music state across clients. |
| `_playingmusic` | boolean | `false` | Tracks whether music is currently playing for this instance. |
| `_musictask` | task | `nil` | Periodic task responsible for updating music state. |
| `_loot_dropped` | boolean | `nil` | Flag used during save/load to prevent duplicate loot drops. |
| `_start_sleep_time` | number | `nil` | Timestamp used to calculate health gained while sleeping. |

## Main functions
### `do_spike_attack(inst)`
*   **Description:** Spawns a randomized number of spike trails (`alterguardian_phase2spiketrail`) around the boss within a configurable range. Prioritizes nearby players, then other targetable entities, and finally picks random angles if needed.
*   **Parameters:** `inst` (Entity) — the boss instance performing the attack.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `data` is `nil` or no valid targets are found.

### `Retarget(inst)`
*   **Description:** Searches for a new combat target within a fixed radius, checking for valid tags and combat compatibility.
*   **Parameters:** `inst` (Entity) — the boss instance.
*   **Returns:** `target` (Entity or `nil`) — the first valid target found; `true` if a valid target was found (used by `combat` retarget logic).
*   **Error states:** Returns `nil` only if no suitable target is found in range.

### `KeepTarget(inst, target)`
*   **Description:** Determines if the boss should maintain focus on a given target based on validity and distance.
*   **Parameters:** `inst` (Entity), `target` (Entity) — the current target.
*   **Returns:** `true` if the target is still valid and within `MAX_CHASEAWAY_DIST_SQ`; otherwise `false`.
*   **Error states:** Returns `false` if `CanTarget` fails or the target is too far.

### `SetNoMusic(inst, val)`
*   **Description:** Adds or removes the `"nomusic"` tag and triggers a music dirty event to resynchronize music state.
*   **Parameters:** `val` (boolean) — if `true`, disables music; otherwise enables it.
*   **Returns:** Nothing.

### `teleport_override_fn(inst)`
*   **Description:** Calculates a valid teleport destination using walkable offsets near the current position.
*   **Parameters:** `inst` (Entity) — the boss instance teleporting.
*   **Returns:** `Vector3` — the new position if a walkable offset is found; otherwise falls back to current position.
*   **Error states:** May return the original position if no offset succeeds.

### `gain_sleep_health(inst)`
*   **Description:** Gradually restores health while the world is sleeping, up to `ALTERGUARDIAN_PHASE2_MAXHEALTH`.
*   **Parameters:** `inst` (Entity) — the boss instance.
*   **Returns:** Nothing.
*   **Error states:** Resets `_start_sleep_time` in `OnEntityWake`; no health gain occurs if called outside a sleep period.

## Events & listeners
- **Listens to:**  
  - `"phasetransition"` → `OnPhaseTransition` — triggers transition to Phase 3.  
  - `"attacked"` → `OnAttacked` — suggests the attacker as a new combat target.  
  - `"musicdirty"` → `OnMusicDirty` (client only) — refreshes music task and state.  
- **Pushes:** None directly (uses `inst:PushEvent` only in connected components or state graph).
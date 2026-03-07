---
id: archive_centipede
title: Archive Centipede
description: Manages the behavior, state, and lifecycle of the Archive Centipede boss entity, including health-based animation transitions, retargeting logic, target sharing, and interaction with the environment via collision and spawning.
tags: [combat, ai, boss]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cec68d4c
system_scope: entity
---

# Archive Centipede

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`archive_centipede` defines the prefab and logic for the Archive Centipede boss in DST. It integrates multiple components to handle combat behavior (retargeting, target sharing, attacks), sleep/wake states, dynamic lighting (including fading transitions), and health-driven animation state changes. The entity is part of the Grotto biome event system and interacts with the `SGcentipede` stategraph and `centipedebrain`. It spawns a husk when killed and supports health regeneration.

## Usage example
```lua
-- Typical usage occurs internally when the Archive Centipede is spawned as a boss
local centipede = SpawnPrefab("archive_centipede")
-- This automatically initializes all components (health, combat, sleeper, etc.)
-- Modders typically interact via the instance's components after spawning:
centipede.components.health:SetMaxHealth(100)
centipede.components.combat:SetDefaultDamage(25)
```

## Dependencies & tags
**Components used:** `locomotor`, `drownable`, `sleeper`, `health`, `combat`, `lootdropper`, `inspectable`, `knownlocations`, `follower`, `burnable`, `freezable`, `workable`, `hauntable`
**Tags:** Adds `monster`, `hostile`, `soulless`, `mech`, `archive_centipede`, `electricdamageimmune`; removes `gestalt_possessable` at mid/low health; adds `gestalt_possessable` at full/medium health.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `widthscale` | number | `1` | Scales the radius of the centipede's light source. |
| `_endlight` | table | `light_params.off` | Target light parameters for fading animations. |
| `_startlight` | table | `{}` | Source light parameters used during interpolation. |
| `_currentlight` | table | `{}` | Intermediate light parameters during fade transitions. |
| `_lighttask` | DoTask | `nil` | Periodic task driving light interpolation. |
| `recentlycharged` | table | `{}` | Tracks entities recently impacted by collision-based charging to avoid repeated hits. |
| `idle2task` | DoTask | `nil` | Periodic task for secondary idle animation sound. |
| `scrapbook_removedeps` | table | `{"gears"}` | Dependencies removed when this entity is destroyed in scrapbook. |
| `MED_THRESHOLD_DOWN` | number | `0.66` | Health percentage threshold for changing to medium animation state on damage. |
| `LOW_THRESHOLD_DOWN` | number | `0.33` | Health percentage threshold for changing to low animation state on damage. |
| `BOTTOM_THRESHOLD` | number | `0.2` | Health percentage below which combat component is removed. |
| `MED_THRESHOLD_UP` | number | `0.66` | Health percentage threshold for upgrading to medium animation state on healing. |
| `LOW_THRESHOLD_UP` | number | `0.33` | Health percentage threshold for upgrading from low to medium animation state on healing. |
| `p` | string | `""` | Empty placeholder (intended for internal state? Not used meaningfully). |
| `kind` | string | `""` | Placeholder used by some prefabs but unused here. |
| `idle2task` | DoTask | `nil` | Task scheduled to trigger secondary idle sound. |
| `MED_THRESHOLD_DOWN` | number | `0.66` | Threshold for health-damage animation changes. |
| `LOW_THRESHOLD_DOWN` | number | `0.33` | Threshold for health-damage animation changes. |
| `BOTTOM_THRESHOLD` | number | `0.2` | Health threshold below which combat is disabled. |

## Main functions
### `fn_common(tag)`
* **Description:** Constructor function that creates and configures a new Archive Centipede entity. Called by both `fn()` (full centipede) and `huskfn()` (husk variant). Handles lighting, physics, components, and event listeners.
* **Parameters:** `tag` (string) — unused parameter; present to satisfy common prefab patterns but not applied.
* **Returns:** `inst` (Entity) — fully initialized entity instance.
* **Error states:** None — construction is synchronous and safe.

### `Retarget(inst)`
* **Description:** Calculates and returns a valid new combat target for the centipede based on proximity, follower state, and entity tags. Respects leader following logic and avoids attacking teammates.
* **Parameters:** `inst` (Entity) — the centipede instance.
* **Returns:** `target` (Entity or `nil`) — valid target entity or `nil` if none found.
* **Error states:** Returns `nil` if no target satisfies filters, or if centipede is far from its remembered "home" location and lacks a leader.

### `KeepTarget(inst, target)`
* **Description:** Predicate function that determines whether the centipede should retain its current combat target. Ensures the target remains within acceptable chase distance from the centipede's "home" or if the centipede has an active leader.
* **Parameters:** `inst` (Entity), `target` (Entity) — current target.
* **Returns:** `boolean` — `true` if target should be kept, otherwise `false`.
* **Error states:** None — always returns a boolean.

### `OnHealthDelta(inst, oldpercent, newpercent)`
* **Description:** Event listener handler for health percentage changes. Triggers animation transitions (e.g., `low_to_med`, `med_to_full`) and adds/removes the `gestalt_possessable` tag. Disables the `combat` component if health falls below `BOTTOM_THRESHOLD`.
* **Parameters:** `inst` (Entity), `oldpercent` (number), `newpercent` (number) — current and previous health percentages.
* **Returns:** Nothing.
* **Error states:** Ensures `combat` component is removed below `BOTTOM_THRESHOLD`; clamps health at `BOTTOM_THRESHOLD - 0.05` if it drops further.

### `OnAttacked(inst, data)`
* **Description:** Handles receiving an attack — sets attacker as the new combat target and shares aggro with nearby allies via `ShareTarget`.
* **Parameters:** `inst` (Entity), `data` (table or `nil`) — event payload; expects `data.attacker` if present.
* **Returns:** Nothing.
* **Error states:** Silently returns if the attacker is another `archive_centipede` to prevent friendly fire.

### `ShouldWake(inst)`
* **Description:** Predicate for waking up the centipede from sleep. Returns `true` if centipede is far from home or exposed to threats (combat, burn, freeze, or nearby characters).
* **Parameters:** `inst` (Entity).
* **Returns:** `boolean`.
* **Error states:** None.

### `ShouldSleep(inst)`
* **Description:** Predicate for allowing the centipede to fall asleep. Returns `true` if centipede is near home, no threats are present, and it's not already awake.
* **Parameters:** `inst` (Entity).
* **Returns:** `boolean`.
* **Error states:** None.

### `RememberKnownLocation(inst)`
* **Description:** Saves the centipede’s current position as the `"home"` location using the `knownlocations` component.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `beginfade(inst)`
* **Description:** Initializes a lighting fade transition between current and target light parameters. Starts the periodic `_lighttask` to interpolate.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnUpdateLight(inst, dt)`
* **Description:** Periodic callback for lighting interpolation. Updates light radius, intensity, and color using lerped parameters, and syncs to the animation state's light override.
* **Parameters:** `inst` (Entity), `dt` (number) — delta time since last frame.
* **Returns:** Nothing.

### `oncollide(inst, other)`
* **Description:** Physics collision callback. Triggers a camera shake and schedules a delayed call to `onothercollide` to prevent repeated hits on the same target.
* **Parameters:** `inst` (Entity), `other` (Entity) — the colliding entity.
* **Returns:** Nothing.

### `onothercollide(inst, other)`
* **Description:** Handles post-collision effects: kills `smashable` entities, destroys `workable` objects (except `NET`), spawns collapse FX, and deals combat damage to walls/structures.
* **Parameters:** `inst` (Entity), `other` (Entity).
* **Returns:** Nothing.

### `playidle2(inst)`
* **Description:** Plays a secondary idle sound and animation (`idle2_*`) based on current health percentage. Schedules a recursive call for periodic re-triggering.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` — triggers combat targeting and ally aggro sharing via `OnAttacked`.
- **Listens to:** `animover` — handles spawning `archive_centipede_husk` on death animation completion.
- **Listens to:** `possess` — handles power point possession logic, respawning as a fresh centipede.
- **Pushes:** None — does not directly push custom events.
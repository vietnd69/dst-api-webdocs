---
id: fossil_spike
title: Fossil Spike
description: A seasonal ground spike prefab that erupts from the ground, damages or destroys nearby targets, and then deactivates after a delay.
tags: [combat, environment, seasonal, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 394e03c5
system_scope: environment
---

# Fossil Spike

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fossil_spike` is a seasonal ground-based combat entity that erupts from the ground, performs area-of-effect actions (damaging, destroying, or tossing entities), then deactivates and disappears after a fixed duration. It is used in high-stakes combat scenarios (e.g., seasonal bosses) and works with the `combat`, `workable`, `pickable`, `health`, `mine`, and `inventoryitem` components. Two prefabs are defined: `fossilspike` (the primary erupting spike) and `fossilspike_base` (the static base visual).

## Usage example
```lua
-- The fossil_spike prefab is automatically instantiated during seasonal events like the Boss Battle.
-- To manually trigger it (e.g., in a mod), use:
local spike = SpawnPrefab("fossilspike")
spike.Transform:SetPosition(x, y, z)

-- To programmatically restart or kill the spike:
spike.RestartSpike(delay, duration, variation)  -- delay: optional delay before next spike
spike.KillSpike()                               -- immediately kill and deactivate
```

## Dependencies & tags
**Components used:** `combat`
**Tags:** Adds `notarget`, `groundspike`, `fossilspike` (to main entity); adds `FX`, `NOCLICK` (to base entity).

## Properties
No public properties are defined. The component exposes a `RestartSpike` and `KillSpike` function on the instance for runtime control.

## Main functions
### `StartSpike(inst, duration, variation)`
*   **Description:** Initiates the active phase of the spike: sets up a delayed self-destruction timer, plays the eruption animation, spawns the base FX, emits sound, and executes a single `DoDamage` call. Typically called by `RestartSpike` or the initial constructor task.
*   **Parameters:**
    *   `inst` (Entity) — the fossil spike instance.
    *   `duration` (number) — time in seconds before the spike is automatically killed.
    *   `variation` (number) — specifies which animation variant to use (1–7).
*   **Returns:** Nothing.
*   **Error states:** None.

### `RestartSpike(inst, delay, duration, variation)`
*   **Description:** Cancels any existing scheduled `KillSpike` task and schedules a new `StartSpike` call after the given delay. Handles rounding of `variation` to valid range `1..NUM_VARIATIONS`.
*   **Parameters:**
    *   `inst` (Entity) — the fossil spike instance.
    *   `delay` (number or nil) — delay before restarting; if `nil`, restarts immediately (`0` seconds).
    *   `duration` (number) — duration of the next active phase.
    *   `variation` (number or nil) — desired animation variation. If `nil`, a random variation is selected.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `inst.task` is `nil`.

### `KillSpike(inst)`
*   **Description:** Deactivates and begins removal of the spike. Plays a post-destruction base animation (`base_pstN`), schedules final removal, and prevents multiple kills via the `killed` flag.
*   **Parameters:** `inst` (Entity) — the fossil spike instance.
*   **Returns:** Nothing.
*   **Error states:** No-op if already killed (`inst.killed == true`) or `basefx` is invalid.

### `DoDamage(inst)`
*   **Description:** Performs area-of-effect logic within a small radius. Interacts with nearby entities based on component presence and tags:
    *   Destroys `workable` objects (e.g., campfires, rabbit holes) if valid.
    *   Picks `pickable` objects unless they have the `intense` tag.
    *   Kills or attacks valid combat targets depending on locomotor and `epic` tags.
    *   Tosses inventory items and deactivates mines.
*   **Parameters:** `inst` (Entity) — the fossil spike instance.
*   **Returns:** Nothing.
*   **Error states:** Skips invalid or dead targets.

### `SpikeLaunch(inst, launcher, basespeed, startheight, startradius)`
*   **Description:** Applies physics velocity to an entity (e.g., an item) to "launch" it away from the spike's center in a random arc. Used to toss item loot.
*   **Parameters:**
    *   `inst` (Entity) — the entity to launch (typically an item).
    *   `launcher` (Entity) — the spike that is launching the item (used as origin).
    *   `basespeed` (number) — base horizontal speed.
    *   `startheight` (number) — vertical start height.
    *   `startradius` (number) — max radial offset from origin.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `ChangeToObstacle` to convert the spike from an active projectile to a static obstacle after animation completes.
- **Pushes:** None directly, but relies on external events like `picked`, `destroyed`, and `death` triggered by associated component methods.
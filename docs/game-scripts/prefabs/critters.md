---
id: critters
title: Critters
description: A factory system for creating companion critters with AI, hunger mechanics, sleeping behavior, and optional special abilities.
tags: [ai, companion, hunger, sleep, prefabs]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2dfb43e6
system_scope: entity
---

# Critters

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `critters.lua` file implements a factory pattern for constructing critter companions (e.g., lamb, puppy, glomling) in DST. It defines shared logic for their behavior, including hunger-based perish mechanics, leader-following with sleep-aware wake/sleep states, eating feedback, and optional special powers (e.g., Lunar Moth light effects). Critters integrate with multiple components: `follower`, `sleeper`, `eater`, `perishable`, `locomotor`, `crittertraits`, and `petleash`. Builder prefabs are also provided for spawning critters via build mode.

## Usage example
```lua
-- To create a new critter using the provided factory:
local my_critter_prefab = MakeCritter(
    "my_critter",
    "my_critter_anim",
    4,                         -- 4-faced rotation
    { FOODGROUP.OMNI },       -- diet
    false,                     -- not flying
    {                          -- data table
        favoritefood = "bacon",
        allow_platform_hopping = true,
        flyingsoundloop = "my_sound_loop",
        special_powers_fn = my_special_powers_fn,
        playmatetags = {"my_tag"}
    }
)

-- To create a builder for spawning the critter in build mode:
local my_builder_prefab = MakeBuilder("my_critter")
```

## Dependencies & tags
**Components used:** `spawnfader`, `inspectable`, `follower`, `knownlocations`, `sleeper`, `eater`, `perishable`, `locomotor`, `embarker`, `drownable`, `crittertraits`, `timer`, `spell`, `petleash`.

**Tags:** `critter`, `companion`, `notraptrigger`, `noauradamage`, `small_livestock`, `NOBLOCK`, `flying` (conditional), `ignorewalkableplatformdrowning` (conditional), `CLASSIFIED` (builder only).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `WAKE_TO_FOLLOW_DISTANCE` | number | `6` | Distance threshold to wake up and follow leader if too far. |
| `SLEEP_NEAR_LEADER_DISTANCE` | number | `5` | Distance threshold to fall asleep if near sleeping leader. |
| `HUNGRY_PERISH_PERCENT` | number | `0.5` | Perish threshold below which critter is considered hungry (used for behavior and light state). |
| `STARVING_PERISH_PERCENT` | number | `0.2` | Perish threshold below which critter is starving (spoilage state). |
| `pettype` | string | `nil` | (Builder-only) Prefab name of the critter this builder spawns. |
| `_special_powers` | table | `nil` | (Optional) Stores persistent special ability data (e.g., buff light prefab). |

## Main functions
### `MakeCritter(name, animname, face, diet, flying, data, prefabs)`
*   **Description:** Factory function that constructs and returns a Prefab definition for a critter companion. Handles asset loading, entity setup, component initialization, brain assignment, and state graph binding.
*   **Parameters:**
    *   `name` (string) - Unique identifier for the prefab (e.g., `"critter_puppy"`).
    *   `animname` (string) - Base name for animation bank (e.g., `"pupington"`).
    *   `face` (number) - Number of facing directions (`2`, `4`, `6`, or `8`).
    *   `diet` (table) - Food groups the critter can eat (e.g., `{ FOODGROUP.OMNI }`).
    *   `flying` (boolean) - Whether the critter flies (affects physics and pathfinding).
    *   `data` (table, optional) - Customization table with optional keys: `buildname`, `favoritefood`, `allow_platform_hopping`, `flyingsoundloop`, `common_postinit`, `master_postinit`, `playmatetags`, `special_powers_fn`.
    *   `prefabs` (table, optional) - List of required prefabs for this critter.
*   **Returns:** `Prefab` — A prefabricated entity definition ready for use in the game.
*   **Error states:** No explicit error handling; relies on calling functions and component validations.

### `MakeBuilder(prefab)`
*   **Description:** Factory function that creates a builder prefab used in Build Mode to spawn critters. The builder is non-networked, auto-removes itself if unused, and delegates spawning to `PetLeash:SpawnPetAt`.
*   **Parameters:**
    *   `prefab` (string) - Name of the critter prefab this builder spawns (e.g., `"critter_lamb"`).
*   **Returns:** `Prefab` — A non-persistent builder entity definition.

### `oneat(inst, food)`
*   **Description:** Eating callback that adjusts the critter’s maximum hunger duration based on current perish percentage (well-fed, hungry, or starving) and dominant trait status.
*   **Parameters:**
    *   `inst` (Entity) — The critter entity.
    *   `food` (Entity) — The food item consumed.
*   **Returns:** Nothing.
*   **Side effects:** Updates `inst.components.perishable.perishtime` and resets perish percent to `1.0`, restarting the perish timer.

### `GetPeepChance(inst)`
*   **Description:** Returns probability that the critter will emit a peep sound based on hunger level.
*   **Parameters:**
    *   `inst` (Entity) — The critter entity.
*   **Returns:** `number` — Probability between `0.0` and `0.8`.
*   **Logic:** Higher chance when hungry (≤ `STARVING_PERISH_PERCENT`); none if well-fed.

### `OnSave(inst, data)`
*   **Description:** Save hook that records the associated `wormlight` (spell-based light) if present.
*   **Parameters:**
    *   `inst` (Entity) — The critter entity.
    *   `data` (table) — Save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Load hook that restores and reattaches a saved `wormlight` spell, setting it to target this critter and resuming its spell lifecycle.
*   **Parameters:**
    *   `inst` (Entity) — The critter entity.
    *   `data` (table) — Loaded save data.
*   **Returns:** Nothing.

### `OnLoadPostPass(inst)`
*   **Description:** Post-load hook that triggers `perishchange` event to initialize any special powers registered via `special_powers_fn`.
*   **Parameters:**
    *   `inst` (Entity) — The critter entity.
*   **Returns:** Nothing.

### `builder_onbuilt(inst, builder)`
*   **Description:** Callback executed when the builder is placed in the world. Spawns the critter at a nearby valid position and removes the builder.
*   **Parameters:**
    *   `inst` (Entity) — The builder instance.
    *   `builder` (Entity) — The entity that placed the builder.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `perishchange` — Triggered when critter’s perish percentage changes; used to initialize or update special powers (e.g., Lunar Moth light).
- **Listens to:** `onremove` — Attached to `critterbuff_lunarmoth` to detect when the buff light is destroyed and restore critter state.
- **Pushes:** `perishchange` — Called during post-init and `OnLoadPostPass` to initialize special powers and notify listeners of initial state.
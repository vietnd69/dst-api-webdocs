---
id: beebox
title: Beebox
description: Manages a beehive-like structure that produces honey over time and spawns bees when harvested, with state changes based on light, season, and player actions.
tags: [environment, bee, harvesting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a56bddd4
system_scope: environment
---

# Beebox

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `beebox` prefab is a player-built structure that produces honey through a process tied to in-game conditions such as time of day, season, and bee activity. It uses the `harvestable` component to manage honey production, the `childspawner` component to spawn and manage bees, and integrates with `burnable`, `workable`, `inspectable`, and `lootdropper` components. Its behavior changes dynamically based on cave day/night cycles (`iscaveday`), winter season, and player actions (e.g., hammering, harvesting). The structure is not functional when burnt or during winter.

## Usage example
```lua
local inst = Prefabs["beebox"]()
-- Optional: modify tuning or add post-init logic
inst.components.harvestable:SetGrowTime(300) -- 5 minutes per honey
inst.components.childspawner:SetMaxChildren(12)
```

## Dependencies & tags
**Components used:** `harvestable`, `childspawner`, `burnable`, `lootdropper`, `workable`, `inspectable`, `skilltreeupdater`, `pollinator`, `propagator`, `fueled`, `finiteuses`, `stackable`, `inventory`, `lightwatcher`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`.

**Tags:** Adds `structure`, `playerowned`, `beebox`, and `antlion_sinkhole_blocker` (only for `beebox_hermit` variant). Checks tags: `burnt`, `flower`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `anims.idle` | string | `"bees_loop"` (default), adjusts based on honey level | Animation name played when idle (e.g., `"honey3"` when full). |
| `anims.hit` | string | `"hit_idle"` (default), adjusts based on honey level | Animation name played on hit (e.g., `"hit_honey3"`). |
| `levels` | table | Hardcoded array of honey-level configurations | Defines thresholds and corresponding animations (e.g., `amount=6` → `"honey3"`). |
| `FLOWER_TEST_RADIUS` | number | `30` | Max radius to search for a flower (`flower` tag) to enable honey growth. |
| `CanStartGrowing` | function | Defined locally | Predicate returning `true` if growth can start (daylight, not winter, has bees, has nearby flower, not burnt). |

## Main functions
### `CanStartGrowing(inst)`
*   **Description:** Determines whether the beebox can begin honey production. Checks that it is not burnt, not in winter, has at least one bee inside, and has a flower (`flower` tag) within `FLOWER_TEST_RADIUS`.
*   **Parameters:** `inst` (entity) – the beebox instance.
*   **Returns:** `boolean` – `true` if growth conditions are met; `false` otherwise.

### `SetLevel(inst, level)`
*   **Description:** Updates the beebox’s visual animation based on its current honey amount. Only applies if the box is not burnt.
*   **Parameters:** `inst` (entity), `level` (table) – a levels entry with `idle` and `hit` animation strings.
*   **Returns:** Nothing. Modifies `inst.AnimState`.

### `updatelevel(inst)`
*   **Description:** Scans the `levels` table to find the highest honey threshold met by `produce`, then sets the appropriate animation via `setlevel`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing. Side-effect: updates animation state.

### `GetStatus(inst)`
*   **Description:** Returns a string status for UI (`inspectable` integration). Indicates readiness or conditions.
*   **Parameters:** `inst` (entity).
*   **Returns:** `"READY"`, `"SOMEHONEY"`, `"NOHONEY"`, or `nil` (if broken or missing `harvestable`).

### `onhammered(inst, worker)`
*   **Description:** Triggered when the beebox is hammered (e.g., by a player or tool). Extinguishes fire if burning, stops the loop sound, triggers harvest (if possible), drops loot, spawns collapse FX, and removes the entity.
*   **Parameters:** `inst` (entity), `worker` (entity) – the hammerer.
*   **Returns:** Nothing.

### `onharvest(inst, picker, produce)`
*   **Description:** Callback from `harvestable` after harvesting. Stops growth, awards achievement if full honey, updates animation level, and spawns bees if conditions allow (not winter, skilltree not blocking).
*   **Parameters:** `inst` (entity), `picker` (entity, optional), `produce` (number) – honey amount harvested.
*   **Returns:** Nothing.

### `onchildgoinghome(inst, data)`
*   **Description:** Callback triggered when a bee returns from foraging. Increases honey production if the bee has collected enough nectar (via `pollinator:HasCollectedEnough()`) and the box is not burnt.
*   **Parameters:** `inst` (entity), `data` (table) – must contain `child`.
*   **Returns:** Nothing.

### `OnIsCaveDay(inst, isday)`
*   **Description:** Handles cave-specific daylight transitions. Stops growth at night; starts at day if not winter and lit.
*   **Parameters:** `inst` (entity), `isday` (boolean) – whether it is currently cave day.
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Pauses growth and kills sound during world sleep (e.g., when player enters a sleeping state or world is asleep).
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Resumes (or starts) growth and plays looping sound when the world wakes.
*   **Returns:** Nothing.

### `TryStartSleepGrowing(inst)`
*   **Description:** Attempts to start honey growth using a fixed sleep-growth time (`TUNING.BEEBOX_HONEY_TIME`) if conditions (`CanStartGrowing`) are met; otherwise pauses growth.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `SeasonalSpawnChanges(inst, season)`
*   **Description:** Adjusts bee spawner periods and max children based on spring combat mod tuning.
*   **Parameters:** `inst` (entity), `season` (string) – e.g., `"SPRING"`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"childgoinghome"` → triggers `onchildgoinghome`.
  - `"enterlight"` → triggers `OnEnterLight`.
  - `"enterdark"` → triggers `OnEnterDark`.
  - `"onignite"` → triggers `onignite`.
  - `"onbuilt"` → triggers `onbuilt`.
  - `"death"` (via `burnable` integration).
- **Pushes:** None directly, but relies on callbacks from `harvestable`, `burnable`, `childspawner`, and world state events (`iscaveday`, `iswinter`, `season`).

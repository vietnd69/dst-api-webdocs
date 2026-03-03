---
id: oceantrawler
title: Oceantrawler
description: Manages the catching, storage, and release of ocean fish in a trawler net, including timing-based collection while sleeping, overflow handling, and animation synchronization.
tags: [fishing, inventory, ocean, animation, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 718cf1c7
system_scope: inventory
---

# Oceantrawler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Oceantrawler` governs the behavior of ocean trawlers in DST, handling fish capture logic (both active and while sleeping), container interaction, overflow management, and visual state synchronization via `AnimState` overrides. It extends the `container` component by adding time-based capture simulation, bait-based catch chance modifiers, and dynamic net animation states (`net_empty`, `net_medium`, `net_full`, `net_untied`). The component integrates closely with `container`, `health`, `edible`, `schoolspawner`, and `homeseeker` components, and supports save/load via `OnSave`/`OnLoad`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("container")
inst:AddComponent("oceantrawler")

-- Lower the trawler to begin catching fish
inst.components.oceantrawler:Lower()

-- Check if fish are caught (active mode)
inst.components.oceantrawler:SimulateCatchFish()

-- Raise the trawler to open and collect
inst.components.oceantrawler:Raise()
```

## Dependencies & tags
**Components used:** `container`, `timer`, `health`, `edible`, `schoolspawner`, `homeseeker`, `minimap`, `sg` (stategraph), `transform`, `physics`, `animstate`, `miniMapEntity`  
**Tags:** Adds `trawler_lowered`, `trawler_fish_escaped`; checks for `oceantrawler`, `oceanfish`, `oceanshoalspawner`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance that owns this component. |
| `lowered` | boolean | `false` | Whether the trawler is currently lowered into the water. |
| `range` | number | `2.5` | Radius around the trawler used when actively scanning for fish. |
| `nearbytrawlerrange` | number | `16` | Max distance to other trawlers that modifies catch chance while sleeping. |
| `nearbyshoalrange` | number | `16` | Range used to detect ocean shoal spawners for hooking events. |
| `checkperiod` | number | `0.75` | How often (seconds) the component checks for fish while awake. |
| `catchfishchance` | number | `0.125` | Base chance per check to catch a fish while awake. |
| `sleepcheckperiod` | number | `TUNING.SEG_TIME` | Time interval (in seconds) per sleep segment to simulate catching. |
| `sleepcatchfishchance` | number | `0.0625` | Base per-segment chance to catch a fish while sleeping. |
| `baitcatchfishmodifier` | number | `2` | Multiplier applied to catch chance when valid bait is present. |
| `overflowescapepercent` | number | `0.2` | Per-overflow fish chance to trigger escape event. |
| `task` | `PeriodicTask` | `nil` | Active timer task used during active fishing. |
| `startsleeptime` | number | `0` | Timestamp when the entity last fell asleep. |
| `elapsedsleeptime` | number | `0` | Accumulated sleep time used for simulation. |
| `overflowfish` | table | `{}` | List of prefabs for fish caught beyond container capacity. |
| `fishescaped` | boolean | `false` | Whether fish have escaped (affects animation and malbatross spawning). |

## Main functions
### `Reset()`
* **Description:** Resets the trawler to its initial state, clearing timers, overflow fish, and escape flags; stops updates.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns state data for serialization (used in save files).
* **Parameters:** None.
* **Returns:** `table` with keys: `lowered`, `elapsedsleeptime`, `overflowfish`, `fishescaped`.

### `OnLoad(data)`
* **Description:** Restores state from saved data; updates minimap icon and tag based on `lowered` and `fishescaped`.
* **Parameters:** `data` (table) — saved component state.
* **Returns:** Nothing.

### `HasCaughtItem()`
* **Description:** Indicates whether the container currently holds at least one fish.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if container is non-empty, otherwise `false`.

### `HasFishEscaped()`
* **Description:** Returns whether the trawler has experienced a fish-escape event (e.g., overload).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if fish escaped, otherwise `false`.

### `IsLowered()`
* **Description:** Returns current lowered state.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if lowered, otherwise `false`.

### `Lower()`
* **Description:** Lowers the trawler into the water, blocks container opening, starts fish-check timer, and updates minimap icon.
* **Parameters:** None.
* **Returns:** Nothing.

### `Raise()`
* **Description:** Raises the trawler, unlocks the container for access, triggers overflow fish release, and refreshes net animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `Fix()`
* **Description:** Clears the `trawler_fish_escaped` tag and internal `fishescaped` flag; updates net animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `ReleaseOverflowFish()`
* **Description:** Spawns escaped overflow fish outside the trawler using a radial launch motion.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetBait(eater)`
* **Description:** Searches the container for a suitable bait item for the given fish prefab (based on diet).
* **Parameters:** `eater` (string) — fish prefab name.
* **Returns:** `Entity` or `nil` — bait item if found, else `nil`.

### `StartUpdate()` / `StopUpdating()`
* **Description:** Starts/stops the active-fishing periodic check loop (`OnUpdate`).
* **Parameters:** None (both).
* **Returns:** Nothing.

### `SimulateCatchFish()`
* **Description:** Simulates fish catching over elapsed sleep time, applying percent ocean, nearby trawler, and bait modifiers. Triggers shoal hook events and overflow handling.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Main active-fishing loop. Checks for nearby trappable ocean fish, and with probability modifies by bait, adds caught fish.
* **Parameters:** `dt` (number) — time delta since last update (unused directly; period is fixed by `checkperiod`).
* **Returns:** Nothing.

### `OnEntitySleep()` / `OnEntityWake()`
* **Description:** Pauses/resumes the active update timer and triggers a simulation of catching during sleep when waking.
* **Parameters:** None (both).
* **Returns:** Nothing.

### `GetOceanTrawlerSpawnChanceModifier(spawnpoint)`
* **Description:** Returns a multiplier for nearby sea-creature spawn chance; `TUNING.OCEAN_TRAWLER_SPAWN_FISH_MODIFIER` if lowered and full, otherwise `1`.
* **Parameters:** `spawnpoint` (position table) — unused in current implementation.
* **Returns:** `number` — spawn chance modifier.

## Events & listeners
- **Listens to:** `itemlose`, `itemget` — triggers `UpdateFishNetAnim` to refresh net animation.
- **Pushes:** `ms_shoalfishhooked` (via `TheWorld:PushEvent`) — notifies listeners (e.g., malbatross tracking) when a shoal fish is caught.  
*(Note: `ms_registerfishshoal` and `ms_unregisterfishshoal` events are commented out.)*

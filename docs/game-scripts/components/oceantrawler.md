---
id: oceantrawler
title: Oceantrawler
description: This component manages the fishing mechanics of the ocean trawler, including lowering/raising, fish capture simulation during sleep or active periods, overflow handling, and animation synchronization based on catch state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 718cf1c7
---

# Oceantrawler

## Overview
The `OceanTrawler` component handles the gameplay logic for the ocean trawler entity, including lowering the net into the water, simulating fish capture (both while awake and while the player is sleeping), managing overflow catches beyond container capacity, and synchronizing visual state (e.g., net animations and minimap icon) accordingly. It integrates with the entity’s container, physics, state graph, and map systems.

## Dependencies & Tags
**Added Tags:**
- `trawler_lowered` (when net is lowered)
- `trawler_fish_escaped` (when fish escaped due to overflow)

**Removed Tags:**
- `trawler_lowered` (on raise or reset)
- `trawler_fish_escaped` (on fix or reset)

**Component Dependencies:**
- `container`: Required for item storage; used in nearly all logic.
- `timer`: Added via `inst:AddComponent("timer")`.
- `health`, `transform`, `physics`, `animstate`, `minimap`, `sg`, `components.schoolspawner` (TheWorld): Used conditionally or in simulation logic.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity. |
| `lowered` | `boolean` | `false` | Whether the trawler net is currently lowered. |
| `range` | `number` | `2.5` | Radius around the trawler used to detect nearby ocean fish while active. |
| `nearbytrawlerrange` | `number` | `16` | Radius to search for other trawlers that affect catch rates while sleeping. |
| `nearbyshoalrange` | `number` | `16` | Radius to search for ocean fish shoal spawners when a fish is caught. |
| `checkperiod` | `number` | `0.75` | Interval (in seconds) between catch simulation checks while active. |
| `catchfishchance` | `number` | `0.125` | Base per-check probability of catching a fish while awake. |
| `sleepcheckperiod` | `number` | `TUNING.SEG_TIME` | Time interval (in seconds) representing a sleep segment used for catch rate calculation. |
| `sleepcatchfishchance` | `number` | `0.0625` | Base per-check probability of catching a fish per sleep segment. |
| `baitcatchfishmodifier` | `number` | `2` | Multiplier applied to catch chance when appropriate bait is present. |
| `task` | `Task` | `nil` | Periodic task for active-state fish checking. |
| `startsleeptime` | `number` | `0` | Timestamp marking when the entity began sleeping. |
| `elapsedsleeptime` | `number` | `0` | Accumulated time spent sleeping, used to calculate catch attempts. |
| `overflowfish` | `table` | `{}` | List of overflow fish indices (prefab names + `"_inv"`) queued to spawn when the net is raised. |
| `overflowescapepercent` | `number` | `0.2` | Base probability per overflow fish to trigger a full escape event. |
| `fishescaped` | `boolean` | `false` | Whether a full escape event has occurred. |

## Main Functions

### `Reset()`
* **Description:** Resets the trawler state to initial values, cancels update tasks, clears overflow/fish escape state, and removes the `trawler_fish_escaped` tag.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns a serializable data table containing critical state (lowered status, sleep time, overflow fish, escape status) for persistence.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores trawler state from saved data. Sets minimap icon based on lowered state and re-applies tags if needed.
* **Parameters:**  
  `data`: Table containing `lowered`, `elapsedsleeptime`, `overflowfish`, and `fishescaped`.

### `HasCaughtItem()`
* **Description:** Returns whether the container holds at least one fish.
* **Parameters:** None.  
* **Returns:** `boolean`.

### `HasFishEscaped()`
* **Description:** Returns whether the fish escape state is currently active.
* **Parameters:** None.  
* **Returns:** `boolean`.

### `IsLowered()`
* **Description:** Returns whether the trawler net is lowered.
* **Parameters:** None.  
* **Returns:** `boolean`.

### `Lower()`
* **Description:** Lowers the net, updates state graph, minimap icon, container openness, and starts periodic fish-checking tasks.
* **Parameters:** None.

### `GetOceanTrawlerSpawnChanceModifier(spawnpoint)`
* **Description:** Returns a spawn chance modifier for sea creatures (e.g., Malbatross) near the trawler—specifically, increases spawn chance if trawler is lowered and full.
* **Parameters:**  
  `spawnpoint`: Point in world coordinates (not used directly, but used by caller).

### `GetBait(eater)`
* **Description:** Searches container for an edible item matching the diet of a given fish prefab and returns it if found.
* **Parameters:**  
  `eater`: Prefab name of the fish expecting bait.

### `ReleaseOverflowFish()`
* **Description:** Spawns and launches all overflow fish out of the net when raising.
* **Parameters:** None.

### `Raise()`
* **Description:** Raises the net, restores container openness, clears overflow fish, updates animations, and resets minimap icon.
* **Parameters:** None.

### `Fix()`
* **Description:** Clears the fish escape state and removes the `trawler_fish_escaped` tag.
* **Parameters:** None.

### `StopUpdating()`
* **Description:** Cancels and nullifies the active fish-checking task.
* **Parameters:** None.

### `StartUpdate()`
* **Description:** Begins a periodic task (using `DoPeriodicTask`) to check for fish while lowered and not escaped.
* **Parameters:** None.

### `ReleaseOverflowFish()` (Private helper referenced in public flow)
* **Description:** See public function above.

### `SimulateCatchFish()`
* **Description:** Simulates fish capture over accumulated sleep time, accounting for ocean coverage, nearby trawlers, and bait. Triggers shoal events and overflow logic.
* **Parameters:** None.

### `OnEntitySleep()`
* **Description:** Records the start of sleep time for later catch simulation.
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Resets the periodic task, simulates catch attempts for elapsed sleep time, and restarts active checking.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Called periodically during active (non-sleep) periods to attempt catching nearby ocean fish based on range and chance modifiers.
* **Parameters:**  
  `dt`: Time delta for the check (used for consistency but not directly applied here).

## Events & Listeners

- **Listens to:**
  - `"itemlose"` → Triggers `UpdateFishNetAnim`
  - `"itemget"` → Triggers `UpdateFishNetAnim`

- **Triggers/Pushes:**
  - `"ms_shoalfishhooked"` — when a fish from a shoal is caught.
  - `"ms_registerfishshoal"` / `"ms_unregisterfishshoal"` — *commented out* in current code (disabled).
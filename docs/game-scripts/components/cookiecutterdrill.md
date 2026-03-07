---
id: cookiecutterdrill
title: CookieCutterDrill
description: Manages the drilling progression for a cookie-cutter boat leak repair mechanism, handling animation state and damage application upon completion.
tags: [boat, repair, damage, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6407c4f4
system_scope: world
---

# CookieCutterDrill

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CookieCutterDrill` is a state-driven component that tracks progress for a repair action—specifically, the "drilling" animation used to patch leaks in boats (e.g., during the Leech event or related gameplay). It manages the accumulation of drill time, updates progress, and triggers a leak repair with optional hull damage upon completion. The component is tightly integrated with the `eater` and `hullhealth`/`health` components of boats and interacts with the game's physics/world through position and event systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("cookiecutterdrill")
inst.components.cookiecutterdrill:SetDrillDuration(15)  -- optional override
inst.components.cookiecutterdrill:ResumeDrilling()
-- ... when drill completes ...
inst.components.cookiecutterdrill:FinishDrilling()
```

## Dependencies & tags
**Components used:** `eater`, `hullhealth`, `health`  
**Tags:** None added or checked by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `drill_progress` | number | `0` | Current drill time accumulated. |
| `drill_duration` | number | `10` | Total time (in seconds) required to complete the drill. |
| `leak_type` | string | `"med_leak"` | Type identifier for the leak being repaired (used in event data). |
| `leak_damage` | number or `nil` | `nil` | Optional damage applied to the boat's hull upon drill completion. |
| `sound` | string | `"turnoftides/common/together/boat/damage"` | Sound path used for leak events. |
| `sound_intensity` | number | `0.8` | Intensity multiplier for the leak sound effect. |

## Main functions
### `GetIsDoneDrilling()`
* **Description:** Checks whether the drill has completed (i.e., `drill_progress >= drill_duration`).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if drilling is complete, `false` otherwise.

### `ResetDrilling()`
* **Description:** Resets the drill progress to zero, preparing the component for a new drill cycle.
* **Parameters:** None.
* **Returns:** Nothing.

### `ResumeDrilling()`
* **Description:** Resumes the drill update loop by starting component updates (triggering `OnUpdate(dt)` each frame).
* **Parameters:** None.
* **Returns:** Nothing.

### `PauseDrilling()`
* **Description:** Pauses the drill update loop by stopping component updates.
* **Parameters:** None.
* **Returns:** Nothing.

### `FinishDrilling()`
* **Description:** Finalizes the drilling process: stops updates, resets progress, retrieves the current boat entity, updates eater state, optionally applies hull damage, and emits a `spawnnewboatleak` event to fix the leak.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If `self.leak_damage` is `nil` or the boat has no `hullhealth` component, no damage is applied.

### `OnUpdate(dt)`
* **Description:** Increments `drill_progress` by `dt` each frame while the component is active (started via `ResumeDrilling()`).
* **Parameters:** `dt` (number) — Time elapsed since the last frame.
* **Returns:** Nothing.

### `OnEntitySleep()`
* **Description:** Stops the update loop when the entity enters sleep (e.g., when despawned or hidden), conserving resources.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no explicit `inst:ListenForEvent` calls).
- **Pushes:** `spawnnewboatleak` — emitted on the boat entity with `{ pt = position, leak_size = leak_type, playsoundfx = true }` during `FinishDrilling()`.

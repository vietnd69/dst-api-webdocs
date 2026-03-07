---
id: creepyeyes
title: Creepyeyes
description: Spawns temporary, light-sensitive visual FX entities that appear in darkness and disappear when a player comes near or lights up.
tags: [fx, light, vision, event]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 49298518
system_scope: fx
---

# Creepyeyes

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`Creepyeyes` is a one-time-use prefab that spawns floating, blinking eye FX in dark areas. It appears only in darkness (based on light level thresholds), disappears if the player gains night vision, and vanishes when a player enters its proximity (within 3–5 units). It is designed for atmospheric effect during events like the "Crabason" or similar environmental storytelling moments, and is never persisted or networked.

## Usage example
```lua
-- Spawns a_creepyeyes instance at the player's position
local eyes = SpawnPrefab("creepyeyes")
eyes.Transform:SetPosition(ThePlayer.Transform:GetWorldPosition())
```

## Dependencies & tags
**Components used:** `playerprox`, `transform`, `animstate`, `lightwatcher`
**Tags:** Adds `NOCLICK`, `FX`.  
**Non-persisted:** `inst.persists = false`, `inst.entity:SetCanSleep(false)`.

## Properties
No public properties. State is managed internally via task handles (`blinktask`, `deathtask`) and local variables.

## Main functions
### `Blink(inst)`
*   **Description:** Plays a random blink animation sequence (`blink_X` followed by `idle_X`), then schedules the next blink after a random delay (0.5–1.5s). Called recursively.
*   **Parameters:** `inst` (entity) — the instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `Disappear(inst)`
*   **Description:** Cancels scheduled blink and death tasks, plays the `disappear_X` animation once (non-looping), and schedules removal upon animation completion.
*   **Parameters:** `inst` (entity) — the instance.
*   **Returns:** Nothing.
*   **Error states:** Safely handles missing task handles (nil-checks before cancelling).

### `OnInit(inst)`
*   **Description:** Final light check after positioning — removes the entity if lit (e.g., player moved it into light), otherwise makes it visible.
*   **Parameters:** `inst` (entity) — the instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `fn()`
*   **Description:** Prefab factory function — constructs and configures the entity instance with all required components, animations, and behavior.
*   **Parameters:** None.
*   **Returns:** `inst` — fully initialized entity.

## Events & listeners
- **Listens to:**
  - `enterlight` — triggers `inst.Remove`.
  - `animqueueover` — triggers `inst.Remove` after `Disappear` animation finishes.
  - `nightvision` (on `ThePlayer`) — triggers `inst.Remove` when night vision activates.
- **Pushes:** None.
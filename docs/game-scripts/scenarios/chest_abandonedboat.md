---
id: chest_abandonedboat
title: Chest Abandonedboat
description: Sets up loot and trap logic for an abandoned boat chest, including randomized item generation and a 90% chance to trigger a pirate or ghost attack on opening.
tags: [loot, trap, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 9ea00787
system_scope: environment
---

# Chest Abandonedboat

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario file configures an abandoned boat chest by defining its loot table and trap behavior. It integrates with `chestfunctions.lua` to populate the chest with randomized items and attach a trap that activates with `90%` probability upon opening. The trap can spawn pirates, spawn a nearby ghost that targets the opener, or destroy the chest’s platform.

## Usage example
```lua
-- This file is called by the game's scenario system; usage is implicit.
-- It is not meant to be directly instantiated.
-- When a chest prefab with this scenario runs:
chestfunctions.AddChestItems(inst, LOOT)      -- adds loot
chestfunctions.InitializeChestTrap(inst, scenariorunner, TriggerTrap, 0.9) -- attaches trap
```

## Dependencies & tags
**Components used:** `walkableplatform`, `health`, `fueled`, `finiteuses`, `sanity`, `piratespawner`  
**Tags:** No tags added or checked directly; relies on tags in spawned entities (e.g., `"skeleton"`, `"ghost"`).

## Properties
No public properties. All state is encapsulated in `LOOT` table and `TRIGGER_TRAP_CHANCE`.

## Main functions
### `GetRandomAmount2to5()`
* **Description:** Returns a random integer between 2 and 5 inclusive.
* **Parameters:** None.
* **Returns:** `number` — random integer `2 ≤ n ≤ 5`.

### `GetRandomAmount1to3()`
* **Description:** Returns a random integer between 1 and 3 inclusive.
* **Parameters:** None.
* **Returns:** `number` — random integer `1 ≤ n ≤ 3`.

### `RandomFueledPercent(item)`
* **Description:** Sets the `fueled` component of `item` to a random percent between `43%` and `82%`.
* **Parameters:** `item` (Entity) — an entity with a `fueled` component.
* **Returns:** Nothing.

### `RandomFiniteusesPercent(item)`
* **Description:** Sets the current uses of `item` to a random integer between `40%` and `80%` of its total uses, rounded up.
* **Parameters:** `item` (Entity) — an entity with a `finiteuses` component.
* **Returns:** Nothing.

### `SetGhostTarget(inst, player)`
* **Description:** Assigns a `followtarget` on the `brain` of `inst` (a ghost) to track `player`.
* **Parameters:**  
  - `inst` (Entity) — ghost entity (may be `nil`).  
  - `player` (Entity) — target player entity.
* **Returns:** Nothing.
* **Error states:** Returns early if `inst` is `nil` or `inst.brain` is `nil`.

### `FindNearbySkeleton(platform)`
* **Description:** Searches for a `"skeleton"` entity on the given `walkableplatform`.
* **Parameters:** `platform` (Entity) — platform entity with `walkableplatform` component (may be `nil` or invalid).
* **Returns:** `Entity?` — the skeleton entity if found, otherwise `nil`.

### `TriggerTrap(inst, scenariorunner, data)`
* **Description:** Triggers one of three effects on chest opening, based on a random roll and conditions:
  - `≤ 33%`: Spawns pirates for the player.
  - `≤ 66%` *and* skeleton present: Spawns a ghost on the platform, sets it to target the player, and deals huge sanity loss to the player.
  - Otherwise: Destroys the platform (`health:Kill()`).
* **Parameters:**  
  - `inst` (Entity) — the chest entity.  
  - `scenariorunner` (Entity) — scenario runner instance.  
  - `data` (table) — must contain `player` (Entity). May include platform context via `GetCurrentPlatform()`.
* **Returns:** Nothing.

### `OnCreate(inst, scenariorunner)`
* **Description:** Populates the chest with loot using the `LOOT` table.
* **Parameters:**  
  - `inst` (Entity) — the chest entity.  
  - `scenariorunner` (Entity) — scenario runner instance.
* **Returns:** Nothing.

### `OnLoad(inst, scenariorunner)`
* **Description:** Initializes the trap for the chest using `TRIGGER_TRAP_CHANCE = 0.9`.
* **Parameters:**  
  - `inst` (Entity) — the chest entity.  
  - `scenariorunner` (Entity) — scenario runner instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no event listeners).
- **Pushes:** None directly; relies on functions like `health:Kill()` and component events (`sanitydelta`, etc.) from other components.
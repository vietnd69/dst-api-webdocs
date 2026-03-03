---
id: wintersurprisespawner
title: Wintersurprisespawner
description: Manages the spawning of winter surprise trees during winter seasons, based on world state and player positioning rules.
tags: [winter, spawning, event, environment, seasonal]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 1035c689
system_scope: world
---

# Wintersurprisespawner

> Based on game build **714001** | Last updated: 2026-03-03

## Overview
`Wintersurprisespawner` is a world-level component responsible for triggering the spawning of special "winter surprise" trees (`winter_tree` prefabs) during the winter season. It coordinates with the `worldsettingstimer` to schedule spawns, respects proximity constraints (e.g., avoiding existing structures and players), and leverages the `klaussackspawner`, `hounded`, and `growable` components to ensure correct placement and configuration. This component is server-only (`mastersim` only) and persists spawn counts across sessions via save/load.

## Usage example
```lua
-- The component is automatically added to the world (not manually attached by modders).
-- Example of internal usage within DST's codebase:
TheWorld:AddComponent("wintersurprisespawner")
TheWorld.components.wintersurprisespawner:OnPostInit() -- Triggered automatically during world init
```

## Dependencies & tags
**Components used:** `worldsettingstimer`, `klaussackspawner`, `hounded`, `growable`, `container`, `stackable`, `unwrappable`  
**Tags:** Adds `winter_tree`; checks `INLIMBO`, `structure`, `klaussacklock`, `winter_tree`

## Properties
No public properties. All state is kept in private local variables.

## Main functions
### `OnPostInit()`
* **Description:** Initializes the component after the instance is fully constructed. Registers the winter season watcher and schedules the first respawn timer.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `OnSave()`
* **Description:** Returns the current state for serialization.
* **Parameters:** None.
* **Returns:** `{ spawnsthiswinter = number }` — a table with the count of winter surprise trees spawned in the current winter.

### `OnLoad(data)`
* **Description:** Restores state from saved data.
* **Parameters:** `data` (table) — containing `spawnsthiswinter` (number).
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for UI display.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"spawns for this winter: 2"`.

## Events & listeners
- **Listens to:**  
  - `ms_registerdeerspawningground` — triggers `OnRegisterSurpriseSpawningPt` to register spawner locations.  
  - `onremove` — triggers `OnRemoveSpawner` when a registered spawner is removed.  
  - `iswinter` — triggers `OnIsWinter` to start/stop spawns based on season state.
- **Pushes:** None.

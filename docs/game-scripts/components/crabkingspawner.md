---
id: crabkingspawner
title: Crabkingspawner
description: Manages the spawning and respawn timing of the Crab King boss during world generation restoration.
tags: [boss, spawner, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f25062ff
system_scope: world
---

# Crabkingspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Crabkingspawner` is a server-only component responsible for initializing and configuring the Crab King spawner during world loading, specifically in scenarios where the spawner data is restored from a saved world (e.g., after worldgen override restoration). It does not define runtime behavior but ensures proper re-creation of the spawner entity when missing during post-save load. It interacts with `childspawner` to reset internal child counts and `worldsettingstimer` to resume the respawn timer.

## Usage example
This component is added automatically to spawner entities by the engine during world restoration and is not intended for direct manual instantiation by modders.

```lua
-- Internal usage: The component is attached to a 'crabking_spawner' entity during world load.
-- Modders typically do not interact with this component directly.
```

## Dependencies & tags
**Components used:** `childspawner`, `worldsettingstimer`  
**Tags:** Checks for the presence of the `"crabking_spawner"` tag via `TheSim:FindFirstEntityWithTag("crabking_spawner")`.

## Properties
No public properties are initialized in the constructor.

## Main functions
### `LoadPostPass(newents, data)`
*   **Description:** Restores the Crab King spawner entity if it was removed or never spawned in the saved world. Only executes on the master simulation. Reads saved coordinates and respawn time from `data`, spawns the entity, positions it, resets child count, and restarts the respawn timer.
*   **Parameters:**  
    `newents` (table) — list of newly created entities during world load (unused in this method).  
    `data` (table) — saved world data containing `crabkingx`, `crabkingz`, and optionally `timetorespawn`.  
*   **Returns:** Nothing.
*   **Error states:** Does nothing if an entity tagged `"crabking_spawner"` already exists (`TheSim:FindFirstEntityWithTag("crabking_spawner")` returns non-nil).

## Events & listeners
None identified.

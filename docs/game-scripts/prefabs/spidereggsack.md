---
id: spidereggsack
title: Spidereggsack
description: A deployable item that spawns a spider den when placed, used as bait or a resource.
tags: [deployable, entity_spawning, inventory, fuel]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 09d3ba8f
system_scope: world
---

# Spidereggsack

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `spidereggsack` prefab is a stackable inventory item that functions as both a deployable and a fuel source. When deployed, it spawns a `spiderden` at the target location and consumes itself. It is primarily used for spider-related gameplay, such as attracting spiders or managing spider populations. It integrates with multiple core systems: `deployable` for placement logic, `fuel` for burning, `inventoryitem` for storage, and `stackable` for quantity management.

## Usage example
```lua
-- Typical usage in a game context
local sack = SpawnPrefab("spidereggsack")
sack.Transform:SetPosition(x, y, z)
sack.components.deployable:OnDeploy()  -- Triggers ondeploy behavior

-- As fuel (e.g., in a campfire)
sack.components.fuel.fuelvalue == TUNING.LARGE_FUEL  -- true

-- Stack behavior
sack.components.stackable.maxsize == TUNING.STACK_SIZE_LARGEITEM  -- true
```

## Dependencies & tags
**Components used:** `stackable`, `fuel`, `inventoryitem`, `deployable`, `inspectable`, `tradable`  
**Tags:** Adds `cattoy`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string | `"PLANTABLE_ON"` | Indicates the item can be planted on terrain in the Scrapbook. |
| `components.fuel.fuelvalue` | number | `TUNING.LARGE_FUEL` | Fuel value for burning. |
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum stack size. |

## Main functions
### `ondeploy(inst, pt)`
* **Description:** Called when the item is deployed (placed) via the deployable system. Spawns a `spiderden` at the deployment point, plays a sound, and removes the entire stack from the world.
* **Parameters:**  
  `inst` (Entity) – The spidereggsack instance.  
  `pt` (Vector) – The deployment position.  
* **Returns:** Nothing.
* **Error states:** If `SpawnPrefab("spiderden")` fails (e.g., world constraints), `den` will be `nil`, and no den is spawned.

### `onpickup(inst)`
* **Description:** Play a sound effect when the item is picked up from the world (e.g., by a player).
* **Parameters:**  
  `inst` (Entity) – The spidereggsack instance.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
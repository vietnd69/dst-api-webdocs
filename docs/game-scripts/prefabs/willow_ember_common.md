---
id: willow_ember_common
title: Willow Ember Common
description: Utility module providing helper functions for Willow's ember mechanics and fire burst targeting.
tags: [willow, fire, utility, combat, prefab]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: d146b006
system_scope: combat
---

# Willow Ember Common

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`willow_ember_common` is a utility module that provides helper functions for managing Willow's ember mechanics. It handles ember spawning, distribution, inventory granting, and target selection for fire burst abilities. The module is designed to be required by other prefabs and components that need to interact with ember-related functionality.

## Usage example
```lua
local fns = require("prefabs/willow_ember_common")

-- Check if a victim entity has embers
if fns.HasEmbers(victim) then
    local num = fns.GetNumEmbers(victim)
    fns.SpawnEmbersAt(victim, num)
end

-- Give embers directly to a player's inventory
fns.GiveEmbers(player, 3, player.Transform:GetWorldPosition())

-- Get valid targets for fire burst ability
local targets = fns.GetBurstTargets(player)
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- accesses `FIRE_BURST_RANGE` constant for target finding
- `TheSim` -- uses `FindEntities` for entity queries
- `SpawnPrefab` -- spawns `willow_ember` prefab instances

**Components used:**
- `burnable` -- checks `IsBurning()` on victim entities
- `inventory` -- calls `GiveItem()` to add embers to entity inventory
- `stackable` -- calls `SetStackSize()` to set ember stack count
- `combat` -- accessed via `player.replica.combat` for ally checks

**Tags:**
- `animal`, `character`, `largecreature`, `monster`, `smallcreature` -- checked by `HasEmbers()` via `HasOneOfTags()`
- `noember` -- excluded from ember effects
- `epic` -- increases ember count to 7-8
- `largecreature` -- increases ember count to 3
- `canlight`, `nolight`, `fire` -- used in burst target filtering
- `bigbernie` -- special case for burnable Bernie
- `player`, `ghost`, `invisible`, `noattack`, `notarget`, `companion`, `flight`, `INLIMBO` -- excluded from burst targets
- `_combat` -- required tag for burst targets via `CREATURES_MUST`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. This is a utility module returning a function table. |

## Main functions
### `HasEmbers(victim)`
* **Description:** Checks if a victim entity is valid for ember effects by verifying it has a burnable component that is currently burning, lacks the `noember` tag, and has at least one creature-type tag.
* **Parameters:** `victim` -- entity instance to check
* **Returns:** `true` if entity qualifies for embers, `false` otherwise
* **Error states:** Errors if `victim` is nil or lacks `components` table (nil dereference on `victim.components.burnable` — no guard present)

### `GetNumEmbers(victim)`
* **Description:** Determines the number of embers to spawn based on victim's tags. Returns 7-8 for `epic` tag, 3 for `largecreature` tag, or 1 for all other valid creatures.
* **Parameters:** `victim` -- entity instance to evaluate
* **Returns:** Number (1, 3, or random 7-8)
* **Error states:** Errors if `victim` is nil or lacks `HasTag()` method — assumes `HasEmbers()` was checked separately per source comment

### `SpawnEmberAt(x, y, z, victim, marksource)`
* **Description:** Spawns a single `willow_ember` prefab at the specified world position. Optionally marks the ember with the victim's ember source reference.
* **Parameters:**
  - `x` -- world X coordinate
  - `y` -- world Y coordinate
  - `z` -- world Z coordinate
  - `victim` -- source entity (can be nil)
  - `marksource` -- boolean to mark ember with source reference
* **Returns:** None
* **Error states:** Errors if `SpawnPrefab("willow_ember")` returns nil and subsequent methods are called on it

### `SpawnEmbersAt(victim, numembers)`
* **Description:** Spawns multiple embers around a victim entity. Spawns one at the victim's position (marked as source) and distributes remaining embers in a circular pattern with randomized variance. Special handling for `numembers == 2` spawns two embers at offset positions.
* **Parameters:**
  - `victim` -- entity to spawn embers around
  - `numembers` -- total number of embers to spawn
* **Returns:** None
* **Error states:** Errors if `victim` is nil or lacks `Transform` component (nil dereference on `victim.Transform:GetWorldPosition()`)

### `GiveEmbers(inst, num, pos)`
* **Description:** Spawns an ember prefab, sets its stack size, and gives it to the target entity's inventory at the specified position.
* **Parameters:**
  - `inst` -- entity to receive embers (must have inventory component)
  - `num` -- number of embers to stack
  - `pos` -- world position vector for spawn location
* **Returns:** None
* **Error states:** Errors if `inst` lacks `inventory` component (nil dereference on `inst.components.inventory:GiveItem()` — no guard present)

### `GetBurstTargets(player)`
* **Description:** Finds all valid creature entities within `TUNING.FIRE_BURST_RANGE` of the player that can be targeted by fire burst. Filters out allies, companions, non-burnables, already burning entities, and entities with exclusion tags. Is also called from the client-side.
* **Parameters:** `player` -- player entity to search around
* **Returns:** Array of valid target entity instances (may be empty)
* **Error states:** Errors if `player` is nil or lacks `Transform` component (nil dereference on `player.Transform:GetWorldPosition()`)

## Events & listeners
None. This is a utility module with pure functions — no event registration or emission.
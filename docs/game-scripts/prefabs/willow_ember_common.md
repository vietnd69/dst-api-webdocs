---
id: willow_ember_common
title: Willow Ember Common
description: Provides shared utility functions for handling willow embers, including detection, spawning, and target selection logic.
tags: [combat, lighting, utility]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 580a5f95
system_scope: entity
---

# Willow Ember Common

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`willow_ember_common.lua` is a utility module containing helper functions for managing `willow_ember` prefabs in DST. It encapsulates logic for determining whether a victim produces embers, computing how many embers should spawn, positioning embers around a victim, and identifying valid targets for Fire Burst ability. The module does not define a component, but rather returns a table of standalone functions used by Willow-related prefabs and state graphs.

## Usage example
```lua
local fns = require("prefabs/willow_ember_common")

if fns.HasEmbers(victim) then
    local num = fns.GetNumEmbers(victim)
    fns.SpawnEmbersAt(victim, num)
end

local targets = fns.GetBurstTargets(player)
for _, target in ipairs(targets) do
    -- Apply fire damage
end
```

## Dependencies & tags
**Components used:** `burnable`, `inventory`, `stackable`, `combat` (via replica)
**Tags:** Uses `EMBERS_ONEOFTAGS` (`"animal"`, `"character"`, `"largecreature"`, `"monster"`, `"smallcreature"`) in `HasEmbers`; checks `noember`, `epic`, `largecreature`, `canlight`, `nolight`, `fire`, `bigbernie`, `companion`, `INLIMBO`, `flight`, `player`, `ghost`, `invisible`, `noattack`, `notarget`.

## Properties
No public properties. This is a functional module returning a table of functions.

## Main functions
### `HasEmbers(victim)`
* **Description:** Determines whether the given entity should produce embers — i.e., is burning, not explicitly denied, and matches one of the required creature types.
* **Parameters:** `victim` (instance) — the entity to check.
* **Returns:** boolean — `true` if all conditions are met, `false` otherwise.

### `GetNumEmbers(victim)`
* **Description:** Computes how many embers to spawn based on the victim’s tags and randomness.
* **Parameters:** `victim` (instance) — the entity whose ember count is computed.
* **Returns:** number — number of embers (7–8 for `"epic"`, 3 for `"largecreature"`, otherwise 1).
* **Error states:** Assumes `HasEmbers(victim)` has already been verified; no explicit validation is performed.

### `SpawnEmberAt(x, y, z, victim, marksource)`
* **Description:** Spawns a single `willow_ember` prefab at the specified world coordinates.
* **Parameters:**  
  - `x`, `y`, `z` (numbers) — world position.  
  - `victim` (instance or `nil`) — source entity; may be used to inherit ember source ID.  
  - `marksource` (boolean) — if `true`, assigns `_embersource` on the ember if available on `victim`.
* **Returns:** Nothing.
* **Error states:** None documented.

### `SpawnEmbersAt(victim, numembers)`
* **Description:** Spawns a specified number of embers in a distributed pattern around the victim's position, with different logic for `numembers == 2` versus `numembers > 2`.
* **Parameters:**  
  - `victim` (instance) — source entity; its position is used as the center.  
  - `numembers` (number) — total embers to spawn.
* **Returns:** Nothing.
* **Error states:** When `numembers == 2`, exactly one ember is guaranteed to inherit `_embersource`; the second is not. When `numembers > 2`, only the first ember has `marksource = true`.

### `GiveEmbers(inst, num, pos)`
* **Description:** Creates a `willow_ember` stack and attempts to give it to `inst`'s inventory component.
* **Parameters:**  
  - `inst` (instance) — the entity receiving the ember stack.  
  - `num` (number) — stack size.  
  - `pos` (vector3 or `nil`) — drop position; if `nil`, uses default inventory logic.
* **Returns:** Nothing.
* **Error states:** If the `stackable` component is missing on the spawned ember, stack size is not applied.

### `GetBurstTargets(player)`
* **Description:** Finds entities within Fire Burst range that are valid targets for Willow’s Fire Burst ability (ignores allies, companions, non-burnables, and already-burning entities).
* **Parameters:** `player` (instance) — the source entity; used for position and combat context.
* **Returns:** array of instances — list of valid targets within `TUNING.FIRE_BURST_RANGE`.
* **Error states:** The function modifies the input array in-place by compacting elements (overwriting `nil` gaps), so the result array may have fewer elements than the original `FindEntities` result.

## Events & listeners
None identified. This module does not register or fire events itself.
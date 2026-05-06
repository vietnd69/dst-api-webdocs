---
id: mapspotrevealer
title: Mapspotrevealer
description: Manages map revelation mechanics for entities that can reveal areas of the world map to players.
tags: [map, revelation, ui]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 785e8a05
system_scope: ui
---

# Mapspotrevealer

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`MapSpotRevealer` enables entities to reveal portions of the world map to players when activated. It uses configurable callback functions to determine the target position and validate whether revelation should occur. This component is commonly used on structures or items that provide map exploration benefits, such as cartographer's desks or map-revealing consumables.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("mapspotrevealer")

inst.components.mapspotrevealer:SetGetTargetFn(function(inst, doer)
    return inst:GetPosition(), nil
end)

inst.components.mapspotrevealer:SetPreRevealFn(function(inst, doer)
    return doer.components.inventory:Has("map_scroll")
end)

inst.components.mapspotrevealer:RevealMap(player)
```

## Dependencies & tags
**Components used:**
- `player_classified` -- accessed on doer to trigger map revelation events and set reveal coordinates

**Tags:**
- `mapspotrevealer` -- added on component initialization, removed in `OnRemoveFromEntity()`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity instance that owns this component. |
| `gettargetfn` | function | `nil` | Callback function that returns the target position for map revelation. |
| `prerevealfn` | function | `nil` | Optional callback function to validate if revelation should proceed. |
| `open_map_on_reveal` | boolean | `true` | Whether to open the map UI when revelation occurs. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when the component is removed from its entity. Removes the `mapspotrevealer` tag from the entity.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetGetTargetFn(fn)`
* **Description:** Sets the callback function used to determine the target position for map revelation.
* **Parameters:** `fn` -- function that takes `(inst, doer)` and returns `(position, reason)` or `(nil, reason)`
* **Returns:** None
* **Error states:** None

### `SetPreRevealFn(fn)`
* **Description:** Sets the optional callback function to validate whether map revelation should be allowed before proceeding.
* **Parameters:** `fn` -- function that takes `(inst, doer)` and returns `true` to allow or `false` to block revelation
* **Returns:** None
* **Error states:** None

### `RevealMap(doer)`
* **Description:** Executes the map revelation process for the specified player. Calls prereveal check, gets target position, and triggers map reveal events on the player's classified component.
* **Parameters:** `doer` -- player entity that will receive the map revelation
* **Returns:** `true` on success, `false, reason` on failure (reasons: `"NO_TARGET"`, `"NO_MAP"`)
* **Error states:** Errors if `doer` is nil (no nil guard before `doer.player_classified` access — will crash on nil dereference)

## Events & listeners
- **Listens to:** None
- **Pushes:** 
  - `on_reveal_map_spot_pre` -- fired before map revelation occurs, includes target position
  - `on_reveal_map_spot_pst` -- fired after map revelation completes, includes target position
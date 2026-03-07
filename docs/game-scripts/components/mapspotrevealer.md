---
id: mapspotrevealer
title: Mapspotrevealer
description: Adds functionality to an entity to reveal map areas at specified locations, supporting pre-reveal hooks and conditional map opening.
tags: [map, reveal, interaction]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: dcf858ae
system_scope: entity
---

# Mapspotrevealer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MapSpotRevealer` enables an entity to reveal specific map locations upon an action, such as activating an item or completing a task. It is typically attached to items (e.g., maps, compasses) or interactable objects that grant map exploration progress. The component manages validation of reveal permissions via optional callback functions, coordinates map revealing logic, and fires events before and after the reveal. It also optionally triggers the in-game map UI to open automatically.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("mapspotrevealer")

-- Set the function that returns the world coordinates to reveal
inst.components.mapspotrevealer:SetGetTargetFn(function(entity, doer)
    return Vector3(100, 0, -200)  -- target map position
end)

-- Optionally set a pre-reveal gate (e.g., check condition)
inst.components.mapspotrevealer:SetPreRevealFn(function(entity, doer)
    return doer.components.inventory ~= nil  -- only if doer has inventory
end)

-- Perform the reveal
inst.components.mapspotrevealer:RevealMap(doer)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds and removes the `mapspotrevealer` tag.  
**Replica usage:** Interacts with `doer.player_classified.revealmapspot_worldx`, `revealmapspot_worldz`, `revealmapspotevent`, and `MapExplorer:RevealArea(...)`, indicating integration with the player's replicated classified component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `gettargetfn` | function\|nil | `nil` | Callback `fn(entity, doer) → Vector3\|nil, string?` that returns the world position to reveal. |
| `prerevealfn` | function\|nil | `nil` | Optional gate callback `fn(entity, doer) → boolean` that returns `false` to abort reveal. |
| `open_map_on_reveal` | boolean | `true` | Whether to open the map UI after revealing the spot. |

## Main functions
### `SetGetTargetFn(fn)`
* **Description:** Sets the callback function used to determine the map coordinates to reveal. The function is invoked during `RevealMap`.
* **Parameters:** `fn` (function) – signature: `fn(entity: Entity, doer: Entity) → (Vector3 \| nil, reason?: string)`.
* **Returns:** Nothing.

### `SetPreRevealFn(fn)`
* **Description:** Sets an optional pre-reveal validation callback. If this function returns `false`, the reveal is cancelled.
* **Parameters:** `fn` (function) – signature: `fn(entity: Entity, doer: Entity) → boolean`.
* **Returns:** Nothing.

### `RevealMap(doer)`
* **Description:** Initiates the map reveal sequence for the current target position. Executes pre-reveal checks, fires events, updates the doer's map state, and optionally opens the map.
* **Parameters:** `doer` (Entity) – the entity triggering the reveal (typically the player).
* **Returns:** `true` on success, or `{false, reason}` (e.g., `"NO_TARGET"`, `"NO_MAP"`) on failure.
* **Error states:**
  - Returns `{false, "NO_TARGET"}` if `gettargetfn` is `nil` or returns `nil`/invalid position.
  - Returns `{false, "NO_MAP"}` if `doer` lacks `player_classified`.
  - Returns `true` early (without further action) if `prerevealfn` explicitly returns `false`.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:**
  - `on_reveal_map_spot_pre` – fired just before map reveal logic; payload: `targetpos` (Vector3).
  - `on_reveal_map_spot_pst` – fired after map reveal completes; payload: `targetpos` (Vector3).

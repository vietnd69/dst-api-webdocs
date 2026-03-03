---
id: homeseeker
title: Homeseeker
description: Tracks and provides navigation logic to a designated home entity for an actor.
tags: [navigation, ai, home]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8da11099
system_scope: locomotion
---

# Homeseeker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HomeSeeker` manages an entity's association with a designated home entity (e.g., a structure, bed, or spawn point). It enables the actor to seek its home using buffered movement actions and provides utilities to query home presence, position, and travel time. It automatically cleans up when the home entity is removed and can optionally remove itself from the actor in that case.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("homeseeker")

local home = TheWorld.components.homekeeper:GetPreferredHome(inst)
if home then
    inst.components.homeseeker:SetHome(home)
    inst.components.homeseeker:GoHome(false)  -- walk, not run
end

-- Later, to check if home is still valid:
if inst.components.homeseeker:HasHome() then
    print("Home is safe and accessible.")
else
    print("Home is missing or burning.")
end
```

## Dependencies & tags
**Components used:** `burnable`, `locomotor`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to. |
| `removecomponent` | boolean | `true` | Controls whether this component is automatically removed when its home is removed. |
| `home` | `Entity?` | `nil` | The currently assigned home entity. |

## Main functions
### `HasHome()`
* **Description:** Determines if the actor currently has a valid, non-burning home. Returns `false` if no home is set or if the home exists but is burning.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `self.home` is non-nil and not burning; otherwise `false`.

### `GetHome()`
* **Description:** Returns the currently assigned home entity.
* **Parameters:** None.
* **Returns:** `Entity?` — The home entity, or `nil` if none is set.

### `SetHome(home)`
* **Description:** Assigns a new home entity and sets up a listener to clean up when that home is removed.
* **Parameters:** `home` (`Entity?`) — The new home entity, or `nil` to unset it.
* **Returns:** Nothing.

### `GoHome(shouldrun)`
* **Description:** Initiates a buffered `ACTIONS.GOHOME` action toward the assigned home. Uses the locomotor component if present to perform movement; otherwise falls back to direct buffered action dispatch.
* **Parameters:** `shouldrun` (`boolean`) — If `true`, prioritizes running speed when computing travel time and movement behavior.
* **Returns:** Nothing.

### `GetHomePos()`
* **Description:** Retrieves the world position of the home entity.
* **Parameters:** None.
* **Returns:** `Vector3?` — The home’s world position (`x, y, z`) as returned by `home:GetPosition()`, or `nil` if no home is set.

### `GetHomeDirectTravelTime()`
* **Description:** Computes an estimated time (in seconds) to walk directly to the home if the path were unobstructed, using Euclidean distance and current movement speed.
* **Parameters:** None.
* **Returns:** `number?` — Travel time estimate; `nil` if no home is assigned or the home has no transform.
* **Error states:** May return `nil` if `TUNING.WILSON_WALK_SPEED` is unavailable or the home has no valid transform.

## Events & listeners
- **Listens to:** `onremove` — Registered on the home entity; fires `self.onhomeremoved(home)` when the home is removed. Resets `self.home` and optionally removes the `homeseeker` component itself.
- **Pushes:** None identified.

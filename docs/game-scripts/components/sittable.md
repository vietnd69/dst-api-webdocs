---
id: sittable
title: Sittable
description: Manages entity seating state and occupier tracking for interactive furniture-like objects.
tags: [interaction, entity, state, furniture, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2caa10ce
system_scope: entity
---

# Sittable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Sittable` enables an entity to be occupied by a character (typically for sitting), managing occupier lifecycle and tag state (`cansit`). It integrates with the `burnable` component to propagate fire events to occupants when the sittable object ignites. The component tracks whether the entity is currently occupied, who occupies it, and updates tags and events accordingly.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sittable")
-- Automatically adds "cansit" tag and fires "becomesittable"
inst.components.sittable:SetOccupier(player)
assert(inst.components.sittable:IsOccupied())
inst.components.sittable:EjectOccupier()
```

## Dependencies & tags
**Components used:** `burnable` (optional, checked dynamically)  
**Tags:** Adds `cansit` on initialization; removes `cansit` when occupied; removes `cansit` on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `occupier` | `Entity` or `nil` | `nil` | The entity currently occupying the seat (e.g., a player). |

## Main functions
### `SetOccupier(occupier)`
* **Description:** Sets or clears the occupier of the sittable entity. Updates event callbacks and tags based on occupancy state.
* **Parameters:** `occupier` (`Entity` or `nil`) — the entity sitting, or `nil` to vacate the seat.
* **Returns:** Nothing.
* **Error states:** No-op if the new occupier is identical to the current one.

### `IsOccupied()`
* **Description:** Checks whether the entity is currently occupied.
* **Parameters:** None.
* **Returns:** `true` if an occupier exists, otherwise `false`.

### `IsOccupiedBy(occupier)`
* **Description:** Checks whether the specific entity is the current occupier.
* **Parameters:** `occupier` (`Entity`) — the entity to check against the current occupier.
* **Returns:** `true` if `occupier` matches the current occupier and is non-`nil`, otherwise `false`.

### `EjectOccupier()`
* **Description:** Clears the occupier state (without calling `SetOccupier(nil)`) and fires `"becomeunsittable"` if occupied.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does not update callbacks or clean up occupier references beyond the event push.

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when the component is removed from its entity. Cleans up event callbacks, removes the `cansit` tag, and fires `"becomeunsittable"`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onremove"` (on occupier) — triggers `SetOccupier(nil)` when the occupier is removed.  
  - `"onignite"` (on self) — fires only if `burnable` exists; notifies the occupier of fire.  
- **Pushes:**  
  - `"becomesittable"` — fires when the entity becomes available to sit (tag `cansit` added or occupier cleared).  
  - `"becomeunsittable"` — fires when the entity becomes occupied or is being removed (tag `cansit` removed).  
  - `"sittableonfire"` — pushed to the occupier when the sittable entity ignites.

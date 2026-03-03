---
id: physicsmodifiedexternally
title: Physicsmodifiedexternally
description: Manages externally applied velocity contributions to an entity's physics, aggregating multiple sources and updating physics and locomotor state.
tags: [physics, locomotion, network, entity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e47900d7
system_scope: physics
---
# Physicsmodifiedexternally

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Physicsmodifiedexternally` is a component that aggregates external velocity inputs from multiple sources (e.g., boats, currents, or other entities) and applies the resulting vector to the entity's physics system. It ensures all velocity contributions are centralized and correctly synced between server and client. The component interacts directly with the `physics` and `locomotor` components and coordinates with `boatphysics` for drag calculations when applicable. It automatically removes itself when all velocity sources are cleared.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("physicsmodifiedexternally")

-- Add a source (e.g., a boat or another entity)
inst.components.physicsmodifiedexternally:AddSource(other_inst)

-- Set velocity contribution from that source
inst.components.physicsmodifiedexternally:SetVelocityForSource(other_inst, 2.0, -1.5)
```

## Dependencies & tags
**Components used:** `Physics` (via `inst.Physics`), `locomotor`, `boatphysics`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sources` | table | `{}` | Dictionary mapping source entities (or tokens) to `{x, z}` velocity vectors. |
| `totalvelocityx` | number | `0` | Summed X-component of all external velocities (updated on recalculation). |
| `totalvelocityz` | number | `0` | Summed Z-component of all external velocities (updated on recalculation). |

## Main functions
### `SetVelocityForSource(src, velx, velz)`
* **Description:** Sets the external velocity vector for a specific source and triggers recalculation of the total external velocity.  
* **Parameters:**  
  - `src` (any hashable value, typically an entity instance or token) – identifier for the velocity source.  
  - `velx` (number) – X-component of the velocity contribution.  
  - `velz` (number) – Z-component of the velocity contribution.  
* **Returns:** Nothing.  
* **Error states:** Does nothing if `src` has not been added via `AddSource`.

### `AddSource(src)`
* **Description:** Registers a new velocity source and optionally listens for its `onremove` event to auto-cleanup.  
* **Parameters:**  
  - `src` (any hashable value) – identifier for the source.  
* **Returns:** Nothing.  
* **Error states:** Idempotent – no effect if `src` is already registered.

### `RemoveSource(src)`
* **Description:** Removes a velocity source, cleans up its event listener, and triggers recalculation.  
* **Parameters:**  
  - `src` (any hashable value) – identifier for the source.  
* **Returns:** Nothing.  
* **Error states:** No-op if `src` is not registered.

### `RecalculateExternalVelocity()`
* **Description:** Computes the aggregate external velocity, applies drag if `boatphysics` is present, and updates both the physics engine and locomotor component.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** None.

### `OnRemoveFromEntity()`
* **Description:** Server-side cleanup hook. Resets all external physics values, cancels event listeners, and broadcasts the `losephysicsmodifiedexternally` event.  
* **Parameters:** None.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (on registered sources, excluding self) – removes source when the source entity is removed.
- **Pushes:**  
  - `gainphysicsmodifiedexternally` – fired during construction upon successful initialization.  
  - `losephysicsmodifiedexternally` – fired during `OnRemoveFromEntity`.

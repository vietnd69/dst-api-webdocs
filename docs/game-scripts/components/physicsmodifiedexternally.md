---
id: physicsmodifiedexternally
title: Physicsmodifiedexternally
description: Manages a collection of external velocity sources to compute and apply combined motor velocity to an entity's physics component, with special handling for boats.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: e47900d7
---

# Physicsmodifiedexternally

## Overview
This component tracks external velocity contributions from multiple sources, sums them, and applies the resulting vector to the entity's physics system via `SetMotorVelExternal`. It also coordinates with the `locomotor` and `boatphysics` components to ensure correct motion behavior, particularly accounting for anchor drag on boats. It automatically removes itself when all sources are removed.

## Dependencies & Tags
- **Component Requirements:**
  - The entity must have the `physics` component (for `SetMotorVelExternal`).
  - May optionally depend on `locomotor` (to sync `externalvelocityvectorx`/`z`) and `boatphysics` (to apply drag adjustments).
- **Tags/Events:**
  - Pushes `"gainphysicsmodifiedexternally"` upon construction.
  - Pushes `"losephysicsmodifiedexternally"` upon removal.

## Properties
No public instance properties are initialized in `_ctor` beyond internal state; however, the following are used internally as mutable state:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sources` | `table` | `{}` | Map of source entities → `{x, z}` velocity vectors. Keys are source entities; values are `{x, z}` tables. |
| `totalvelocityx` | `number` | `0` | Cumulative X-component of external velocity (updated on recalculation). |
| `totalvelocityz` | `number` | `0` | Cumulative Z-component of external velocity (updated on recalculation). |
| `_onremovesource` | `function` | (see implementation) | Callback function triggered when a source entity is removed; cleans up that source and potentially self-destructs. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Cleans up the component on removal: resets external physics velocity to zero, nullifies locomotor external velocity, unregisters `onremove` listeners for all sources, and notifies listeners of component removal via `"losephysicsmodifiedexternally"`.
* **Parameters:** None.

### `RecalculateExternalVelocity()`
* **Description:** Sums all stored source velocity vectors, applies boat-specific drag if `boatphysics` is present, then updates both `Physics:SetMotorVelExternal()` and `locomotor.externalvelocityvector*` fields. Drag reduces total velocity based on anchor drag, scaled by tuning constants.
* **Parameters:** None.

### `SetVelocityForSource(src, velx, velz)`
* **Description:** Updates the velocity contribution of a specific source (`src`) and triggers a recalculation.
* **Parameters:**
  - `src`: The entity providing the velocity source.
  - `velx`: X-component of the velocity vector.
  - `velz`: Z-component of the velocity vector.

### `AddSource(src)`
* **Description:** Registers a new velocity source. If not already tracked, initializes its `{x, z}` velocity to `{0, 0}` and sets up a listener to auto-remove it if the source entity is destroyed.
* **Parameters:**
  - `src`: The entity acting as a velocity source.

### `RemoveSource(src)`
* **Description:** Removes a previously added source, unregisters its removal listener (if applicable), and triggers cleanup via `_onremovesource`. May cause component removal if no sources remain.
* **Parameters:**
  - `src`: The source entity to remove.

## Events & Listeners
- **Listens for events:**
  - `"onremove"` on each registered source entity (except `self.inst`), to automatically clean up the source when the source entity is removed.
- **Triggers events:**
  - `"gainphysicsmodifiedexternally"` when the component is fully constructed.
  - `"losephysicsmodifiedexternally"` when `OnRemoveFromEntity` is called.
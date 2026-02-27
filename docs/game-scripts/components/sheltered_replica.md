---
id: sheltered_replica
title: Sheltered Replica
description: This component manages the shading state (sheltered vs. exposed) of an entity's animation by dynamically adjusting its override shade value over time based on network-synchronized shelter status.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: b46dadbb
---

# Sheltered Replica

## Overview
The `Sheltered` component controls the visual shading transition of an entity between `SHELTERED_SHADE` (.6) and `EXPOSED_SHADE` (1.0). It responds to changes in the sheltered state—synchronized via a `net_bool`—and smoothly interpolates the shade value over time using either a sheltering or exposing speed. The final shade is applied to the entity’s `AnimState`. This component is typically used for entities like replicas or shades that should visually dim when sheltered (e.g., behind cover) and brighten when exposed.

## Dependencies & Tags
- **Components used:** `inst.AnimState` (assumed present on the entity), `inst:DoTaskInTime`, `inst:StartUpdatingComponent`, `inst:StopUpdatingComponent`, `inst:ListenForEvent`
- **Networked property:** `net_bool("sheltered._issheltered")` named `"issheltereddirty"` on client
- **Tags added/removed:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_updating` | `boolean` | `false` | Indicates whether the component is actively updating the shade each frame. |
| `_shade` | `number` | `1.0` (EXPOSED_SHADE) | Current interpolated shade value applied to `AnimState`. |
| `_targetshade` | `number` | `1.0` (EXPOSED_SHADE) | Target shade value based on `_issheltered` status. |
| `_shelterspeed` | `number` | `(1.0 - 0.6) / 0.2 = 2.0` | Rate of decrease per second when transitioning from exposed to sheltered. |
| `_exposespeed` | `number` | `(1.0 - 0.6) / 0.1 = 4.0` | Rate of increase per second when transitioning from sheltered to exposed. |
| `_issheltered` | `net_bool` | `nil` | Networked boolean flag representing whether the entity is in a sheltered state. |

## Main Functions

### `StartSheltered(level)`
* **Description:** Marks the entity as sheltered (sets `_issheltered` to `true`) and triggers a shade check to initiate transition to sheltered shading.
* **Parameters:**
  - `level` — *Unused* in current implementation (appears to be for future/extensibility compatibility).

### `StopSheltered()`
* **Description:** Marks the entity as not sheltered (sets `_issheltered` to `false`) and triggers a shade check to initiate transition to exposed shading.

### `IsSheltered()`
* **Description:** Returns `true` if the entity is currently considered sheltered, i.e., `_issheltered` is `true` *and* the current `_shade` is at or below `SHELTERED_SHADE`.
* **Returns:** `boolean`

### `CheckShade()`
* **Description:** Updates `_targetshade` based on `_issheltered`’s current value and starts/stops the animation update loop if the current shade (`_shade`) does/does not match the target. Ensures the shade interpolation loop is active only when needed.
* **Parameters:** None

### `OnUpdate(dt)`
* **Description:** Interpolates `_shade` toward `_targetshade` using `_shelterspeed` (decrease) or `_exposespeed` (increase), clamping between `SHELTERED_SHADE` and `EXPOSED_SHADE`. Updates the `AnimState` override with the new `_shade`. Stops the update loop when the target is reached.
* **Parameters:**
  - `dt` — Delta time in seconds (passed automatically by the entity update loop).

## Events & Listeners
- Listens for `"issheltereddirty"` event (client-side only) to trigger `CheckShade()` when the networked `_issheltered` value changes.
- Triggers: `"issheltereddirty"` internally via `net_bool` synchronization (not explicitly `PushEvent`-based, but implied by the `net_bool` setter).
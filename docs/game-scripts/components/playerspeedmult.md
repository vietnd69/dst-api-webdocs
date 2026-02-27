---
id: playerspeedmult
title: Playerspeedmult
description: Manages player movement speed modifiers that do not stack with mount speed, supporting both server-authoritative and predicted (client-side) speed adjustments with optional capping.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 95888f78
---

# Playerspeedmult

## Overview
This component manages player movement speed modifiers in Don't Starve Together by overriding `locomotor.runspeed` and `locomotor.predictrunspeed`. It provides non-stacking speed modifications—distinct from mount speed—by maintaining separate modifier lists for uncapped and capped server-side and predicted speed multipliers. It ensures predicted speed values are preserved on clients for smooth movement interpolation and supports dynamic updates via dirty callbacks.

## Dependencies & Tags
- **Component Dependencies:** Relies on `locomotor` component (`inst.components.locomotor`) and `classified` component (`self.classified`) for networked state (`psm_basespeed`, `psm_servermult`, `psm_cappedservermult`).
- **Event Listeners:** Listens to `"onremove"` event on the attached `classified` component to clean up detachment handlers.
- **Tags/Properties Used:** Uses `psm_basespeed`, `psm_servermult`, `psm_cappedservermult` properties from the `classified` component (expected to be a `PlayerClassified` instance).
- **No explicit tag additions or removals**.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity the component is attached to. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | Indicates whether this instance runs on the server/mastersim. |
| `multcap` | `number?` | `nil` | Optional upper bound on effective speed multiplier; if set, speed values exceeding it are clamped proportionally. |
| `_predictedmults` | `SourceModifierList` | New instance | List of predicted speed multipliers (client-side only, non-stacking with server). |
| `_cappedpredictedmults` | `SourceModifierList` | New instance | List of capped predicted speed multipliers. |
| `_mults` (server only) | `SourceModifierList` | New instance | List of server-authoritative speed multipliers. |
| `_cappedmults` (server only) | `SourceModifierList` | New instance | List of capped server-authoritative speed multipliers. |
| `classified` | `Entity?` | `nil` | Optional `PlayerClassified` entity used to sync speed state across network. |
| `ondetachclassified` | `function?` | `nil` | Callback hook for classified removal. |
| `inittask` | `DoTaskInTime?` | `nil` | Lazy initialization task used on server to cache base speed. |

## Main Functions

### `SetSpeedMult(source, m)`
* **Description:** Sets an uncapped, server-authoritative speed multiplier. This modifier does *not* stack with mount speed or other uncapped multipliers—only the highest-priority one (via `SourceModifierList`) is applied. Triggers recaching of base speed and updates the `psm_servermult` netvar on the `classified` component.
* **Parameters:**
  - `source`: Identifier (usually an `Entity` or `Recipe` instance) associated with the modifier.
  - `m` (`number`): The speed multiplier (e.g., `1.5` for 50% faster).

### `RemoveSpeedMult(source)`
* **Description:** Removes a previously set uncapped server multiplier. Triggers update of `psm_servermult` netvar.
* **Parameters:**
  - `source`: The same identifier used in `SetSpeedMult`.

### `SetCappedSpeedMult(source, m)`
* **Description:** Sets a server-authoritative speed multiplier that is subject to the global `multcap`. Used for modifiers that must respect a speed ceiling.
* **Parameters:**
  - `source`: Identifier for the modifier.
  - `m` (`number`): The multiplier before capping.

### `RemoveCappedSpeedMult(source)`
* **Description:** Removes a capped server multiplier and updates the `psm_cappedservermult` netvar.
* **Parameters:**
  - `source`: Identifier used when setting the multiplier.

### `SetPredictedSpeedMult(source, m)`
* **Description:** Sets a client-predicted speed multiplier (used for latency smoothing). Not authoritative—does *not* modify networked state directly. Combined with uncapped/predicted modifiers in the final speed calculation.
* **Parameters:**
  - `source`: Identifier for the modifier.
  - `m` (`number`): The multiplier.

### `RemovePredictedSpeedMult(source)`
* **Description:** Removes a client-predicted multiplier.
* **Parameters:**
  - `source`: Identifier used when setting the multiplier.

### `SetCappedPredictedSpeedMult(source, m)`
* **Description:** Sets a client-predicted multiplier subject to `multcap`.
* **Parameters:**
  - `source`: Identifier.
  - `m` (`number`): The multiplier before capping.

### `RemoveCappedPredictedSpeedMult(source)`
* **Description:** Removes a capped predicted multiplier.
* **Parameters:**
  - `source`: Identifier.

### `SetSpeedMultCap(cap)`
* **Description:** Configures an optional global speed multiplier cap. All effective multipliers (after combining uncapped/capped lists) are clamped if they exceed this value.
* **Parameters:**
  - `cap` (`number?`): Non-negative cap value, or `nil` to disable capping.

### `ApplyRunSpeed_Internal()`
* **Description:** Computes and sets `locomotor.runspeed` (server) or `locomotor.predictrunspeed` (client) based on the product of uncapped/capped multipliers from server and predicted lists. Implements capping logic and fallback to base speed (`TUNING.WILSON_RUN_SPEED` or `classified.psm_basespeed`).
* **Parameters:** None. Called internally on speed multipliers changing, and on clients via `classified` dirty events.

### `TryRecacheBaseSpeed_Internal()`
* **Description:** On server, caches the current `locomotor.runspeed` to `classified.psm_basespeed` *if no modifiers are active*. Ensures baseline speed is preserved when modifiers are removed. Prevents overwriting a manually set base speed while modifiers exist.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string summarizing the current state of all multiplier lists, cap, and base speed.
* **Parameters:** None.

## Events & Listeners
- **Listens to `"onremove"` event on `self.classified`** — triggers `self.ondetachclassified`, which calls `DetachClassified()` to clean up references.
- **Pushes `"dirty"` events indirectly** — via `SourceModifierList` dirty callbacks (`OnDirty`) bound to `self`, which call `ApplyRunSpeed_Internal()`.
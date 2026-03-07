---
id: roseinspectable
title: Roseinspectable
description: Manages callbacks and configuration for rose inspection interactions and residue handling.
tags: [inspection, entity, callback]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: af74711a
system_scope: entity
---

# Roseinspectable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Roseinspectable` is a lightweight component that allows an entity to respond to rose inspection events and manage residue-related behavior. It stores optional callback functions for three phases: determining if a residue can be spawned, creating a residue, and activating a residue upon inspection. It is typically attached to entities that interact with the rose or related mechanics.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("roseinspectable")

inst.components.roseinspectable:SetCanResidueBeSpawnedBy(function(inst, doer) return doer:HasTag("player") end)
inst.components.roseinspectable:SetOnResidueCreated(function(inst, owner, residue) print("Residue created") end)
inst.components.roseinspectable:SetOnResidueActivated(function(inst, doer) print("Residue activated") end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `forcedinducedcooldown` | boolean or `nil` | `nil` | If set, overrides default cooldown induction behavior. |
| `willinducecooldownonactivatefn` | function or `nil` | `nil` | Callback to determine if activating induces a cooldown. |
| `onresidueactivatedfn` | function or `nil` | `nil` | Callback triggered when the residue is activated. |
| `onresiduecreatedfn` | function or `nil` | `nil` | Callback triggered when a residue is created. |
| `canresiduebespawnedbyfn` | function or `nil` | `nil` | Callback to decide if a given doer may spawn a residue. |

## Main functions
### `SetOnResidueActivated(fn)`
*   **Description:** Registers the callback invoked when the rose inspection successfully activates a residue.
*   **Parameters:** `fn` (function) — Signature: `(inst, doer)`.
*   **Returns:** Nothing.

### `SetOnResidueCreated(fn)`
*   **Description:** Registers the callback invoked after a residue is created (e.g., during initial setup).
*   **Parameters:** `fn` (function) — Signature: `(inst, residueowner, residue)`.
*   **Returns:** Nothing.

### `SetCanResidueBeSpawnedBy(fn)`
*   **Description:** Registers the callback used to validate whether a specific entity (`doer`) may spawn a residue.
*   **Parameters:** `fn` (function) — Signature: `(inst, doer)`.
*   **Returns:** Nothing.

### `CanResidueBeSpawnedBy(doer)`
*   **Description:** Invokes the stored `canresiduebespawnedbyfn` callback (if present) or defaults to `true`.
*   **Parameters:** `doer` (Entity) — The entity attempting to spawn the residue.
*   **Returns:** `boolean` — Whether spawning is permitted.

### `SetForcedInduceCooldownOnActivate(bool)`
*   **Description:** Forces the component to return a fixed value from `WillInduceCooldownOnActivate`, bypassing any custom function.
*   **Parameters:** `bool` (boolean) — The fixed return value for cooldown induction checks.
*   **Returns:** Nothing.

### `SetWillInduceCooldownOnActivate(fn)`
*   **Description:** Registers a custom callback to determine if activation should trigger a cooldown.
*   **Parameters:** `fn` (function) — Signature: `(inst, doer)`.
*   **Returns:** Nothing.

### `WillInduceCooldownOnActivate(doer)`
*   **Description:** Returns whether the activation should trigger a cooldown, prioritizing a forced value over a custom function.
*   **Parameters:** `doer` (Entity) — The entity performing activation.
*   **Returns:** `boolean` — `forcedinducedcooldown` if set, else the result of `willinducecooldownonactivatefn`, or `false`.

### `HookupResidue(residueowner, residue)`
*   **Description:** Invokes the `onresiduecreatedfn` callback (if any) to perform post-residue-creation logic.
*   **Parameters:**  
    *   `residueowner` (Entity) — The entity that owns the residue.  
    *   `residue` (Entity) — The spawned residue entity.
*   **Returns:** Nothing.

### `DoRoseInspection(doer)`
*   **Description:** Invokes the `onresidueactivatedfn` callback (if any) to handle the activation phase of inspection.
*   **Parameters:** `doer` (Entity) — The entity performing the rose inspection.
*   **Returns:** Nothing.

## Events & listeners
None identified

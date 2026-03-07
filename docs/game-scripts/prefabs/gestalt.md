---
id: gestalt
title: Gestalt
description: Spawns the Brightmare Gestalt boss entity with tailored combat, tracking, and sanity-based transparency behaviors.
tags: [boss, combat, tracking, transparency]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a3690793
system_scope: entity
---

# Gestalt

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `gestalt` prefab constructs the Brightmare Gestalt boss entity—a dynamic, player-targeting enemy that tracks the nearest viable player within a defined range, respects sleep/protected states, and adjusts its visual transparency based on observer sanity. It integrates the `brightmarespawner` component for target selection and employs the `gestaltcapturable` component to handle capture logic. The prefab also spawns an associated `gestalt_trail` FX entity on creation.

## Usage example
```lua
--Typical use is via Prefab("gestalt", fn, assets, prefabs), not manual instantiation.
--However, to reference its core properties after spawning:
local gestalt = SpawnPrefab("gestalt")
if gestalt ~= nil and gestalt.components then
    --Example: manually update tracking target
    gestalt:SetTrackingTarget(some_player, 2)
    --Example: inspect sanity-based alpha value via client-only component
    if gestalt.components.transparentonsanity then
        gestalt.components.transparentonsanity:ForceUpdate()
    end
end
```

## Dependencies & tags
**Components used:** `inspectable`, `sanityaura`, `locomotor`, `combat`, `gestaltcapturable`, `transparentonsanity` (client-only), `brightmarespawner` (accessed via `TheWorld.components`).  
**Tags added:** `brightmare`, `brightmare_gestalt`, `NOBLOCK`, `lunar_aligned`, `gestaltcapturable`, `scarytoprey` (added/removed dynamically with combat state).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._level` | `net_tinybyte` (replica) | `1` | Networked level value for replication. |
| `inst.tracking_target` | `entity or nil` | `nil` | Current entity the Gestalt is tracking. |
| `inst.behaviour_level` | `number` | `1` | Behavioral context level used for brain/state logic. |
| `inst._can_despawn` | `boolean` | `false` (until timeout) | Enables despawn after `GESTALT_TIMEOUT`. |
| `inst.blobhead` | `entity or nil` | `nil` (server-only) | Head FX entity parented to the Gestalt (client-only). |
| `inst.OnTrackingTargetRemoved` | `function or nil` | `nil` | Callback set on target removal events. |

## Main functions
### `FindRelocatePoint(inst)`
*   **Description:** Requests a new relocation point for the Gestalt using the `brightmarespawner` component.
*   **Parameters:** `inst` — the Gestalt entity instance.
*   **Returns:** `Vector3 or nil` — world position for relocation, or `nil` if none available.
*   **Error states:** Returns `nil` if `TheWorld.components.brightmarespawner` is missing or fails.

### `SetHeadAlpha(inst, a)`
*   **Description:** Sets the alpha (transparency) of the `blobhead` FX if present.
*   **Parameters:** `a` — alpha value (0 = invisible, 1 = opaque).
*   **Returns:** Nothing.
*   **Error states:** No-op if `inst.blobhead` is `nil`.

### `SetTrackingTarget(inst, target, behaviour_level)`
*   **Description:** Updates the Gestalt's tracking target, removing old listeners and adding new ones for target removal/death.
*   **Parameters:**  
    `target` — the entity to track (or `nil` to clear).  
    `behaviour_level` — numeric context level used by the AI.
*   **Returns:** Nothing.
*   **Error states:** Gracefully handles `nil` target and duplicate assignments.

### `UpdateBestTrackingTarget(inst)`
*   **Description:** Queries `brightmarespawner:FindBestPlayer(inst)` to locate and set the optimal tracking target.
*   **Parameters:** `inst` — the Gestalt entity instance.
*   **Returns:** Nothing.

### `Retarget(inst)`
*   **Description:** Validates the current `tracking_target` for targeting eligibility: checks cooldown, range, sleeping state, and gestalt protection.
*   **Parameters:** `inst` — the Gestalt entity instance.
*   **Returns:** `entity or nil` — the valid target, or `nil` if invalid.
*   **Error states:** Returns `nil` if the target is missing, in cooldown, out of range, sleeping, or protected.

### `OnNewCombatTarget(inst, data)`
*   **Description:** Listener for `newcombattarget` event; adds `inspectable` and `scarytoprey` tags on first combat activation.
*   **Parameters:** `inst` — the Gestalt entity instance.  
    `data` — event payload (unused).
*   **Returns:** Nothing.
*   **Error states:** Adds `inspectable` only if not already present.

### `OnNoCombatTarget(inst)`
*   **Description:** Listener for `droppedtarget`/`losttarget` events; resets combat cooldown and removes inspect tags.
*   **Parameters:** `inst` — the Gestalt entity instance.
*   **Returns:** Nothing.

### `OnCaptured(inst, obj, doer)`
*   **Description:** Callback invoked when the Gestalt is captured; removes the entity entirely.
*   **Parameters:** `inst` — the Gestalt entity instance.  
    `obj` — captured object (unused).  
    `doer` — capturing entity (unused).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `newcombattarget` — triggers `OnNewCombatTarget`.  
- **Listens to:** `droppedtarget` — triggers `OnNoCombatTarget`.  
- **Listens to:** `losttarget` — triggers `OnNoCombatTarget`.  
- **Listens to (per target):** `onremove`, `death` — triggers `OnTrackingTargetRemoved` to clear tracking target.

The `transparentonsanity` component (client-only) uses its own event system but is not directly listened to by `gestalt.lua`; it updates on sanity changes via `ForceUpdate`.
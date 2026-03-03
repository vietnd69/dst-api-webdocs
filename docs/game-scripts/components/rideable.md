---
id: rideable
title: Rideable
description: Manages the ability for an entity to be ridden, including saddle attachment, rider assignment, and ride-tick events.
tags: [locomotion, riding, domestication]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 810bf8e8
system_scope: locomotion
---
# Rideable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Rideable` enables an entity (typically an animal like a beefalo) to serve as a mount. It handles saddle attachment/detachment, rider assignment, periodic ride-tick updates (e.g., for inspiration gain), and integration with domestication and skill systems. The component works closely with `rider`, `saddler`, `domesticatable`, `lootdropper`, `combat`, and `singinginspiration` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("rideable")
inst:AddComponent("domesticatable")
inst:AddComponent("saddler")
inst:AddComponent("lootdropper")

inst.components.rideable:SetSaddleable(true)
inst.components.rideable:SetRequiredObedience(50)
inst.components.rideable:SetCustomRiderTest(function(inst, rider) return rider:HasTag("beefalo") end)
```

## Dependencies & tags
**Components used:** `domesticatable`, `saddler`, `lootdropper`, `combat`, `rider`, `singinginspiration`, `skilltreeupdater`  
**Tags:** Adds `saddleable` (initial), `rideable`, `saddled`; removes `rideable` and `saddled` on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `saddleable` | boolean | `false` | Whether the entity can accept a saddle. |
| `canride` | boolean | `false` | Whether the entity is currently rideable (true only if a valid saddle is attached). |
| `saddle` | Entity or nil | `nil` | The saddle entity currently attached. |
| `rider` | Entity or nil | `nil` | The entity currently riding this mount. |
| `requiredobedience` | number or nil | `nil` | Minimum obedience value required for the mount to be rideable. |
| `lastridetime` | number | `-1000` | Last time a ride occurred, used to compute time since last ride. |
| `riddentask` | DoTask or nil | `nil` | Periodic task for `RiddenTick`. |
| `shouldsave` | boolean | `true` | Whether this component’s state should be persisted during save/restore. |
| `allowed_riders` | table | `{}` | List of entities permitted to ride (custom logic can be layered via `SetCustomRiderTest`). |
| `custom_rider_test` | function or nil | `nil` | Optional predicate `(inst, potential_rider) -> boolean` to validate a rider. |

## Main functions
### `SetRequiredObedience(required)`
* **Description:** Sets the minimum obedience threshold required before the entity can be ridden. If `nil`, obedience is not checked.
* **Parameters:** `required` (number or nil) - Required obedience level.
* **Returns:** Nothing.

### `SetCustomRiderTest(fn)`
* **Description:** Sets a custom predicate function to determine if a given entity is allowed to ride. Overrides the default (always-permit) rider check.
* **Parameters:** `fn` (function) - Signature: `(mount_inst, potential_rider_inst) -> boolean`.
* **Returns:** Nothing.

### `TestObedience()`
* **Description:** Checks whether the mount’s obedience meets the required threshold (if set).
* **Parameters:** None.
* **Returns:** `true` if obedience is sufficient or if no requirement is set; otherwise `false`.

### `TestRider(potential_rider)`
* **Description:** Checks if `potential_rider` is allowed to ride based on `custom_rider_test`.
* **Parameters:** `potential_rider` (Entity) - The candidate rider entity.
* **Returns:** `true` if custom test passes or no test is set; otherwise the result of `custom_rider_test`.

### `SetSaddle(doer, newsaddle)`
* **Description:** Attaches or removes a saddle. If `newsaddle` is `nil`, detaches the current saddle; otherwise attempts to attach it.
* **Parameters:** 
  * `doer` (Entity or nil) - The entity performing the action (used for sound effects and combat targeting).
  * `newsaddle` (Entity or nil) - The saddle entity to equip (or `nil` to unequip).
* **Returns:** Nothing.
* **Error states:** If the entity is not `saddleable`, `newsaddle` is flung away and `doer` may be suggested as a combat target (if `combat` component exists).

### `SetSaddleable(saddleable)`
* **Description:** Enables or disables acceptance of saddles.
* **Parameters:** `saddleable` (boolean).
* **Returns:** Nothing.

### `IsSaddled()`
* **Description:** Checks whether a saddle is currently attached.
* **Parameters:** None.
* **Returns:** `true` if a saddle is attached; otherwise `false`.

### `SetRider(rider)`
* **Description:** Sets the current rider, starting or stopping the `RiddenTick` periodic task accordingly.
* **Parameters:** `rider` (Entity or nil) - The rider entity to assign (or `nil` to dismount).
* **Returns:** Nothing.

### `GetRider()`
* **Description:** Returns the current rider entity.
* **Parameters:** None.
* **Returns:** Entity or `nil`.

### `IsBeingRidden()`
* **Description:** Indicates whether the entity currently has a rider.
* **Parameters:** None.
* **Returns:** `true` if `rider` is non-nil; otherwise `false`.

### `Buck(gentle)`
* **Description:** Triggers a buck event on the rider, typically used when the rider should be dismounted unexpectedly.
* **Parameters:** `gentle` (boolean) - Passed to the `bucked` event data.
* **Returns:** Nothing.

### `TimeSinceLastRide()`
* **Description:** Returns the number of seconds elapsed since the last ride occurred.
* **Parameters:** None.
* **Returns:** number.

### `SetShouldSave(shouldsave)`
* **Description:** Controls whether the component’s state should be serialized during world save.
* **Parameters:** `shouldsave` (boolean).
* **Returns:** Nothing.

### `ShouldSave()`
* **Description:** Returns whether the component’s state is currently configured to be saved.
* **Parameters:** None.
* **Returns:** boolean.

### `OnSaveDomesticatable()`
* **Description:** Serializes saddle and ride-time state for saving.
* **Parameters:** None.
* **Returns:** table or `nil` — Contains `saddle` (save record) and `lastridedelta` (seconds since last ride), or `nil` if empty.

### `OnLoadDomesticatable(data, newents)`
* **Description:** Restores saddle and last-ride time from save data.
* **Parameters:** 
  * `data` (table) — Save record with `saddle` and `lastridedelta`.
  * `newents` (table) — Mapped entity IDs for restoration.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a simple string for debugging output (e.g., `"saddle:beefalo_saddle"` or `"saddle:nil"`).
* **Parameters:** None.
* **Returns:** string.

## Events & listeners
- **Listens to:**  
  - `death` — Automatically removes the saddle.  
  - `onattackother` — While a rider is mounted, pushes `riderdoattackother` on the mount when the rider attacks.  
- **Pushes:**  
  - `saddlechanged` — Fired when a saddle is added or removed. Data: `{ saddle = Entity or nil }`.  
  - `riderchanged` — Fired when a rider is assigned. Data: `{ oldrider = Entity or nil, newrider = Entity or nil }`.  
  - `beingridden` — Fired periodically during riding (every ~6 seconds) with `dt` as data.  
  - `riderdoattackother` — Fired on the mount when the rider performs an attack (via `onattackother`).

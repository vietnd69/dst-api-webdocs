---
id: moonstormstaticcatcher
title: Moonstormstaticcatcher
description: Tracks and captures moonstorm static charges by interacting with capturable entities during targeting and catch operations.
tags: [combat, moonstorm, capture, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d5e982e0
system_scope: entity
---

# Moonstormstaticcatcher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Moonstormstaticcatcher` manages the logic for capturing moonstorm static charges. It maintains a reference to a current *target* entity and performs capture operations using proximity and capturability checks. It coordinates with the `moonstormstaticcapturable` component on target entities to register targeting, untargeting, and successful capture events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moonstormstaticcatcher")

-- Set a custom callback to run on successful capture
inst.components.moonstormstaticcatcher:SetOnCaughtFn(function(catcher, doer)
    print("Static caught by", doer and doer:GetDebugName())
end)

-- Attempt to target a capturable entity
local target = GetSomeCapturableEntity()
if target then
    inst.components.moonstormstaticcatcher:OnTarget(target)
end

-- Attempt to capture the targeted static charge
local success, reason = inst.components.moonstormstaticcatcher:Catch(target, inst)
```

## Dependencies & tags
**Components used:** `moonstormstaticcapturable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | `nil` (assigned in constructor) | The entity instance that owns this component. |
| `target` | `GEntity?` | `nil` | The currently targeted capturable entity. |
| `oncaughtfn` | `function?` | `nil` | Optional callback invoked when a catch succeeds. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Automatically called when the component is removed from its entity. Ensures any active target is properly untargeted.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetOnCaughtFn(fn)`
* **Description:** Assigns a callback function to be executed on successful static capture.
* **Parameters:** `fn` (function) - callback taking two arguments: `(catcher_inst, doer_inst)`.
* **Returns:** Nothing.

### `Catch(target, doer)`
* **Description:** Attempts to capture the given target, validating proximity and capturability. On success, notifies the target's `moonstormstaticcapturable` component and triggers the `oncaughtfn` callback.
* **Parameters:**  
  - `target` (GEntity) — the entity to capture (expected to have `moonstormstaticcapturable`).  
  - `doer` (GEntity) — the entity performing the catch (usually the owner of this component).  
* **Returns:**  
  - `(true)` — if capture succeeded.  
  - `(false, reason)` — if capture failed (`"MISSED"` for invalid target, distance, or disabled capturable state).  
* **Error states:** Returns early with `("MISSED")` if:
  - `target:IsValid()` is `false`,  
  - `doer` is not within `1 + doer:GetPhysicsRadius(0) + 0.2` units of `target`, or  
  - `target.components.moonstormstaticcapturable` is missing or not enabled.

### `OnTarget(target)`
* **Description:** Begins targeting a capturable entity. Clears any previous target before setting a new one. Registers this component as a targeter on the target's `moonstormstaticcapturable` component.
* **Parameters:** `target` (GEntity) — the entity to target.
* **Returns:** Nothing.
* **Error states:** Does nothing if `target` is invalid or lacks `moonstormstaticcapturable`. No-op if `target` is unchanged.

### `OnUntarget(target)`
* **Description:** Ends targeting of the current or specified entity. Unregisters this component from the target's `moonstormstaticcapturable`.
* **Parameters:** `target` (GEntity?) — optional specific target to untarget; if omitted, untargets the stored `self.target`.
* **Returns:** Nothing.
* **Error states:** Does nothing if no active target is set or `target` does not match.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.  
  *(Note: Events are handled via the target's `moonstormstaticcapturable` component; see that component's documentation for `moonstormstaticcapturable_targeted` and `moonstormstaticcapturable_untargeted`.)*

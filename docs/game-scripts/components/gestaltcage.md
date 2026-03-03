---
id: gestaltcage
title: Gestaltcage
description: Manages targeting and capturing of Gestalt creatures using a cage item.
tags: [combat, capture, gestalt]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ad598264
system_scope: entity
---

# Gestaltcage

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GestaltCage` is a component that enables an entity (typically a cage item) to target and capture Gestalt-level characters. It handles interaction logic with the `gestaltcapturable` component, captures the target upon validation, and spawns a filled cage prefab at the grabber's location. The component is designed for use on items equipped by players or other actors in the world and integrates with inventory systems and targeted entity behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("gestaltcage")

-- Example targeting
local target = GetEntityFrom somewhere()
inst.components.gestaltcage:OnTarget(target)

-- Example capture attempt
local success, reason = inst.components.gestaltcage:Capture(target, doer)
```

## Dependencies & tags
**Components used:** `gestaltcapturable`, `inventoryitem`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `ECSEntity?` | `nil` | The entity currently being targeted by this cage, if any. |

## Main functions
### `Capture(target, doer)`
*   **Description:** Attempts to capture the specified `target` using this cage. Validates the target's state and proximity, triggers capture callbacks, removes the cage from the world, and spawns a level-appropriate filled cage prefab.
*   **Parameters:** 
    *   `target` (`ECSEntity`) — The entity to capture; must be valid and have a functional `gestaltcapturable` component.
    *   `doer` (`ECSEntity`) — The entity performing the capture; must be within 1 unit of the target.
*   **Returns:** 
    *   `true` on success.
    *   `false, "MISSED"` on failure (invalid target, out of range, or disabled capturable component).

### `OnTarget(target)`
*   **Description:** Begins targeting the given entity, if valid and not already targeting it. Registers this cage as a targeter with the target’s `gestaltcapturable` component.
*   **Parameters:** `target` (`ECSEntity`) — The entity to begin targeting.
*   **Returns:** Nothing.

### `OnUntarget(target)`
*   **Description:** Stops targeting the currently targeted entity. If a specific `target` is provided and it does not match the stored target, no action is taken unless `target` is `nil`, in which case any active target is released.
*   **Parameters:** `target` (`ECSEntity?`) — Optional specific entity to untarget. If `nil`, untargets the currently stored target.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Automatically called when this component is removed from its entity. Ensures any active target is released to prevent stale references.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly.
- **Pushes:** The component itself does not fire events. However, during `Capture` or `OnTarget`/`OnUntarget`, it delegates to the target’s `gestaltcapturable` component, which may push:
    * `gestaltcaptured` (via `doer:PushEvent("gestaltcaptured", self.inst)`)
    * `gestaltcapturable_targeted`
    * `gestaltcapturable_untargeted`

---
id: lighter
title: Lighter
description: Enables an entity to ignite burnable targets by calling Ignite on their burnable component.
tags: [ignition, fuel, utility]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cd38eac6
system_scope: entity
---
# Lighter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Lighter` component allows an entity to act as a ignition source for burnable objects. It is typically attached to items like torches, lighters, or characters capable of lighting fires. When `Light` is called, it attempts to ignite a target by delegating to the target's `burnable` component, provided the target is not in an invalid state (e.g., fuel-depleted or in limbo). It also supports a custom callback function to be invoked upon successful lighting.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lighter")
inst:AddTag("fireproducer")

inst.components.lighter:SetOnLightFn(function(inst, target)
    print("Lit target:", target.prefab)
end)

-- Later, light a campfire
local campfire = GetEntityWithBurnableComponent()
inst.components.lighter:Light(campfire, inst)
```

## Dependencies & tags
**Components used:** `burnable` (read-only access to `Ignite` method)
**Tags:** Adds `lighter` on construction; removes `lighter` on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onlight` | function or `nil` | `nil` | Optional callback invoked after a successful light operation. Signature: `fn(inst, target)`. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleanup method called when the component is removed from its entity. Removes the `lighter` tag to prevent stale references.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetOnLightFn(fn)`
*   **Description:** Sets the optional callback function to be invoked after successfully lighting a target.
*   **Parameters:** `fn` (function or `nil`) — the callback function, or `nil` to clear it.
*   **Returns:** Nothing.

### `Light(target, doer)`
*   **Description:** Attempts to ignite the given `target` using this lighter's ignition source. First checks that the target has a `burnable` component and is not blocked by fuel depletion or limbo state. If valid, calls `target.components.burnable:Ignite(...)`.
*   **Parameters:**
    *   `target` (Entity) — the entity to ignite.
    *   `doer` (Entity or `nil`) — the entity performing the action (may be `nil`).
*   **Returns:** Nothing.
*   **Error states:** No ignition occurs if:
    *   `target` lacks a `burnable` component.
    *   `target` has `fueldepleted` and lacks `burnableignorefuel`.
    *   `target` has `INLIMBO` tag.

## Events & listeners
- **Pushes:** `onlighterlight` — fired on the target entity after the `Light` method runs, regardless of whether ignition succeeded. No payload is provided.

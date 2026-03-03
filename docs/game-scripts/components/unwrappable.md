---
id: unwrappable
title: Unwrappable
description: Manages the ability for an entity (such as a bundle or gift box) to be unwrapped, storing wrapped items and defining behavior during unwrap actions.
tags: [inventory, wrapping, container, persistence]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6ac13198
system_scope: inventory
---
# Unwrappable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Unwrappable` enables an entity to hold and store multiple wrapped items, which can later be revealed ("unwrapped") upon interaction. It is typically used for gift boxes, bundles, or similar storage objects that encapsulate other items. The component tracks wrapped item data persistently via `itemdata`, handles wrapping/unwrapping logic, and supports optional peeking via a temporary container. It integrates with the `inventory`, `inventoryitem`, and `container` components during unwrap and peek operations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("unwrappable")
inst.components.unwrappable:SetOnUnwrappedFn(function(inst, pos, doer)
    inst.SoundEmitter:PlaySound("dontstarve/common/unwrap")
end)
-- Later, wrap some items:
inst.components.unwrappable:WrapItems({"twister"}, the_player)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inventory`, `container`
**Tags:** Adds `unwrappable` when `canbeunwrapped` is true; adds `canpeek` when `peekcontainer` is set.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | Reference to the entity instance that owns this component. |
| `itemdata` | table or `nil` | `nil` | Array of save records for wrapped items; `nil` if empty or unwrapped. |
| `canbeunwrapped` | boolean | `true` | Controls whether the `unwrappable` tag is present on the entity. |
| `onwrappedfn` | function or `nil` | `nil` | Callback invoked when items are wrapped (args: `inst`, `count`, `doer`). |
| `onunwrappedfn` | function or `nil` | `nil` | Callback invoked when items are unwrapped (args: `inst`, `pos`, `doer`). |
| `unwrapdelayfn` | function or `nil` | `nil` | Optional delay function (args: `inst`, `doer`) returning time in seconds. |
| `peekcontainer` | string or `nil` | `nil` | Prefab name of the temporary container used for peeking inside. |
| `origin` | string or `nil` | `nil` | Session identifier from when items were wrapped (used for cross-session item sourcing). |

## Main functions
### `SetOnWrappedFn(fn)`
*   **Description:** Sets a callback that runs when items are wrapped into the entity.
*   **Parameters:** `fn` (function) — function with signature `(inst, count, doer)`.
*   **Returns:** Nothing.

### `SetOnUnwrappedFn(fn)`
*   **Description:** Sets a callback that runs when the entity is unwrapped, after items have been spawned.
*   **Parameters:** `fn` (function) — function with signature `(inst, pos, doer)`.
*   **Returns:** Nothing.

### `SetUnwrapDelayFn(fn)`
*   **Description:** Sets a function that returns a delay (in seconds) before unwrapping occurs (e.g., for animations).
*   **Parameters:** `fn` (function) — function with signature `(inst, doer)` returning a number or `nil`.
*   **Returns:** Nothing.

### `SetPeekContainer(peekcontainer)`
*   **Description:** Configures the prefab name of a container to use for peeking inside (e.g., `"bundlepeek"`).
*   **Parameters:** `peekcontainer` (string) — prefab name of the peek container.
*   **Returns:** Nothing.
*   **Side effects:** Adds or removes the `canpeek` tag depending on truthiness.

### `WrapItems(items, doer)`
*   **Description:** Wraps a list of item prefabs or entities into this instance, storing their data for later spawning on unwrap.
*   **Parameters:** 
    *   `items` (table) — array of item prefabs (string) or valid entities.
    *   `doer` (Entity or `nil`) — the actor performing the wrap; may be `nil`.
*   **Returns:** Nothing.
*   **Error states:** Nonexistent or invalid prefabs are silently skipped. Entities not valid are ignored.

### `Unwrap(doer, nodelay)`
*   **Description:** Spawns all stored items at the entity's position (or adjusted based on owner/doer). Supports optional delay via `unwrapdelayfn`.
*   **Parameters:** 
    *   `doer` (Entity or `nil`) — the actor performing the unwrap.
    *   `nodelay` (boolean) — if `true`, bypasses any delay and unwraps immediately.
*   **Returns:** Nothing.
*   **Error states:** 
    *   If `unwrapdelayfn` returns a delay, unwrapping is deferred via `DoTaskInTime`, and the function exits early.
    *   If item spawning fails for any reason, that item is skipped.
    *   If no `itemdata` is stored, this function has no effect except pushing events.

### `PeekInContainer(doer)`
*   **Description:** Spawns a temporary container, populates it with wrapped items, opens it as read-only, and transitions the doer into the `"bundling"` state.
*   **Parameters:** `doer` (Entity) — the player performing the peek.
*   **Returns:** `true` if peek was successfully initiated; `false` otherwise.
*   **Error states:** 
    *   Returns `false` if `itemdata` or `peekcontainer` is missing.
    *   Returns `false` if container creation, opening, or item placement fails.
    *   Items placed into the peek container are non-persistent and removed on exit.

### `OnSave()`
*   **Description:** Returns serializable state data when the entity is saved.
*   **Parameters:** None.
*   **Returns:** 
    *   `nil` if no items are wrapped.
    *   `{ items = itemdata, origin = session_id }` if items exist.

### `OnLoad(data)`
*   **Description:** Restores state from `OnSave()` data during world load.
*   **Parameters:** `data` (table) — must contain `items` (array) and optionally `origin`.
*   **Returns:** Nothing.
*   **Side effects:** Invokes `onwrappedfn` with stored count if defined.

## Events & listeners
- **Listens to:** None directly via `inst:ListenForEvent`.
- **Pushes:**
  *   `"wrappeditem"` — fired on each item entity when wrapped (args: `{ bundle = self.inst, doer = doer }`).
  *   `"unwrappeditem"` — fired on each spawned item after unwrap (args: `{ bundle = self.inst, doer = doer }`).
  *   `"unwrapped"` — fired on the unwrappable entity after unwrap completes (args: `{ doer = doer }`).


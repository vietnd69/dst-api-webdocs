---
id: useableitem
title: UseableItem
description: Manages the "in use" state of an equippable item and provides callbacks for when it starts or stops being used.
tags: [inventory, equipment, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2b11da14
system_scope: inventory
---

# UseableItem

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`UseableItem` is a lightweight component that tracks whether an equippable item is currently being used (e.g., held in hand, actively wielded). It maintains an internal `inuse` flag and provides hooks (`onusefn`, `onstopusefn`) for custom logic when usage starts or stops. It relies on the `equippable` component to verify the item is equipped before allowing interaction.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("equippable")
inst:AddComponent("useableitem")

inst.components.useableitem:SetOnUseFn(function(inst)
    -- Custom logic when item starts being used
    print("Item started being used")
    return true
end)

inst.components.useableitem:SetOnStopUseFn(function(inst)
    -- Custom logic when item stops being used
    print("Item stopped being used")
end)

inst.components.useableitem:StartUsingItem()
inst.components.useableitem:StopUsingItem()
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds or removes `inuse` tag on the entity based on usage state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onusefn` | function or nil | `nil` | Callback fired when `StartUsingItem()` is called. Receives `inst` as argument; return value controls final `inuse` state. |
| `onstopusefn` | function or nil | `nil` | Callback fired when `StopUsingItem()` is called. Receives `inst` as argument. |
| `inuse` | boolean | `false` | Whether the item is currently being used. |
| `stopuseevents` | function or nil | `nil` | Optional callback invoked during `StartUsingItem()` to set up event listeners for when usage should stop. |

## Main functions
### `SetOnUseFn(fn)`
* **Description:** Sets the function to be executed when the item begins being used.
* **Parameters:** `fn` (function or nil) – a callback that receives `inst` as argument. If `fn` returns `false`, the `inuse` state is set to `false`; otherwise, it remains `true`.
* **Returns:** Nothing.

### `SetOnStopUseFn(fn)`
* **Description:** Sets the function to be executed when the item stops being used.
* **Parameters:** `fn` (function or nil) – a callback that receives `inst` as argument.
* **Returns:** Nothing.

### `CanInteract(doer)`
* **Description:** Checks whether the item can currently be interacted with (i.e., started being used).
* **Parameters:** `doer` (entity) – the entity attempting to use the item (not used in current logic).
* **Returns:** `true` if the item is not in use, and has a valid `equippable` component that reports the item as equipped; otherwise `false`.
* **Error states:** Returns `false` if `inst.replica.equippable` is `nil` or `IsEquipped()` returns `false`.

### `StartUsingItem()`
* **Description:** Marks the item as being used, invokes the `onusefn`, and optionally invokes `stopuseevents` to register cleanup listeners.
* **Parameters:** None.
* **Returns:** `true` if usage was successfully started; `false` otherwise (e.g., if `onusefn` returned `false`).
* **Error states:** Does not fail; if `onusefn` is `nil`, `inuse` is simply set to `true`.

### `StopUsingItem()`
* **Description:** Marks the item as no longer being used and invokes the `onstopusefn`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when the component is removed from the entity. Ensures the `inuse` tag is removed.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** None identified.  
- **Listens to:** None identified (though `stopuseevents` may internally register event listeners on `inst` when invoked in `StartUsingItem()`).

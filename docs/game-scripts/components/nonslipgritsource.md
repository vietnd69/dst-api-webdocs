---
id: nonslipgritsource
title: Nonslipgritsource
description: Acts as an inventory-based source of non-slip grit that can be applied to entities with slippery feet, enabling temporary traction.
tags: [locomotion, inventory, gameplay]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0a50c550
system_scope: locomotion
---

# Nonslipgritsource

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Nonslipgritsource` is an inventory-item-based component that provides traction resources to entities that have `slipperyfeet` and `nonslipgrituser` components. It implements the `MakeComponentAnInventoryItemSource` pattern, meaning it is designed to be attached to inventory items (like non-slip grit containers) that can be used to restore or maintain traction on slippery surfaces. When such an item is equipped or transferred to a new owner, it automatically interacts with the target's `nonslipgrituser` component to register itself as a source of grit.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("nonslipgritsource")

-- Optionally set a custom delta function to apply grit usage logic
inst.components.nonslipgritsource:SetOnDeltaFn(function(item, dt)
    -- Custom logic: e.g., reduce grit amount over time
end)
```

## Dependencies & tags
**Components used:** `slipperyfeet`, `nonslipgrituser`, `inventoryitem` (via `MakeComponentAnInventoryItemSource`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ondeltafn` | function or `nil` | `nil` | Optional callback function invoked by `DoDelta(dt)` to handle per-frame grit consumption or updates. Signature: `function(inst, dt)`. |

## Main functions
### `SetOnDeltaFn(fn)`
* **Description:** Assigns an optional per-frame callback to handle grit usage logic (e.g., decrementing grit amount over time). This function is called during `DoDelta` updates.
* **Parameters:** `fn` (function or `nil`) — the callback function to invoke with `(self.inst, dt)` arguments, or `nil` to clear.
* **Returns:** Nothing.

### `DoDelta(dt)`
* **Description:** Invokes the `ondeltafn` callback (if set), allowing time-based updates to grit usage (e.g., gradual consumption).
* **Parameters:** `dt` (number) — delta time in seconds since the last update.
* **Returns:** Nothing.

### `OnItemSourceRemoved(owner)`
* **Description:** Automatically invoked when this item source is removed from an owner entity. Delegates to the owner's `nonslipgrituser` component (if present) to unregister this source.
* **Parameters:** `owner` (Entity) — the entity that previously owned this item.
* **Returns:** Nothing.

### `OnItemSourceNewOwner(owner)`
* **Description:** Automatically invoked when ownership of this item changes. If the new owner has the `slipperyfeet` component, it ensures an `nonslipgrituser` component exists on the owner and registers this source with it.
* **Parameters:** `owner` (Entity) — the new owner entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.

---
id: slingshotmodder
title: Slingshotmodder
description: Validates ownership restrictions and manages opening/closing of slingshot modification interfaces on target items.
tags: [inventory, crafting, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a32b38f5
system_scope: inventory
---

# Slingshotmodder

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Slingshotmodder` is a lightweight helper component that encapsulates the logic for initiating and terminating slingshot modifications on an item. It verifies ownership constraints via `linkeditem` and delegates container operations to the `slingshotmods` component on the target entity. This component is typically attached to the modder (e.g., a player or tool) to orchestrate safe, permission-aware access to slingshot modification UI.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("slingshotmodder")

-- Attempt to start modifying a target item with a user (e.g., player)
local success, reason = inst.components.slingshotmodder:StartModding(target, user)
if not success then
    print("Modification blocked:", reason)
end

-- Later, to close the modification interface
inst.components.slingshotmodder:StopModding(target, user)
```

## Dependencies & tags
**Components used:** `linkeditem`, `slingshotmods`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `StartModding(target, user)`
* **Description:** Validates that the `user` is authorized to modify `target` (respecting ownership restrictions), then opens the `slingshotmods` interface for the target. Returns success status and an optional reason code on failure.
* **Parameters:**
  * `target` (Entity) – The entity possessing the `slingshotmods` component and optionally the `linkeditem` component.
  * `user` (Entity, optional) – The entity attempting to open the interface; must have a `userid` property if provided.
* **Returns:** `success` (boolean), `reason` (string, optional) — `success` is `true` if opening succeeded; `false` otherwise. On failure, `reason` is `"NOT_MINE"` when ownership restriction is violated.
* **Error states:** Fails with `"NOT_MINE"` if `target` has `linkeditem` with `IsEquippableRestrictedToOwner()` returning `true`, and `user.userid` does not match the item's owner. Also returns `false` if `target.components.slingshotmods` is missing or `:Open(user)` fails.

### `StopModding(target, user)`
* **Description:** Closes the `slingshotmods` interface on `target` for the given `user`.
* **Parameters:**
  * `target` (Entity) – The entity whose `slingshotmods` container should be closed.
  * `user` (Entity) – The entity that previously opened the interface.
* **Returns:** `success` (boolean) — `true` if the `slingshotmods:Close(user)` call succeeded; `false` if `slingshotmods` is missing or closing failed (e.g., mismatched opener or non-master simulation).
* **Error states:** Returns `false` if `target` lacks a `slingshotmods` component or the underlying `:Close()` operation fails.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None. (This component does not fire events; it relies on `slingshotmods` to emit `ms_slingshotmodsclosed`.)

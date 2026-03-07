---
id: kitcoon_nametag
title: Kitcoon Nametag
description: A utility item that allows players to rename Kitcoons by writing on it and applying the name to a target Kitcoon.
tags: [inventory, ui, naming]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2e0ec7aa
system_scope: inventory
---

# Kitcoon Nametag

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `kitcoon_nametag` prefab is a single-use inventory item used to rename Kitcoons. It integrates with the `writeable`, `useabletargeteditem`, and `named` components to provide a structured naming workflow: when used on a valid Kitcoon target, it opens a writeable UI, and upon accepting the entered name, the target Kitcoon is renamed. It is designed for one-time use (`remove_after_write = true`) and enforces distance and tag-based validation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("useabletargeteditem")
inst:AddComponent("writeable")

inst.components.useabletargeteditem:SetOnUseFn(function(inst, target, doer)
    -- Custom use logic, e.g., open writeable UI and rename target
end)

inst.components.writeable:SetOnWrittenFn(function(inst, new_name, writer)
    if target.components.named then
        target.components.named:SetName(new_name, writer)
    end
end)
```

## Dependencies & tags
**Components used:**  
- `writeable` — manages writing UI and text input  
- `useabletargeteditem` — handles targeting logic and use events  
- `inventoryitem` — enables inventory behavior  
- `inspectable` — (master-only) allows inspection  

**Tags:**  
- `kitcoon` — checked on target via `IsKitcoon`  
- `writeable` — added/removed dynamically via `SetDefaultWriteable(false)`; no static tags assigned  

## Properties
No public properties.

## Main functions
### `OnUseOnKitcoon(inst, target, doer)`
*   **Description:** Called when the nametag is used on a target entity. Sets up naming session: begins writing, stops target's movement, marks target as being named, and listens for the target's removal to cleanly end the session.
*   **Parameters:**  
    - `inst` (Entity) — the nametag instance  
    - `target` (Entity) — the entity being named (must pass `IsKitcoon` validation)  
    - `doer` (Entity) — the player using the item  
*   **Returns:** `true`
*   **Error states:** Silent failure if `writeable` or `locomotor` components are missing.

### `OnNamedByWriteable(inst, new_name, writer)`
*   **Description:** invoked when writing ends successfully. Applies the entered name to the `naming_target` via its `named` component.
*   **Parameters:**  
    - `inst` (Entity) — the nametag instance  
    - `new_name` (string or `nil`) — the text entered by the player  
    - `writer` (Entity or `nil`) — the player who wrote the name  
*   **Returns:** Nothing  
*   **Error states:** No effect if `new_name` is `nil`, `naming_target` is invalid, or the target lacks a `named` component.

### `OnWritingEnded(inst)`
*   **Description:** Cleans up the naming session when writing ends (successfully or canceled). Clears naming target state, removes event listeners, and stops usage state.
*   **Parameters:**  
    - `inst` (Entity) — the nametag instance  
*   **Returns:** Nothing

### `IsKitcoon(inst, target, doer)`
*   **Description:** Validation callback for `useabletargeteditem`. Ensures the target has the `"kitcoon"` tag.
*   **Parameters:**  
    - `inst` (Entity) — the nametag instance  
    - `target` (Entity) — candidate target entity  
    - `doer` (Entity) — the player attempting to use the item  
*   **Returns:** `true` if `target:HasTag("kitcoon")`, otherwise `false`

## Events & listeners
- **Listens to:**  
  - `onremove` on `naming_target` — triggers cleanup via `inst.onrmeove_naming_target` (defined on first use) to cancel naming if the target is removed  
- **Pushes:** None directly; delegates event-driven behavior to connected components (`writeable`, `useabletargeteditem`).
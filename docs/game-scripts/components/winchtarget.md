---
id: winchtarget
title: Winchtarget
description: Manages salvagable objects attached to winches, handling their retrieval logic and sunken object interactions.
tags: [salvage, winch, inventory, submersible]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0b1bcec5
system_scope: world
---

# Winchtarget

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Winchtarget` is a component attached to entities that act as winch targets—typically sunken items or structures in deep water. Its primary responsibility is to enable and manage the retrieval (salvage) of such objects, especially when attached to a winch. It interacts closely with the `inventory` component to access the salvaged item (stored in slot 1) and the `submersible` component to control repositioning behavior during salvage.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("winchtarget")
inst.components.winchtarget:SetSalvageFn(function(target)
    print("Salvaging", target.prefab)
    return true
end)
-- Later, when salvaging:
inst.components.winchtarget:Salvage()
```

## Dependencies & tags
**Components used:** `inventory`, `submersible`  
**Tags:** Adds `winchtarget` to the owning entity; removes it on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `depth` | number | `-1` | Depth override; `-1` means use the ocean depth at the entity's position. |
| `salvagefn` | function? | `nil` | Optional callback function to execute during salvage. |

## Main functions
### `SetSalvageFn(fn)`
*   **Description:** Sets a custom function to be called when the salvage operation is performed. This function receives the target entity as its argument.
*   **Parameters:** `fn` (function?) — a callable taking `inst` as argument, or `nil` to clear.
*   **Returns:** Nothing.

### `Salvage()`
*   **Description:** Executes the salvage operation: releases the submersible's repositioning restriction and invokes the configured `salvagefn`. Typically called by the winch upon successful retrieval.
*   **Parameters:** None.
*   **Returns:** The result of `salvagefn(self.inst)`, or `nil` if no function is set.
*   **Error states:** If the sunken object lacks a `submersible` component, the `force_no_repositioning` flag is not modified.

### `GetSunkenObject()`
*   **Description:** Retrieves the item currently stored in slot 1 of the target's inventory, assumed to be the sunken object (e.g., an anchor, engine, or wrecked vessel part).
*   **Parameters:** None.
*   **Returns:** The entity in slot 1 if present, otherwise `nil`.
*   **Error states:** Returns `nil` if the owning entity has no `inventory` component.

## Events & listeners
None identified.

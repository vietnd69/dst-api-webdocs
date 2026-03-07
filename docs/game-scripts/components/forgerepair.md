---
id: forgerepair
title: Forgerepair
description: Handles repair of damaged equipment using forge-based materials, consuming itself in the process and updating entity tags based on the repair material used.
tags: [crafting, repair, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ad4c7423
system_scope: crafting
---

# Forgerepair

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Forgerepair` is a utility component that enables an item (typically a tool or consumable) to repair damaged equipment items such as armor, finite-use items, or fueled items. When `OnRepair` is called with a target entity, it restores the target's condition to full and consumes the repairer item (either decrementing finite uses, splitting and removing from stack, or deleting the item entirely). The component also manages dynamic tags (e.g., `forgerepair_log` or `forgerepair_moonrock`) based on the configured `repairmaterial` value.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("forgerepair")
inst.components.forgerepair:SetRepairMaterial("moonrock")
inst.components.forgerepair:SetOnRepaired(function(repairer, target, doer)
    print("Repaired item with moonrock forge tool")
end)
```

## Dependencies & tags
**Components used:** `armor`, `finiteuses`, `fueled`, `stackable`  
**Tags:** Adds or removes `forgerepair_<material>` tags (e.g., `forgerepair_moonrock`), based on `repairmaterial`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repairmaterial` | string? | `nil` | The type of material used for repair; used to generate dynamic tags (e.g., `"moonrock"` → `forgerepair_moonrock`). |
| `onrepaired` | function? | `nil` | Optional callback fired after a successful repair; signature: `(repairer_inst, target_inst, doer_inst)`. |

## Main functions
### `SetRepairMaterial(material)`
* **Description:** Sets the repair material type, which updates the entity’s `forgerepair_<material>` tag.
* **Parameters:** `material` (string?) — the material identifier; `nil` clears the tag.
* **Returns:** Nothing.

### `SetOnRepaired(fn)`
* **Description:** Registers a callback function to be invoked after a successful repair.
* **Parameters:** `fn` (function) — a function accepting three arguments: `repairer` (the item performing repair), `target` (the repaired item), and `doer` (the actor initiating repair).
* **Returns:** Nothing.

### `OnRepair(target, doer)`
* **Description:** Attempts to fully repair the target entity’s condition. If successful, consumes the repairer item and fires the `onrepaired` callback.
* **Parameters:**  
  `target` (Entity) — the entity to repair; must have one of `armor`, `finiteuses`, or `fueled` components in a damaged state.  
  `doer` (Entity) — the entity performing the repair (passed to the callback).  
* **Returns:** `true` if repair succeeded; `nil` otherwise.
* **Error states:**  
  - Returns `nil` if `target` lacks a compatible component or is already at full condition (`1.0`).  
  - Repairer item consumption logic:  
    - If `self.inst.components.finiteuses` exists: calls `:Use(1)`.  
    - Else if `self.inst.components.stackable` exists: splits and removes the split item via `:Get():Remove()`.  
    - Else: directly removes `self.inst`.

## Events & listeners
None identified.

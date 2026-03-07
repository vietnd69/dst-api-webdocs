---
id: forgerepairable
title: Forgerepairable
description: Tracks and manages forge-repair eligibility of an entity based on repair material compatibility and current condition.
tags: [crafting, repair, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 18e1a2a7
system_scope: crafting
---

# Forgerepairable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `forgerepairable` component marks an entity as repairable via a forge when its `repairmaterial` matches that of a `forgerepair`-enabled item. It dynamically manages the `forgerepairable_` tag on the entity based on whether the item is repairable (e.g., damaged armor, low-fuel item) and sets up tags to indicate which repair material it accepts. This component acts as the receiver side of the forge repair system, working in tandem with the `forgerepair` component on the repair tool.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("armor")
inst:AddComponent("forgerepairable")

inst.components.forgerepairable:SetRepairMaterial("emerald")
inst.components.forgerepairable:SetOnRepaired(function(inst, doer, item)
    print("Item repaired by", doer.prefab)
end)

-- Later, during repair interaction:
local success = inst.components.forgerepairable:Repair(player, repair_tool)
```

## Dependencies & tags
**Components used:** `armor`, `fueled` (read-only checks in constructor), `forgerepair` (via `repair_item`), `finiteuses`, `stackable` (indirect, via `forgerepair:OnRepair`)
**Tags:** Dynamically adds/Removes `forgerepairable_<material>` (e.g., `forgerepairable_emerald`) based on `repairmaterial` and `repairable` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repairmaterial` | string or `nil` | `nil` | The material (e.g., `"emerald"`, `"diamond"`) this entity accepts for repair. |
| `repairable` | boolean or `nil` | `nil` | Whether the entity is currently in a state that can be repaired (e.g., damaged armor, under-fueled). |
| `onrepaired` | function or `nil` | `nil` | Callback invoked after a successful repair. Signature: `fn(inst, doer, repair_item)` |

## Main functions
### `SetRepairMaterial(material)`
*   **Description:** Sets the repair material this entity accepts. Automatically updates the entity's `forgerepairable_<material>` tag if `repairable` is `true`.
*   **Parameters:** `material` (string or `nil`) – the material identifier; `nil` removes the repair material.
*   **Returns:** Nothing.

### `SetRepairable(repairable)`
*   **Description:** Sets whether the entity is currently repairable (e.g., based on `IsDamaged()` or `GetPercent() < 1`). Updates the associated `forgerepairable_<material>` tag accordingly.
*   **Parameters:** `repairable` (boolean or `nil`) – `true` enables repair, `false` disables it.
*   **Returns:** Nothing.

### `SetOnRepaired(fn)`
*   **Description:** Registers a callback to run after the entity is successfully repaired.
*   **Parameters:** `fn` (function) – function to call on successful repair. Must accept `(inst, doer, repair_item)` as arguments.
*   **Returns:** Nothing.

### `Repair(doer, repair_item)`
*   **Description:** Attempts to repair the entity using the given repair item. Validates material match and current repairable state, then delegates to `repair_item.components.forgerepair:OnRepair`.
*   **Parameters:**
    *   `doer` (Entity) – The entity performing the repair (e.g., a player).
    *   `repair_item` (Entity) – The tool/item used for repair (must have a `forgerepair` component).
*   **Returns:** `true` if repair succeeds, `false` otherwise.
*   **Error states:** Returns `false` if:
    *   `repair_item` lacks a `forgerepair` component.
    *   `repair_item.components.forgerepair.repairmaterial` does not match `self.repairmaterial`.
    *   `self.repairable` is `false`.
    *   `repair_item.components.forgerepair:OnRepair(...)` fails.

### `OnRemoveFromEntity()`
*   **Description:** Cleans up the `forgerepairable_<material>` tag on removal from an entity, if repairable and material are set.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
*   **Listens to:** None.
*   **Pushes:** None. (Note: The `onrepaired` callback can fire side effects, but no internal events are pushed by this component.)

---
id: pocketwatch_dismantler
title: Pocketwatch Dismantler
description: Validates and executes the dismantling of pocket watch–related items into component parts when used by a Clockmaker.
tags: [inventory, crafting, validation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 99ca1151
system_scope: inventory
---

# Pocketwatch Dismantler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PocketWatch_Dismantler` is a utility component that enforces ownership and readiness rules before allowing a pocket watch–type item to be dismantled. When conditions are met, it handles the disassembly process: replacing mimic items with an aggressive version, producing a broken tool, and dropping each recipe ingredient as loot—either into a container (if owned by a non-pocket-dimension entity) or directly onto the ground. It is typically added to the dismantler tool (e.g., a screwdriver) rather than the target item itself.

The component relies on:
- `rechargeable` to verify the target is not on cooldown.
- `inventoryitem` to locate the item’s grand owner and determine drop behavior.
- `itemmimic` to transform mimics before dismantling.
- `lootdropper` to resolve recipe ingredients and spawn loot.

## Usage example
```lua
-- Example: Adding to a screwdriver tool and calling from a recipe
local inst = CreateEntity()
inst:AddComponent("pocketwatch_dismantler")

-- Later, inside an action callback:
if target.components.pocketwatch_dismantler then
    local can, reason = target.components.pocketwatch_dismantler:CanDismantle(target, doer)
    if can then
        target.components.pocketwatch_dismantler:Dismantle(target, doer)
    end
end
```

## Dependencies & tags
**Components used:** `rechargeable`, `inventoryitem`, `itemmimic`, `lootdropper`  
**Tags:** Checks `clockmaker` (on `doer`) and `pocketdimension_container` (on owner). No tags added or removed by this component.

## Properties
No public properties.

## Main functions
### `CanDismantle(target, doer)`
* **Description:** Validates whether `target` can be dismantled by `doer`. Checks that `doer` is a Clockmaker and that `target` (if rechargeable) is fully charged.
* **Parameters:**  
  - `target` (Entity) — the item to be dismantled; must have `rechargeable`, `itemmimic`, `lootdropper`, and `inventoryitem` components for full operation.  
  - `doer` (Entity) — the actor attempting the dismantle, must have the `clockmaker` tag.
* **Returns:**  
  - `true` (boolean) — if dismantling is allowed.  
  - `false, "ONCOOLDOWN"` (boolean, string) — if `target` has `rechargeable` and is not charged.
* **Error states:** Returns `false` (without message) if `doer` lacks the `clockmaker` tag.

### `Dismantle(target, doer)`
* **Description:** Performs dismantling of `target`. If `target` is a mimic, it triggers a revealed transformation and panic reaction. Otherwise, it resolves the crafting recipe for `target`, spawns a `brokentool`, and drops each ingredient as loot. Items are given to the grand owner’s inventory/container if it’s not a pocket-dimension container; otherwise, loot is dropped at `doer`’s position. The `target` entity is removed after looting.
* **Parameters:**  
  - `target` (Entity) — the item to dismantle; its `prefab` must exist as a key in `AllRecipes`.  
  - `doer` (Entity) — the actor performing the dismantle, used for sound, position, and sanity damage (if mimic).
* **Returns:** Nothing.
* **Error states:**  
  - If `target` is a mimic, `SpawnPrefab("itemmimic_revealed")` may return `nil` if prefabs fail, but the component does not explicitly guard against this.  
  - If loot or container operations fail (e.g., full inventory), the game may silently skip dropping items.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None. Events are handled via calls to other components (`itemmimic:TurnEvil` triggers `startled` on the `doer`; `lootdropper:SpawnLootPrefab` pushes `on_loot_dropped`).

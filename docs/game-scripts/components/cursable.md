---
id: cursable
title: Cursable
description: Manages application, removal, and state tracking of curses on an entity, primarily by interacting with cursed items and inventory.
tags: [inventory, combat, debuff, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5b6e9495
system_scope: entity
---

# Cursable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Cursable` is a component that tracks curses applied to an entity and manages their lifecycle through interactions with `curseditem` components. It provides methods to apply or remove curses (typically via cursed items), check if an entity can be cursed (`IsCursable`), and handle cleanup upon death (e.g., dropping cursed items). The component integrates closely with `inventory`, `debuffable`, and `stackable`, and delegates special handling for the `MONKEY` curse to `curse_monkey_util`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("cursable")

-- Apply a curse from a cursed item
local item = SpawnPrefab("cursed_object")
item:AddTag("cursed")
if item.components.curseditem then
    item.components.curseditem.curse = "DEAFENING"
    item.components.curseditem.cursed_target = inst
end
inst.components.cursable:ApplyCurse(item)

-- Check if entity can accept more curses
if inst.components.cursable:IsCursable(some_item) then
    -- proceed with curse application
end
```

## Dependencies & tags
**Components used:** `inventory`, `debuffable`, `stackable`, `health`, `inventoryitem`, `curseditem`.  
**Tags:** Checks tags `ghost`, `nosteal`, `monkey_token`, `applied_curse`, `INLIMBO`. Adds tag `applied_curse` to items during `ApplyCurse`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance that owns this component (set in constructor). |
| `curses` | table | `{}` | A map from curse name (string) to numeric count (e.g., number of cursed items applied). |

## Main functions
### `ApplyCurse(item, curse)`
*   **Description:** Applies a curse (by name or from a `curseditem` component) to the entity. Updates internal curse count and triggers special behavior for `MONKEY` curse.
*   **Parameters:**  
    - `item` (Entity or `nil`) — the cursed item to apply; if provided, its `curseditem.curse` value is used and the item is marked with the `applied_curse` tag.  
    - `curse` (string or `nil`) — the curse name; if `item` is provided, this is ignored and overwritten.
*   **Returns:** Nothing.
*   **Error states:** No explicit failure mode. Curse count increments; `item` must be valid for `curseditem`/`stackable` lookups to succeed.

### `RemoveCurse(curse, numofitems, dropitems)`
*   **Description:** Removes up to `numofitems` of a given curse, optionally dropping matching items (e.g., monkey tokens) into the world.
*   **Parameters:**  
    - `curse` (string) — name of the curse to remove.  
    - `numofitems` (number) — how many curse instances to remove.  
    - `dropitems` (boolean) — if `true`, spawns and drops corresponding items (for curable curses like `MONKEY`).
*   **Returns:** Nothing.
*   **Error states:** Only `MONKEY` curse currently uses `dropitems` (via the `monkey_token` tag). Count is clamped to `>= 0`. No effect if curse name has no associated item tag.

### `IsCursable(item)`
*   **Description:** Checks whether this entity can accept the given `item` as a curse (e.g., not a ghost, not in spawn protection, inventory space available or room for stacking).
*   **Parameters:**  
    - `item` (Entity) — the item being tested for curse application.
*   **Returns:** `true` if the item can be cursed onto this entity, `false` otherwise.
*   **Error states:** Returns `nil` (falsy) if the entity is a `ghost`. Returns `false` if `debuffable:HasDebuff("spawnprotectionbuff")` is active. Space checks rely on `inventory:IsFull()` and stackable slot availability.

### `ForceOntoOwner(item)`
*   **Description:** Forces a cursed item onto the entity's inventory, evicting non-protected items (excluding `nosteal` and active slot) if necessary. Designed to prevent overflow and allow stacking.
*   **Parameters:**  
    - `item` (Entity) — the item to be forced onto the owner's inventory.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `inst` is invalid, dead (`health:IsDead()`), or `nil`. Note: The code comment indicates incomplete handling for incomplete stacks (only checks for stacking space but does not insert into it before dropping).

### `Died()`
*   **Description:** Cleans up all cursed items on death by removing their curses and dropping them.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Iterates through `inventory:FindItems()` for all items with `curseditem` component, removes curse count, and drops the items.

### `OnSave()` and `OnLoad(data)`
*   **Description:** Stub save/load hooks. Currently unimplemented — `OnSave` returns an empty table; `OnLoad` contains commented-out logic.
*   **Parameters:**  
    - `data` (table or `nil`) — payload for loading (unused in current version).
*   **Returns:** `OnSave` → `{}` (table); `OnLoad` → nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** `ondropped` (via `inventoryitem:OnDropped()`) when forced items are dropped during `ForceOntoOwner` or `Died`.  
  *(Note: No explicit `inst:PushEvent()` calls are present in this component’s core logic.)*

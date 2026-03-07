---
id: shaveable
title: Shaveable
description: Manages the ability for an entity to be shaved, producing configurable loot items upon successful shaving.
tags: [inventory, entity, interaction]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6909c405
system_scope: entity
---

# Shaveable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Shaveable` component enables an entity to be shaved (e.g., a beefalo), optionally producing loot items when shaved. It integrates with the `inventory` and `inventoryitem` components to drop items, handles wetness inheritance for dropped loot, and supports custom validation and side-effect callbacks. It also manages the `bearded` tag based on prize count and serializes state for network sync and save/load.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shaveable")
inst.components.shaveable:SetPrize("beefalofur", 2)
inst.components.shaveable.can_shave_test = function(inst, shaver, implement)
    return implement ~= nil and implement.prefab == "razor" and "Not using a razor"
end
inst.components.shaveable.on_shaved = function(inst, shaver, implement)
    print("Beefalo was shaved!")
end
```

## Dependencies & tags
**Components used:** `inventory`, `inventoryitem`, `inventoryitemmoisture`, `rainimmunity` (via `InheritWorldWetnessAtTarget`)  
**Tags:** Adds/Removes `bearded` based on `prize_count` (non-zero → `bearded` present)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prize_prefab` | string or `nil` | `nil` | The prefab name of the item(s) to spawn on shave. |
| `prize_count` | number or `nil` | `nil` | Number of `prize_prefab` items to spawn. |
| `can_shave_test` | function or `nil` | `nil` | Optional predicate `(inst, shaver, implement) -> can_shave, reason`. |
| `on_shaved` | function or `nil` | `nil` | Optional callback `(inst, shaver, implement)` triggered after successful shave. |

## Main functions
### `SetPrize(prize_prefab, prize_count)`
* **Description:** Configures the loot to drop when this entity is shaved.
* **Parameters:**  
  `prize_prefab` (string or `nil`) — prefab name of the item to spawn; `nil` disables looting.  
  `prize_count` (number or `nil`) — how many items to spawn; non-positive values clear loot.
* **Returns:** Nothing.
* **Side effect:** Updates the `bearded` tag: adds it if `prize_count > 0`, removes otherwise.

### `CanShave(shaver, shaving_implement)`
* **Description:** Validates whether shaving is allowed. Delegates to `can_shave_test` if set; otherwise returns `true`.
* **Parameters:**  
  `shaver` (entity or `nil`) — the entity performing the shave.  
  `shaving_implement` (entity or `nil`) — the tool or item used to shave.
* **Returns:** `can_shave` (boolean) — `true` if allowed; `reason` (string or `nil`) — optional failure message for UI display.
* **Error states:** Never fails; if `can_shave_test` is `nil`, returns `true, nil`.

### `Shave(shaver, shaving_implement)`
* **Description:** Performs the shave action: validates, spawns loot (if configured), and runs `on_shaved` callback.
* **Parameters:**  
  `shaver` (entity or `nil`) — the entity performing the shave.  
  `shaving_implement` (entity or `nil`) — the tool or item used to shave.
* **Returns:** `true` on success; `false, reason` if `CanShave` fails.
* **Error states:**  
  - Loot is skipped if `prize_prefab` or `prize_count` is `nil`.  
  - Loot items inherit world wetness from the target if `inventoryitemmoisture` is present and the target lacks `rainimmunity`.  
  - Items are given to `shaver`'s inventory if possible; otherwise, they are launched away.

### `OnSave()`
* **Description:** Returns component state for serialization.
* **Parameters:** None.
* **Returns:** `{ prize_count = number or nil }`.

### `OnLoad(data)`
* **Description:** Restores component state from saved data.
* **Parameters:**  
  `data` (table) — must contain `prize_count` (number or `nil`).
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for inspecting the component.
* **Parameters:** None.
* **Returns:** string in the format `"{prize_count} {prize_prefab}"`.

## Events & listeners
- **Listens to:** `prize_count` — internal listener (via `prize_count = on_prize_count` in class metatable) calls `on_prize_count(self, prize_count)` to update the `bearded` tag.  
- **Pushes:** None.

## Notes
- The `on_prize_count` function automatically toggles the `bearded` tag based on `prize_count`. This tag is also removed during `OnRemoveFromEntity`.
- Loot items use `InventoryItem:InheritWorldWetnessAtTarget(self.inst)` to match the target's wetness state, honoring `rainimmunity` on the target.
- The `shaver` argument may be `nil` (e.g., in world-gen or cutscenes); the component handles this gracefully by launching loot.

---
id: equippable
title: Equippable
description: Adds equipment slot assignment, equip/unequip logic, and associated modifiers (e.g., speed, dapperness, moisture) to an entity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 751f922e
---

# Equippable

## Overview
The `Equippable` component enables an entity (typically an item) to be equipped by players. It manages equip state (`isequipped`), equip slot (`equipslot`), equip/unequip/pocket callbacks, movement speed modification, dapperness, moisture retention, and equip restriction logic. It synchronizes relevant state to clients via replicas and integrates with inventory and linked-item systems.

## Dependencies & Tags
- Relies on `replica.equippable` and optionally `replica.inventoryitem` for client synchronization.
- If `burnable` component is present, it interacts with smoldering state.
-若 `linkeditem` is present, it participates in equip restriction checks (e.g., owner-only).
- Registers an `"onremove"` event callback when `preventunequipping` is enabled.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isequipped` | `boolean` | `false` | Whether the item is currently equipped. |
| `equipslot` | `EQUIPSLOT` enum | `EQUIPSLOTS.HANDS` | Default equipment slot for the item. |
| `onequipfn` | `function` | `nil` | Callback executed when equipped. Signature: `fn(inst, owner, from_ground)`. |
| `onunequipfn` | `function` | `nil` | Callback executed when unequipped. Signature: `fn(inst, owner)`. |
| `onpocketfn` | `function` | `nil` | Callback executed when pocketed (moved to inventory without equipping). |
| `onequiptomodelfn` | `function` | `nil` | Callback executed when equipped *to* an equipment model (e.g., for visual previews). |
| `equipstack` | `boolean` | `false` | Whether stacking occurs during equip (currently unused in source). |
| `walkspeedmult` | `number` or `nil` | `nil` | Multiplier applied to owner’s walk speed when item is equipped. |
| `restrictedtag` | `string` or `nil` | `nil` | Required tag for an entity to equip this item (applies only to players). |
| `dapperness` | `number` | `0` | Base dapperness (social approval) bonus/penalty when equipped. |
| `dapperfn` | `function` or `nil` | `nil` | Optional function to compute dynamic dapperness. Signature: `fn(inst, owner)`. |
| `insulated` | `boolean` | `false` | Whether the item provides protection against electric shocks. |
| `equippedmoisture` | `number` | `0` | Moisture added to the environment while equipped. |
| `maxequippedmoisture` | `number` | `0` | Maximum moisture capacity when equipped. |
| `preventunequipping` | `boolean` or `nil` | `nil` | If `true`, blocks player unequip attempts. |
| `flipdapperonmerms` | (implicit) | `false` | If `true`, negates `dapperness` for merm characters. |

## Main Functions
### `Equip(owner, from_ground)`
* **Description:** Equips the item for a given owner. Stops smoldering (if burnable), runs `onequipfn`, and fires `"equipped"` event. Optionally triggers `onequiptomodelfn` if the owner is an equipment model.
* **Parameters:**
  - `owner` (`Entity`): The entity equipping the item (typically a player).
  - `from_ground` (`boolean`): Whether the item was picked up from the ground (as opposed to another inventory slot).

### `Unequip(owner)`
* **Description:** Unequips the item. Runs `onunequipfn` and fires `"unequipped"` event. Sets `isequipped` to `false`.
* **Parameters:**
  - `owner` (`Entity`): The entity unequipping the item.

### `ToPocket(owner)`
* **Description:** Handles moving the item into inventory without equipping (e.g., via inventory UI). Runs `onpocketfn`.
* **Parameters:**
  - `owner` (`Entity`): The entity storing the item in their inventory.

### `GetWalkSpeedMult()`
* **Description:** Returns the effective walk speed multiplier. Applies the base `walkspeedmult`, but adds `+0.25` if the owner has the `"vigorbuff"` tag and the multiplier is `< 1`.
* **Returns:** `number` – Final speed multiplier (clamped to ≥ 1 for vigor-buffed owners).

### `IsRestricted(target)`
* **Description:** Checks whether the given entity is allowed to equip this item. Enforces `restrictedtag` (must have the tag) and, if `linkeditem` exists, enforces owner-only restriction.
* **Parameters:**
  - `target` (`Entity`): The entity attempting to equip.
* **Returns:** `boolean` – `true` if the target is *not* allowed to equip.

### `IsRestricted_FromLoad(target)`
* **Description:** Variant of `IsRestricted` that allows equip restriction bypass during snapshot load *if* `restrictedtag` matches a skill-tree-defined equipment entry.
* **Parameters:**
  - `target` (`Entity`): The entity attempting to equip (resolved during load).
* **Returns:** `boolean` – `true` if restricted, applying special handling for skill tree items.

### `SetOnEquip(fn)`
### `SetOnUnequip(fn)`
### `SetOnPocket(fn)`
### `SetDappernessFn(fn)`
### `SetOnEquipToModel(fn)`
* **Description:** Sets the respective callback functions for equip, unequip, pocket, dapperness calculation, and equip-to-model events.
* **Parameters:**
  - `fn` (`function`): Callback function with appropriate signature (see `onequipfn`, `dapperfn`, etc.).

### `SetPreventUnequipping(shouldprevent)`
* **Description:** Enables/disables blocking of unequip attempts. When enabled, registers an `"onremove"` event to automatically disable the restriction if the item is destroyed.
* **Parameters:**
  - `shouldprevent` (`boolean`): Enable (`true`) or disable (`false`) prevention.

### `IsInsulated()`
* **Description:** Returns whether the item provides electric insulation.
* **Returns:** `boolean`

### `IsEquipped()`
* **Description:** Returns current equip state.
* **Returns:** `boolean`

### `GetDapperness(owner, ignore_wetness)`
* **Description:** Computes the total dapperness of the item when equipped, applying modifiers like merm flip and wetness.
* **Parameters:**
  - `owner` (`Entity` or `nil`): The entity wearing the item (used for merm flipping and dapperfn).
  - `ignore_wetness` (`boolean`): If `true`, skip wetness bonus.
* **Returns:** `number` – Total dapperness value.

### `GetEquippedMoisture()`
* **Description:** Returns moisture properties for the equipped state.
* **Returns:** `{ moisture = number, max = number }`

### `OnRemoveFromEntity()`
* **Description:** Cleanup called when component is removed from an entity. Resets networked properties and prevents unequipping state.

## Events & Listeners
- **Listens to:** `"equipped"` (fired internally via `PushEvent` when `Equip` completes).
- **Listens to:** `"unequipped"` (fired internally via `PushEvent` when `Unequip` completes).
- **Listens to:** `"onremove"` (only when `preventunequipping` is `true`) to reset the restriction upon item destruction.
- **Pushes:** `"equipped"` event on successful equip.
- **Pushes:** `"unequipped"` event on successful unequip.
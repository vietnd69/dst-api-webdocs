---
id: cutless
title: Cutless
description: A wearable weapon that deals damage and steals items from targets on attack.
tags: [combat, inventory, weapon, steal]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ad3363db
system_scope: combat
---

# Cutless

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `cutless` prefab is a consumable weapon item used by players. When equipped, it modifies the owner's animation and can be used to attack enemies. On each successful attack, it triggers item theft from the target via the `thief` component. The item has a limited number of uses (`finiteuses`), after which it is automatically removed from the game. It also functions as a fuel source (`fuel`) and supports skinning via animation overrides (`inspectable` integration).

## Usage example
```lua
-- typically created via Prefab("cutless", fn, assets) and spawned in-game
local cutless = SpawnPrefab("cutless")
if cutless ~= nil then
    -- item is ready to be picked up, equipped, and used
    -- attacks automatically trigger theft via its weapon and thief components
    cutless.components.weapon:SetDamage(50) -- adjust damage if needed
    cutless.components.finiteuses:SetUses(20) -- adjust remaining uses
end
```

## Dependencies & tags
**Components used:** `thief`, `weapon`, `fuel`, `finiteuses`, `inspectable`, `inventoryitem`, `equippable`, `animstate`, `transform`, `network`, `physics` (via `MakeInventoryPhysics`), `floating` (via `MakeInventoryFloatable`)
**Tags:** Adds `weapon`; checks `depleted` (via `usesdepleted` tag management in `finiteuses`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.MED_FUEL` | Value passed to the fuel system, determines how long the item burns as fuel. |

## Main functions
### `SetDamage(dmg)`
*   **Description:** (Inherited from `weapon` component) Sets the damage dealt per attack.
*   **Parameters:** `dmg` (number) - the amount of damage to apply on attack.
*   **Returns:** Nothing.
*   **Error states:** None.

### `SetOnAttack(fn)`
*   **Description:** (Inherited from `weapon` component) Registers the callback function invoked when the item attacks a target.
*   **Parameters:** `fn` (function) - the callback, expected to accept `(inst, attacker, target)` parameters.
*   **Returns:** Nothing.

### `SetOnEquip(fn)`
*   **Description:** (Inherited from `equippable` component) Registers the callback invoked when the item is equipped.
*   **Parameters:** `fn` (function) - the callback, expected to accept `(inst, owner)` parameters.
*   **Returns:** Nothing.

### `SetOnUnequip(fn)`
*   **Description:** (Inherited from `equippable` component) Registers the callback invoked when the item is unequipped.
*   **Parameters:** `fn` (function) - the callback, expected to accept `(inst, owner)` parameters.
*   **Returns:** Nothing.

### `SetMaxUses(val)`
*   **Description:** (Inherited from `finiteuses` component) Sets the total number of uses allowed.
*   **Parameters:** `val` (number) - maximum number of uses.
*   **Returns:** Nothing.

### `SetUses(val)`
*   **Description:** (Inherited from `finiteuses` component) Sets the current remaining uses and manages depletion state.
*   **Parameters:** `val` (number) - new use count.
*   **Returns:** Nothing.
*   **Error states:** If `val <= 0`, adds the `usesdepleted` tag and triggers the on-finished handler if defined.

### `SetOnFinished(fn)`
*   **Description:** (Inherited from `finiteuses` component) Sets the callback invoked when the item is depleted (uses reach zero).
*   **Parameters:** `fn` (function) - the callback, expected to accept `(inst)` and typically removes or replaces the item.
*   **Returns:** Nothing.

### `StealItem(victim, itemtosteal, attack)`
*   **Description:** (Inherited from `thief` component) Attempts to steal an item from the victim's inventory or container.
*   **Parameters:**
    *   `victim` (entity) - the entity from which to steal.
    *   `itemtosteal` (entity or nil) - specific item to steal; if `nil`, picks a stealable item.
    *   `attack` (boolean) - whether to perform a combat attack on the victim before stealing.
*   **Returns:** `true` if an item was successfully stolen, `false` otherwise.
*   **Error states:** Fails silently if `victim` lacks `inventory` or `container` components.

## Events & listeners
- **Pushes:** `equipskinneditem` (with `{ skinName }`) when equipped and skinned; `unequipskinneditem` (with `{ skinName }`) when unequipped and skinned. These are pushed on the owner entity via `owner:PushEvent(...)`.
- **Listens to:** None directly; relies on component-level event hooks (`onattack`, `onequip`, `onunequip`, `onfinished`).
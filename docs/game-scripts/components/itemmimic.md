---
id: itemmimic
title: Itemmimic
description: Manages the transformation of an item mimic from an inert object into a hostile entity upon player interaction or time-based triggers.
tags: [decoration, enemy, transformation, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9a4d1975
system_scope: entity
---

# Itemmimic

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ItemMimic` implements the core logic for the item mimic entity — a deceptive decorative item that remains inert for a random duration after spawn, then transforms into the hostile prefab `itemmimic_revealed` upon triggering events. It coordinates event listening, time-based auto-reveal mechanics, and reaction to player actions (e.g., equip/unequip, attack, work, interact) depending on the item's equipment slot. It interacts with the `equippable`, `inventory`, `inventoryitem`, `sanity`, and `talker` components to manage state transitions and consequences.

## Usage example
```lua
local inst = Prefab("mimic_chest")
inst:AddComponent("itemmimic")
inst:AddComponent("equippable")
inst.components.equippable.equipslot = EQUIPSLOTS.HANDS
inst:AddTag("item")
```

## Dependencies & tags
**Components used:** `equippable`, `inventory`, `inventoryitem`, `sanity`, `talker`  
**Tags:** None added/removed directly; relies on external tags (e.g., `item`, ` wearable` via other components).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_auto_reveal_task` | Task or `nil` | `Task` (scheduled on construction) | Cancelable task handle for the scheduled auto-reveal delay; used during `LongUpdate` to reschedule. |

## Main functions
### `TurnEvil(target)`
*   **Description:** Transforms the mimic into `itemmimic_revealed`, drops it if held in an inventory/container, faces the target, triggers a "jump" event toward the target, and applies minor sanity damage. If `target` has a `talker` component, it prevents speech during reveal.
*   **Parameters:** `target` (Entity or `nil`) — the entity responsible for triggering the transformation (e.g., the player who attacked or interacted with the item).
*   **Returns:** Nothing.
*   **Error states:** No explicit error states; safely handles `nil` or invalid targets.

### `LongUpdate(dt)`
*   **Description:** Updates the remaining time on the auto-reveal timer. This is called each frame and ensures accurate rescheduling of the reveal task across frame deltas (e.g., after loading or pauses).
*   **Parameters:** `dt` (number) — delta time in seconds since the last frame.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `_auto_reveal_task` is `nil`.

### `GetDebugString()`
*   **Description:** Returns a string for debugging or UI overlays indicating how much time remains before auto-reveal, or whether no reveal is pending.
*   **Parameters:** None.
*   **Returns:** String — e.g., `"AUTO REVEAL IN: 3.12"` or `"NO AUTO REVEAL PENDING (?)"`.

### `OnSave()`
*   **Description:** Serializes the current state for save/load. Includes whether the auto-reveal task is pending and, if so, its remaining time.
*   **Parameters:** None.
*   **Returns:** Table — `{ add_component_if_missing = true, reveal_time_remaining = number? }`.

### `OnLoad(data)`
*   **Description:** Restores the auto-reveal task using the saved `reveal_time_remaining` if present.
*   **Parameters:** `data` (table or `nil`) — saved state data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `machineturnedon`, `machineturnedoff`, `percentusedchange` — triggers delayed transformation on interaction (e.g., light sources).
  - `equipped`, `unequipped` — registers slot-specific listeners for hands/head/body items to react to actions like `working` or `onattackother`.
  - `onputininventory` — begins listening for `performaction` and schedules auto-reveal if unequippable.
  - `ondropped` — removes the `performaction` listener.
- **Pushes:** Does not push events directly. Transformation is handled via `ReplacePrefab`, which triggers the `jump` event on the new instance, and `startled` event on the target. Sanity loss is applied via `Sanity.DoDelta`.

## Additional Notes
- The auto-reveal delay is calculated as `TUNING.ITEMMIMIC_AUTO_REVEAL_BASE + math.random() * TUNING.ITEMMIMIC_AUTO_REVEAL_RAND`.
- Acceptable actions that *do not* trigger reveal include: `EQUIP`, `UNEQUIP`, `DROP`, `PICKUP`.
- The component integrates with `equippable.equipslot` to dynamically adjust event subscriptions on equip/unequip.
- On reveal, the mimic is replaced *in-place* using `ReplacePrefab`; existing component references remain valid on the new entity.

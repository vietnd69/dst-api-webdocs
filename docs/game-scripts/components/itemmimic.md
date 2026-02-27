---
id: itemmimic
title: Itemmimic
description: Converts a hidden item into a hostile revealed mimic when interacted with, wielded, or after a random delay.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 9a4d1975
---

# Itemmimic

## Overview
This component enables an item to function as a deceptive mimic: it remains inert while held, equipped, or carried, but transforms into a hostile `itemmimic_revealed` entity upon specific triggers—such as player interaction, use, attack, or after a timed delay—and startles the triggering player while inflicting minor sanity damage.

## Dependencies & Tags
* `inst:AddComponent("equippable")` — Used to determine equip slot and handle equip/unequip events.
* `inst:AddComponent("inventoryitem")` — Required to detect inventory movement (e.g., put in inventory, drop) and identify owner.
* `inst:AddComponent("transformer")` — Implied by `ReplacePrefab`, though not explicitly declared in this script.
* Tags: None explicitly added/removed by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | N/A | Reference to the owning entity; set during construction. |
| `_auto_reveal_task` | `Task` | `nil` | Pending delayed reveal task; set during initialization and restored on load. |
| `_on_interacted_with` | `function` | N/A | Event listener callback for machine events (`machineturnedon`, `machineturnedoff`, `percentusedchange`). |
| `_on_do_attack` | `function` | N/A | Callback triggered when the owner attacks. |
| `_on_do_work` | `function` | N/A | Callback triggered when the owner performs work. |
| `_on_owner_attacked` | `function` | N/A | Callback triggered when the owner is attacked or blocks an attack (if equipped on HEAD/BODY). |
| `_perform_action_listener` | `function` | N/A | Callback that listens for `performaction` events and detects non-permitted interactions. |

## Main Functions

### `TurnEvil(target)`
* **Description:** Transforms the item into a revealed mimic (`itemmimic_revealed`), drops it (if in inventory), forces it to face the target, triggers a `jump` event, and startles the target with minor sanity loss.
* **Parameters:**
  * `target` (`Entity` or `nil`) — The entity that triggered the mimic's activation (e.g., player). May be `nil` if owner is unknown.

### `LongUpdate(dt)`
* **Description:** Updates the auto-reveal timer during gameplay (used to maintain accurate countdown across save/load cycles or server sync). Adjusts the remaining time and reschedules or fires the reveal task as needed.
* **Parameters:**
  * `dt` (`number`) — Delta time in seconds since the last update.

### `OnSave()`
* **Description:** Returns save data including whether the auto-reveal task is pending, and if so, the remaining time until reveal.
* **Returns:** `table` — A table with `add_component_if_missing = true` and optionally `reveal_time_remaining`.

### `OnLoad(data)`
* **Description:** Restores the auto-reveal task after loading from save, preserving the remaining countdown.
* **Parameters:**
  * `data` (`table?`) — Saved component data; may contain `reveal_time_remaining`.

### `GetDebugString()`
* **Description:** Returns a debug string describing the remaining time (if any) until automatic reveal.
* **Returns:** `string` — E.g., `"AUTO REVEAL IN: 12.35"` or `"NO AUTO REVEAL PENDING (?)"`.

## Events & Listeners

* **Listens To:**
  * `"equipped"` — Triggers `on_equipped` to register slot-specific listeners.
  * `"unequipped"` — Triggers `on_unequipped` to unregister listeners.
  * `"onputininventory"` — Triggers `on_put_in_inventory` to register `performaction` listener and start delayed reveal (if unequippable).
  * `"ondropped"` — Triggers `on_dropped` to remove `performaction` listener.
  * `"machineturnedon"` — Triggers mimic's reveal if interacted with via machine (e.g., campfire, lantern).
  * `"machineturnedoff"` — Same as above.
  * `"percentusedchange"` — Same as above (for fuel items).
  * `"working"` — Owner (hand-wielded) performing work (e.g., chopping, mining).
  * `"onattackother"` — Owner attacking.
  * `"attacked"` — Owner taking damage.
  * `"blocked"` — Owner blocking an attack.
  * `"performaction"` — Player performing custom actions on the item (only triggers if not in `ACCEPTABLE_ACTIONS`).

* **Pushes:**
  * `"jump"` — Pushed on the revealed mimic entity.
  * `"startled"` — Pushed on the triggering owner entity.
  * (Sanity loss is applied directly, not via event.)
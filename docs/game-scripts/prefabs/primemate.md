---
id: primemate
title: Primemate
description: A monkey-like NPC that can command boats, fight with melee weapons, and coordinate with other monkeys in combat.
tags: [combat, ai, boat, monkey, npc]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ba703f1a
system_scope: entity
---

# Primemate

> Based on game build **7140014** | Last updated: 2026-03-06

## Overview
`primemate` is a prefabricated entity representing an elite monkey AI that functions as a combatant and boat commander in Don't Starve Together. It is designed to operate on boats, command other monkey crew members, hunt targets, and support allies in battle. It relies on multiple components — notably `combat`, `inventory`, `locomotor`, `crewmember`, and `walkerformplatform` — and integrates closely with the `primematebrain` AI. It handles boat targeting logic, retargeting against non-monkey characters, and event-driven coordination (e.g., rallying nearby monkeys on attack).

## Usage example
```lua
local inst = SpawnPrefab("prime_mate")
inst.Transform:SetPosition(x, y, z)
inst.components.crewmember.boat = some_boat_entity
inst.components.combat:SetTarget(target_entity)
```

## Dependencies & tags
**Components used:** `talker`, `inventory`, `inspectable`, `thief`, `locomotor`, `combat`, `health`, `timer`, `lootdropper`, `eater`, `sleeper`, `drownable`, `knownlocations`, `boatcrew`, `walkableplatform`, `crewmember`.  
**Tags added:** `character`, `monkey`, `hostile`, `scarytoprey`, `pirate`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `abandon` | boolean | `nil` (set via task on `abandon_ship`) | Marks that the prime mate has abandoned its boat. |
| `speech_override_fn` | function | `speech_override_fn` | Overrides speech text for network synchronization. |
| `scrapbook_hide` | table | `{"ARM_carry_up"}` | Anim symbols to hide in scrapbook view. |
| `scrapbook_overridedata` | table | `{{"swap_hat", "hat_monkey_medium", "swap_hat"}}` | Custom scrapbook rendering overrides. |
| `soundtype` | string | `""` | Sound type identifier (empty here). |

## Main functions
### `OnAttacked(inst, data)`
* **Description:** Responds to being attacked by setting the attacker as the current target and coordinating nearby monkeys to assist. Sets a delayed task to forget the target after ~60 seconds.
* **Parameters:**  
  - `inst` (Entity) — the prime mate instance.  
  - `data` (table) — event data containing `attacker`.  
* **Returns:** Nothing.
* **Error states:** May fail silently if nearby entities lack `combat` component or are asleep.

### `retargetfn(inst)`
* **Description:** Determines the next valid combat target within range, ensuring it shares the same platform (e.g., boat) as the prime mate and is not a monkey. Uses `combat:CanTarget()` and platform checks.
* **Parameters:**  
  - `inst` (Entity) — the prime mate instance.  
* **Returns:** `Entity` or `nil` — the selected target.
* **Error states:** Returns `nil` if no valid target found or platform mismatch occurs.

### `shouldKeepTarget(inst)`
* **Description:** Determines whether the combat component should keep its current target. Currently returns `true` unconditionally (commented `nightmare` check suggests future extensibility).
* **Parameters:**  
  - `inst` (Entity) — the prime mate instance.  
* **Returns:** `true`.
* **Error states:** None.

### `OnPickup(inst, data)`
* **Description:** Handles item pickup events. If the item is a headgear (e.g., hat) and not already equipped, it queues an equip action on the next tick.
* **Parameters:**  
  - `inst` (Entity) — the prime mate instance.  
  - `data` (table) — event data containing `item`.  
* **Returns:** Nothing.
* **Error states:** Equip is skipped if item is invalid, not owned, or a headslot item is already equipped.

### `OnDropItem(inst, data)`
* **Description:** Removes the `"personal_possession"` tag from dropped items.
* **Parameters:**  
  - `inst` (Entity) — the prime mate instance.  
  - `data` (table) — event data containing `item`.  
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Serializes items marked `"personal_possession"` (both in slots and equipped) into the `data` table for persistence.
* **Parameters:**  
  - `inst` (Entity) — the prime mate instance.  
  - `data` (table) — output data container.  
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores `"personal_possession"` tags on items during deserialization using stored `personal_item` and `personal_equip` maps.
* **Parameters:**  
  - `inst` (Entity) — the prime mate instance.  
  - `data` (table) — loaded save data.  
* **Returns:** Nothing.
* **Error states:** No-op if `data.personal_item` or `data.personal_equip` is `nil`.

### `commandboat(inst)`
* **Description:** Periodically manages boat behavior: switches between hunting (targeting boats with high-value occupants/items), delivery, or finding nearest ally boat. Uses `boatcrew` component logic.
* **Parameters:**  
  - `inst` (Entity) — the prime mate instance.  
* **Returns:** Nothing.
* **Error states:** No-op if no `crewmember` or `boatcrew` component exists or platform mismatch occurs.

### `speech_override_fn(inst, speech)`
* **Description:** Overrides speech text based on player tag. Returns raw `speech` for players with `"wonkey"` tag; otherwise returns a randomized localised string via `CraftMonkeySpeech()`.
* **Parameters:**  
  - `inst` (Entity) — the prime mate instance.  
  - `speech` (string) — original speech string.  
* **Returns:** `string` — modified or localized speech.

### `battlecry(combatcmp, target)`
* **Description:** Returns a battle cry string ID and index for networked speech playback.
* **Parameters:**  
  - `combatcmp` (Combat) — the combat component instance.  
  - `target` (Entity or `nil`) — current combat target.  
* **Returns:** `{string, number}` — e.g., `{"MONKEY_MONKEY_BATTLECRY", 3}`.  
* **Error states:** Returns `nil` if `target == nil` or string table lookup fails.

### `OnAbandonShip(inst)`
* **Description:** Schedules a task to mark the entity as having abandoned ship after a short delay.
* **Parameters:**  
  - `inst` (Entity) — the prime mate instance.  
* **Returns:** Nothing.

### `OnDeath(inst, data)`
* **Description:** Spawns a `"cursed_monkey_token"` and drops it.
* **Parameters:**  
  - `inst` (Entity) — the prime mate instance.  
  - `data` (table) — event data.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onpickupitem` — handled by `OnPickup`.  
  - `dropitem` — handled by `OnDropItem`.  
  - `attacked` — handled by `OnAttacked`.  
  - `abandon_ship` — handled by `OnAbandonShip`.  
  - `death` — handled by `OnDeath`.  
- **Pushes:**  
  - `command` — pushed when a new boat is assigned as a target in `commandboat`.  
  - `droppedtarget`, `dropitem`, `attacked`, `death` — emitted via base components.
---
id: resistance
title: Resistance
description: Manages damage resistance logic for an entity by tracking tag-based resistances and associated callback functions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: f6bec40b
---

# Resistance

## Overview
This component enables an entity to declare and respond to damage resistances based on attacker or weapon tags. It maintains a set of resistance tags, provides callbacks for custom resistance behavior, and triggers events when damage is resisted.

## Dependencies & Tags
- **Dependencies:** None — does not require other components to be added to the entity.
- **Tags Added/Removed:** None — it *uses* tags for comparison but does not add or remove entity tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tags` | `table` | `{}` | A set of tag strings representing damage types the entity resists (key and value both equal to the tag name). |
| `onresistdamage` | `function?` | `nil` | Optional callback invoked when damage is resisted; signature: `fn(inst, damage_amount, attacker)`. |
| `shouldresistfn` | `function?` | `nil` | Optional predicate function determining if resistance should occur; signature: `fn(inst)`. |

## Main Functions

### `AddResistance(tag)`
* **Description:** Registers a tag as a resistance condition. If an attacker or weapon carries this tag, resistance logic may apply.
* **Parameters:**
  - `tag` (`string`): The tag to add to the list of resistances.

### `RemoveResistance(tag)`
* **Description:** Removes a previously registered resistance tag.
* **Parameters:**
  - `tag` (`string`): The tag to remove from the resistance list.

### `HasResistance(attacker, weapon)`
* **Description:** Checks whether the entity resists the given `attacker` or `weapon` based on shared tags. Returns `true` if any resistance tag matches either the attacker or weapon.
* **Parameters:**
  - `attacker` (`Entity?`): The entity dealing damage (may be `nil`).
  - `weapon` (`Entity?`): The weapon used in the attack (may be `nil`).

### `HasResistanceToTag(tag)`
* **Description:** Returns `true` if the given tag is registered as a resistance.
* **Parameters:**
  - `tag` (`string`): The tag to check.

### `SetOnResistDamageFn(fn)`
* **Description:** Sets a custom callback to execute when damage is resisted.
* **Parameters:**
  - `fn` (`function?`): Function to call on resistance; signature: `fn(inst, damage_amount, attacker)`.

### `SetShouldResistFn(fn)`
* **Description:** Sets a predicate function to determine whether resistance should be applied. If not set, resistance always applies.
* **Parameters:**
  - `fn` (`function?`): Function returning `true`/`false`; signature: `fn(inst)`.

### `ShouldResistDamage()`
* **Description:** Evaluates whether resistance should occur based on `shouldresistfn`, returning `true` if no function is set.
* **Parameters:** None.

### `ResistDamage(damage_amount, attacker)`
* **Description:** Triggers the resistance callback (if set) and broadcasts the `damageresisted` event.
* **Parameters:**
  - `damage_amount` (`number`): The amount of damage resisted.
  - `attacker` (`Entity?`): The entity that dealt the damage.

### `GetDebugString()`
* **Description:** Returns a formatted string listing all registered resistance tags for debugging.
* **Parameters:** None.

## Events & Listeners
- **Events Pushed:**
  - `damageresisted`: Dispatched with payload `{damage_amount = number, attacker = Entity?}` when `ResistDamage()` is called.
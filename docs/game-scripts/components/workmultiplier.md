---
id: workmultiplier
title: Workmultiplier
description: Manages per-action work rate multipliers for an entity by tracking additive modifiers from different sources.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 7f0dc60e
---

# Workmultiplier

## Overview
This component enables an entity to apply dynamic, source-tracked multipliers to the amount of work done for specific actions (e.g., chopping, mining). It uses `SourceModifierList` to maintain separate modifier stacks per action, allowing multiple modifiers (e.g., from equipped tools, status effects) to combine multiplicatively via their `Get()` method. It also supports a custom override function (`specialfn`) for action-specific work calculation logic.

## Dependencies & Tags
- **Dependencies:** `util/sourcemodifierlist` module.
- **No components are added/removed** on the entity (`inst`) by this component.
- **No tags are added/removed** on the entity by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *none* | The entity this component is attached to (passed into constructor). |
| `actions` | `table<string, SourceModifierList>` | `{}` | Maps action names (strings) to `SourceModifierList` instances, each storing source-based modifiers for that action. |
| `specialfn` | `function?` | `nil` | Optional custom function to override default work amount calculation; takes `(inst, action, target, tool, numworks, recoil)` and returns the final work amount. |

## Main Functions

### `GetMultiplier(action)`
* **Description:** Returns the current multiplicative work modifier for a given action. Returns `1` if no modifiers exist for the action.
* **Parameters:**
  * `action` (`string`): The name of the action (e.g., `"chop"`, `"mine"`) to query.

### `AddMultiplier(action, multiplier, source)`
* **Description:** Adds or updates a work multiplier for a specific action, associated with a named source (e.g., `" equipped_axe"`, `"hunger_bonus"`). Creates a new `SourceModifierList` for the action if needed.
* **Parameters:**
  * `action` (`string`): The action to modify.
  * `multiplier` (`number`): The numeric modifier value to apply (e.g., `1.5`, `0.8`).
  * `source` (`string`): A unique identifier for the origin of this modifier (used to allow multiple sources and to remove later).

### `RemoveMultiplier(action, source)`
* **Description:** Removes a previously added modifier for a given action and source. Does nothing if the action has no modifiers or the source is not present.
* **Parameters:**
  * `action` (`string`): The action whose modifier to remove.
  * `source` (`string`): The source identifier previously passed to `AddMultiplier`.

### `SetSpecialMultiplierFn(fn)`
* **Description:** Sets or clears the custom work calculation function. Setting `nil` disables override behavior.
* **Parameters:**
  * `fn` (`function?`): A function with signature `(inst, action, target, tool, numworks, recoil) -> number`, or `nil`.

### `ResolveSpecialWorkAmount(action, target, tool, numworks, recoil)`
* **Description:** Invokes the custom work function (if set); otherwise, returns the original `numworks` unchanged. Used to handle edge cases requiring full control over work output.
* **Parameters:**
  * `action` (`string`): The action being performed.
  * `target` (`Entity?`): The target entity of the action (may be `nil`).
  * `tool` (`Entity?`): The tool entity used (may be `nil`).
  * `numworks` (`number`): The base or calculated work amount before override.
  * `recoil` (`boolean?`): Whether the action includes recoil logic (e.g., tool durability loss).
* **Returns:** `number` — The final work amount, either computed by `specialfn` or passed through as `numworks`.

## Events & Listeners
None identified.
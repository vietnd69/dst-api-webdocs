---
id: itemweigher
title: Itemweigher
description: A component that manages trophy scale type tagging and provides a hook for custom weighing logic when an item is placed on a scale.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: b949240c
---

# Itemweigher

## Overview
The `ItemWeigher` component enables an entity (typically a scale in the game, such as the Trophy Scale) to associate a trophy scale type (e.g., `"small"`, `"medium"`, `"large"`) via dynamic tagging, and to support custom weighing behavior via a user-defined function. It is used primarily by scale entities to determine what trophy tier an item belongs to upon being weighed.

## Dependencies & Tags
- **Tags managed internally:** Adds or removes `"trophyscale_<type>"` tags on the entity when `type` is set or changed (e.g., `"trophyscale_large"`).
- **No external component dependencies** are declared or implied in this script.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(constructor arg)* | Reference to the entity the component is attached to. |
| `type` | `string?` | `nil` | The current trophy scale type; `nil` means no type assigned (no tag applied). |
| `ondoweighinfn` | `function?` | `nil` | Optional callback function invoked when `DoWeighIn()` is called; receives `(scale_inst, target_inst, doer_inst)` as arguments. |

> **Note:** The `type` property is not stored as a direct member on `self` in `_ctor`, but the class defines `type = ontype` in the metatable, which redirects assignments to the `ondype` function. This makes `itemweigher.type = "large"` trigger the `ontype` function, which handles tagging.

## Main Functions
### `SetOnDoWeighInFn(fn)`
* **Description:** Sets the callback function that will be executed when `DoWeighIn()` is invoked. This allows external code (e.g., the scale’s interaction logic) to define custom weighing behavior.
* **Parameters:**
  * `fn` *(function)* — A callable function expecting three arguments: `(scale_inst, target_inst, doer_inst)`, where:
    * `scale_inst` is the scale entity,
    * `target_inst` is the item being weighed,
    * `doer_inst` is the player or entity performing the weigh-in.

### `DoWeighIn(target, doer)`
* **Description:** Executes the stored weighing callback function, if one is set. Returns the result of the callback or `nil` if no callback is assigned.
* **Parameters:**
  * `target` *(Entity)* — The item or entity being weighed.
  * `doer` *(Entity)* — The entity performing the weigh-in action (typically a player).

## Events & Listeners
- Listens for internal property assignment via the `type` setter, which triggers `ontype(self, type, old_type)`.
- When `type` is set:
  - If `old_type` is non-nil, removes tag `"trophyscale_"..old_type`.
  - If `new type` is non-nil, adds tag `"trophyscale_"..type`.
- **No external event listeners** (e.g., `ListenForEvent`) are registered in this component.
- The `OnRemoveFromEntity()` hook sets `type = nil` on removal to clear any associated tag.
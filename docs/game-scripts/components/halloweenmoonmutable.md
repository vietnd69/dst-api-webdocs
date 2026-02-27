---
id: halloweenmoonmutable
title: Halloweenmoonmutable
description: Enables an entity to transform into another prefab under the influence of the Halloween moon, supporting custom override logic and event callbacks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: dc7c76ab
---

# Halloweenmoonmutable

## Overview
This component allows an entity to mutate (transform) into a different prefab when triggered—typically during the Halloween moon event. It supports configurable mutation behavior via a target prefab, custom override functions, and optional callbacks. It automatically tags the entity as `"halloweenmoonmutable"` and cleans up that tag on removal.

## Dependencies & Tags
- Adds tag `"halloweenmoonmutable"` to the entity in the constructor.
- Removes tag `"halloweenmoonmutable"` on component removal (`OnRemoveFromEntity`).
- Relies on optional components: `health`, `inventoryitem`, `stackable`. These are *not* added by the component but are used conditionally if present.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity. |
| `prefab_mutated` | `string or function` | `nil` | The prefab name (or a function returning one) to mutate into. Used unless `conversionoverridefn` is set. |
| `onmutatefn` | `function` | `nil` | Optional callback invoked *after* mutation: signature `(original_inst, new_inst?)`. When `conversionoverridefn` is used, `new_inst` is `nil`. |
| `push_attacked_on_new_inst` | `boolean` | `true` | Whether to push an `"attacked"` event on the new instance post-mutation. |
| `conversionoverridefn` | `function` | `nil` | Optional override function `(original_inst) → (new_inst, container?)`. Takes precedence over `prefab_mutated`. |

## Main Functions

### `SetPrefabMutated(prefab)`
* **Description:** Sets the target prefab to mutate into. Accepts either a string (prefab name) or a function that returns a string.
* **Parameters:**  
  `prefab` (string or function) — Prefab identifier or a function returning a string, called with `self.inst` as argument.

### `SetOnMutateFn(fn)`
* **Description:** Assigns a callback function to run after mutation. This is called regardless of mutation method.
* **Parameters:**  
  `fn` (function) — Function with signature `(original_inst, new_inst?)`. If `conversionoverridefn` is used, `new_inst` is `nil`.

### `SetConversionOverrideFn(fn)`
* **Description:** Sets a custom mutation function that completely overrides default logic (including `prefab_mutated`). Useful for complex transformations (e.g., UI-driven changes or multi-step logic).
* **Parameters:**  
  `fn` (function) — Function with signature `(original_inst) → (transformed_inst, container?)`. Must return the new entity and optionally a container for placement.

### `Mutate(overrideprefab)`
* **Description:** Performs the actual mutation. Checks if the entity is alive, applies mutation (using either `conversionoverridefn` or `prefab_mutated`), handles positioning/health copy, disposes the original, places the new instance, and triggers `"onhalloweenmoonmutate"`.
* **Parameters:**  
  `overrideprefab` (string or function, optional) — Temporary override of `prefab_mutated` for this mutation call only.  
  *Returns:* `Entity or nil` — The new transformed entity, or `nil` if mutation failed (e.g., dead entity, failed spawn).

## Events & Listeners
- **Listens for:** None.
- **Triggers:**
  - `"onhalloweenmoonmutate"` — Pushed after successful mutation in both code paths.
  - `"attacked"` — Pushed on the new instance *only* if `push_attacked_on_new_inst` is `true` and no container is available to receive the item.
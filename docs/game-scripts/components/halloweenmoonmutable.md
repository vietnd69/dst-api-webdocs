---
id: halloweenmoonmutable
title: Halloweenmoonmutable
description: Provides mutation functionality for entities under the influence of the Halloween Moon, allowing them to transform into a different prefab or be processed via a custom override function.
tags: [event, transform, halloween]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: dc7c76ab
system_scope: entity
---

# Halloweenmoonmutable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Halloweenmoonmutable` enables an entity to mutate—typically during the Halloween Moon event—into a different prefab. It supports both a default prefab-based transformation and a flexible override function for custom mutation logic. The component ensures health percentage, position, and inventory/container placement are preserved or handled appropriately during the transformation. It automatically adds the `halloweenmoonmutable` tag to the owning entity upon construction and removes it when detached.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("halloweenmoonmutable")
inst.components.halloweenmoonmutable:SetPrefabMutated("beefalo_mutated")
inst.components.halloweenmoonmutable:SetOnMutateFn(function(original, transformed)
    print("Mutated from", original.prefab, "to", transformed.prefab)
end)
-- Later, trigger mutation:
local new_inst = inst.components.halloweenmoonmutable:Mutate()
```

## Dependencies & tags
**Components used:** `health`, `inventoryitem`, `stackable`
**Tags:** Adds `halloweenmoonmutable`; no other tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prefab_mutated` | string or function | `nil` | The prefab name or a function returning a prefab name to mutate into. |
| `onmutatefn` | function | `nil` | Optional callback called with `(original_inst, transformed_inst)` after mutation. |
| `push_attacked_on_new_inst` | boolean | `true` | Whether to push `attacked` event on the new instance post-mutation (used as fallback when not placed in a container). |
| `conversionoverridefn` | function | `nil` | Optional high-priority override function that handles full transformation logic. |

## Main functions
### `SetPrefabMutated(prefab)`
* **Description:** Sets the target prefab for standard mutation. Can be a string or a callable returning a string.
* **Parameters:** `prefab` (string|function) — the prefab name or function yielding a prefab name.
* **Returns:** Nothing.

### `SetOnMutateFn(fn)`
* **Description:** Registers a callback to be invoked during mutation. Passed the original and (optionally) the new entity instance.
* **Parameters:** `fn` (function) — signature `(original_inst: Entity, transformed_inst: Entity?)`.
* **Returns:** Nothing.

### `SetConversionOverrideFn(fn)`
* **Description:** Sets a custom transformation function that completely overrides the standard mutation flow (including `prefab_mutated`). The function is responsible for spawning, positioning, and replacing the original entity.
* **Parameters:** `fn` (function) — signature `(original_inst: Entity)`, expected to return `(new_inst: Entity?, container: ContainerComponent?)`.
* **Returns:** Nothing.

### `Mutate(overrideprefab)`
* **Description:** Initiates the entity mutation process. If a `conversionoverridefn` is defined, it is used; otherwise, the standard path using `prefab_mutated` is taken. Dead entities are skipped.
* **Parameters:** `overrideprefab` (string|nil) — optional temporary override of `prefab_mutated`.
* **Returns:** `Entity?` — the new entity instance if successful, otherwise `nil`.
* **Error states:** Returns `nil` if the original entity is dead (`health:IsDead()`) or if `SpawnPrefab` fails. Also returns `nil` when no valid `prefab` is available.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls in this component).
- **Pushes:** `onhalloweenmoonmutate` — fired after mutation is complete (including override path and standard path).

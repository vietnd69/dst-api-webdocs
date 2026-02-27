---
id: spellcaster
title: Spellcaster
description: This component enables an entity to cast spells by defining casting restrictions, tag management, and spell execution logic.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 0da1e6cb
---

# Spellcaster

## Overview
The `SpellCaster` component manages spell-casting capabilities for an entity within the DST Entity Component System. It defines which objects, targets, and locations a spell may be used on, dynamically updates entity tags based on spell configuration, and handles spell execution via a provided callback function.

## Dependencies & Tags
**Components**: None explicitly required (though the component expects `inst.entity:IsVisible()`, `target.components.health`, `target.sg`, `doer.components.locomotor`, and `doer.components.combat` to exist in certain paths, they are not added by this component).  
**Tags Added/Removed**:
- `castfrominventory`
- `castontargets`
- `castonrecipes`
- `castonlocomotors`
- `castonlocomotorspvp`
- `castonworkable`
- `castoncombat`
- `castonpoint`
- `castonpointwater`
- `quickcast`
- `veryquickcast`
- `<spelltype>_spellcaster`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the parent entity. |
| `onspellcast` | `function?` | `nil` | Optional callback invoked after a spell is cast. |
| `canusefrominventory` | `boolean` | `false` | Whether the spell can be cast from inventory (no target or point required). |
| `canuseontargets` | `boolean` | `false` | Whether the spell can be cast on valid targets. |
| `canuseondead` | `boolean` | `false` | Whether the spell can be cast on dead targets. |
| `canonlyuseonrecipes` | `boolean` | `false` | Restricts targeting to destructible recipe items (e.g., crafted structures). |
| `canonlyuseonlocomotors` | `boolean` | `false` | Restricts targeting to entities with a `Locomotor` component. |
| `canonlyuseonlocomotorspvp` | `boolean` | `false` | Restricts targeting to locomotor-equipped entities *including* player-vs-player contexts. |
| `canonlyuseonworkable` | `boolean` | `false` | Restricts targeting to workable entities (e.g., trees, rocks). |
| `canonlyuseoncombat` | `boolean` | `false` | Restricts targeting to entities the wielder can directly attack. |
| `canuseonpoint` | `boolean` | `false` | Whether the spell can be cast on a world position (on land). |
| `canuseonpoint_water` | `boolean` | `false` | Whether the spell can be cast on water (e.g., ocean tiles). |
| `spell` | `function?` | `nil` | Main spell function: `(inst, target, pos, doer) → nil`. |
| `quickcast` | `boolean` | `false` | If `true`, adds the `quickcast` tag. |
| `veryquickcast` | `boolean` | `false` | If `true`, adds the `veryquickcast` tag. |
| `spelltype` | `string?` | `nil` | Type (e.g., `"dark"`, `"magic"`) used to enforce spell-user tag requirements. |
| `can_cast_fn` | `function?` | `nil` | Optional custom casting validation function. |

## Main Functions

### `SetSpellFn(fn)`
* **Description:** Assigns the primary spell function to execute when `CastSpell` is called.  
* **Parameters:**  
  - `fn` (`function`): A callable with signature `(inst, target, pos, doer)`.

### `SetOnSpellCastFn(fn)`
* **Description:** Sets a callback function triggered *after* the spell function completes (if the spell exists).  
* **Parameters:**  
  - `fn` (`function`): A callable with signature `(inst, target, pos, doer)`.

### `SetCanCastFn(fn)`
* **Description:** Assigns a custom validation function for casting logic, used in `CanCast` when evaluating point/target constraints.  
* **Parameters:**  
  - `fn` (`function`): A callable with signature `(doer, target, pos, spellcaster_inst)` returning `can_cast (boolean) [, reason (string)]`.

### `SetSpellType(type)`
* **Description:** Sets the spell type, which adds the `<type>_spellcaster` tag and enforces that casters must carry the corresponding `<type>_spelluser` tag.  
* **Parameters:**  
  - `type` (`string`): A string identifier (e.g., `"dark"`).

### `CastSpell(target, pos, doer)`
* **Description:** Executes the assigned `spell` function (if present), then invokes `onspellcast` if defined.  
* **Parameters:**  
  - `target` (`Entity?`): The target entity, or `nil` for point-based casting.  
  - `pos` (`Vector3?`): World position for point-target casting.  
  - `doer` (`Entity`): The entity performing the cast.

### `CanCast(doer, target, pos)`
* **Description:** Validates whether the spell can be cast under current conditions, considering tag/ability restrictions, target state, and custom logic. Returns `true`/`false`, optionally with a `cast_fail_reason` string.  
* **Parameters:**  
  - `doer` (`Entity`): The casting entity.  
  - `target` (`Entity?`): The intended target, or `nil`.  
  - `pos` (`Vector3?`): World position, required only for point casting.  
* **Return:** `boolean, string?` — Whether casting is allowed, and optionally a failure reason.

## Events & Listeners
The component does not use `inst:ListenForEvent` and does not emit events via `inst:PushEvent`. Tag updates are immediate side effects of property assignments or explicit method calls.
---
id: spellcaster
title: Spellcaster
description: Manages spell casting behavior and restrictions for an entity, including target validity, casting conditions, and tag management.
tags: [spellcasting, target, inventory, ai]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0da1e6cb
system_scope: entity
---

# Spellcaster

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SpellCaster` governs how an entity may cast spells, including *when*, *where*, and *on whom* a spell can be used. It supports a range of casting restrictions—such as only usable on workables, combat targets, or recipes—and dynamically manages tags (e.g., `castontargets`, `castonpoint`) to signal casting capabilities to the UI and gameplay systems. It works closely with the `combat`, `health`, `locomotor`, and `workable` components to enforce casting rules at runtime.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("spellcaster")

inst.components.spellcaster:SetSpellFn(function(inst, target, pos, doer)
    -- Custom spell logic here
end)

inst.components.spellcaster:SetCanCastFn(function(doer, target, pos, spellcaster)
    -- Custom cast validation logic
    return true, nil
end)

inst.components.spellcaster:SetSpellType("shadow")
inst.components.spellcaster.canuseontargets = true
inst.components.spellcaster.canusefrominventory = false

local can_cast = inst.components.spellcaster:CanCast(player, target, nil)
if can_cast then
    inst.components.spellcaster:CastSpell(target, nil, player)
end
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `workable`  
**Tags added/removed:** `castfrominventory`, `castontargets`, `castonrecipes`, `castonlocomotors`, `castonlocomotorspvp`, `castonworkable`, `castoncombat`, `castonpoint`, `castonpointwater`, `quickcast`, `veryquickcast`, `spelltype.."_spellcaster"` (e.g., `shadow_spellcaster`), `nospellcaster` (removed on removal)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spell` | function or `nil` | `nil` | Function `(inst, target, pos, doer)` to invoke when `CastSpell()` is called. |
| `canusefrominventory` | boolean | `false` | Whether the spell can be cast directly from inventory (without target or position). |
| `canuseontargets` | boolean | `false` | Whether the spell can be cast on targets (must be true to enable most target-specific logic). |
| `canuseondead` | boolean | `false` | Whether the spell can be cast on dead targets (ignored unless `canuseontargets` is `true`). |
| `canonlyuseonrecipes` | boolean | `false` | If true, spell only works on deconstructable recipes. |
| `canonlyuseonlocomotors` | boolean | `false` | If true, spell only works on entities with `locomotor` component (non-PvP exclusive). |
| `canonlyuseonlocomotorspvp` | boolean | `false` | If true, spell works on any `locomotor` entity (including PvP). Overrides `canonlyuseonlocomotors`. |
| `canonlyuseonworkable` | boolean | `false` | If true, spell only works on workable objects performing valid actions (e.g., `CHOP`, `MINE`). |
| `canonlyuseoncombat` | boolean | `false` | If true, spell only works on targets the *doer* can attack (checked via `combat:CanTarget`). |
| `canuseonpoint` | boolean | `false` | Whether spell can be cast at a ground point (above-ground only). |
| `canuseonpoint_water` | boolean | `false` | Whether spell can be cast at a water point (ocean only). |
| `quickcast` | boolean | `false` | Enables `quickcast` tag when true. |
| `veryquickcast` | boolean | `false` | Enables `veryquickcast` tag when true. |
| `spelltype` | string or `nil` | `nil` | Required type tag for *users* (e.g., `"shadow"` requires `doer:HasTag("shadow_spelluser")`). |
| `can_cast_fn` | function or `nil` | `nil` | Optional custom cast validation callback `(doer, target, pos, self.inst)` returning `bool, reason?`. |
| `onspellcast` | function or `nil` | `nil` | Callback fired after successful `CastSpell()` call. |

## Main functions
### `SetSpellFn(fn)`
* **Description:** Sets the spell function to be invoked when `CastSpell()` is called.
* **Parameters:** `fn` (function) — signature: `fn(inst, target, pos, doer)`.
* **Returns:** Nothing.

### `SetOnSpellCastFn(fn)`
* **Description:** Sets a callback to be triggered *after* the spell function executes.
* **Parameters:** `fn` (function) — signature: `fn(inst, target, pos, doer)`.
* **Returns:** Nothing.

### `SetCanCastFn(fn)`
* **Description:** Assigns a custom validation function for casting. Overrides internal checks in `CanCast()` where applicable.
* **Parameters:** `fn` (function) — signature: `fn(doer, target, pos, spellcaster_inst)`, returning `(can_cast: boolean, reason: string?)`.
* **Returns:** Nothing.

### `SetSpellType(type)`
* **Description:** Sets the required type tag that spell *users* must possess (e.g., `"shadow"` → requires `shadow_spelluser` tag on `doer`).
* **Parameters:** `type` (string) — the spell type identifier.
* **Returns:** Nothing.

### `CastSpell(target, pos, doer)`
* **Description:** Invokes the configured `spell` function (if present) with the given arguments, then fires `onspellcast` if set.
* **Parameters:**  
  - `target` (Entity or `nil`) — The target entity, if any.  
  - `pos` (Vector3 or `nil`) — Position for point casting.  
  - `doer` (Entity) — The entity performing the cast.
* **Returns:** Nothing.

### `CanCast(doer, target, pos)`
* **Description:** Validates whether the spell can be cast under the current conditions, applying all configured constraints and component checks.
* **Parameters:**  
  - `doer` (Entity) — The entity attempting to cast.  
  - `target` (Entity or `nil`) — The intended target (may be `nil` for point casting).  
  - `pos` (Vector3 or `nil`) — The target position (used if `target == nil`).
* **Returns:** `can_cast: boolean` — `true` if casting is allowed.  
  - If `can_cast_fn` is set and returns `false`, also returns `reason: string`.
* **Error states:**  
  - Returns `false` if `spell` is `nil`.  
  - Returns `false` if `spelltype` is set but `doer` lacks `spelltype.."_spelluser"` tag.  
  - Returns `false` if `target` is `nil` and neither `canusefrominventory` nor point-casting flags (`canuseonpoint`, `canuseonpoint_water`) are enabled.  
  - Returns `false` if `target` is in limbo, invisible, dead (unless `canuseondead`), or in forbidden states (`death`, `flight`, `invisible`, `nospellcasting`).  
  - Returns `false` if `canuseontargets` is `false` but target is specified.

## Events & listeners
* **Listens to:** None (tags are managed directly during property assignment and `OnRemoveFromEntity`).
* **Pushes:** None (events are emitted by higher-level logic, not `SpellCaster` itself).

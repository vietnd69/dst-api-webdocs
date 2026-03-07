---
id: aoeweapon_leap
title: Aoeweapon Leap
description: Enables a leap-based area-of-effect weapon attack that hits multiple targets in a radius and optionally tosses physics-enabled entities.
tags: [combat, aoe, leap, weapon]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7aba6739
system_scope: combat
---

# Aoeweapon Leap

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Aoeweapon_Leap` is a specialized component that extends `Aoeweapon_Base` to handle leap-style weapon attacks. During a leap, it temporarily disables line-of-sight and hit range checks for the attacker, performs area-of-effect damage to nearby valid targets, and optionally tosses lightweight physics entities (e.g., items or small creatures) away from the impact point. It is designed for characters or creatures with high-mobility melee attacks (e.g., leap strikes). The component automatically adds the `aoeweapon_leap` tag to the owning entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("aoeweapon_leap")
inst:AddComponent("weapon")
inst:AddComponent("combat")

inst.components.aoeweapon_leap:SetDamage(20)
inst.components.aoeweapon_leap:SetAOERadius(5)

inst.components.aoeweapon_leap:SetOnPreLeapFn(function(inst, doer, start, target)
    print("Starting leap from", start, "to", target)
end)

inst.components.aoeweapon_leap:SetOnLeaptFn(function(inst, doer, start, target)
    print("Completed leap to", target)
end)

-- Perform leap attack
local success = inst.components.aoeweapon_leap:DoLeap(inst, Vector3(0,0,0), Vector3(10,0,10))
```

## Dependencies & tags
**Components used:** `aoeweapon_base`, `combat`, `health`, `weapon`  
**Tags:** Adds `aoeweapon_leap` to the owning entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `aoeradius` | number | `4` | Base radius of the leap hit area (in game units). |
| `physicspadding` | number | `3` | Extra padding added to `aoeradius` when performing entity queries (used for finding toss targets). |
| `onpreleapfn` | function | `nil` | Optional callback invoked before the leap effect executes. Signature: `fn(inst, doer, startingpos, targetpos)`. |
| `onleaptfn` | function | `nil` | Optional callback invoked after the leap effect completes. Signature: `fn(inst, doer, startingpos, targetpos)`. |

## Main functions
### `SetAOERadius(radius)`
* **Description:** Sets the base radius of the leap attack area.
* **Parameters:** `radius` (number) — the radius in game units.
* **Returns:** Nothing.

### `SetOnPreLeapFn(fn)`
* **Description:** Registers a function to be called immediately before performing the leap attack.
* **Parameters:** `fn` (function) — callback with signature `(inst, doer, startingpos, targetpos)`.
* **Returns:** Nothing.

### `SetOnLeaptFn(fn)`
* **Description:** Registers a function to be called after the leap attack completes.
* **Parameters:** `fn` (function) — callback with signature `(inst, doer, startingpos, targetpos)`.
* **Returns:** Nothing.

### `DoLeap(doer, startingpos, targetpos)`
* **Description:** Executes the leap attack: disables combat restrictions, deals AoE damage to nearby living non-player targets, tosses eligible items, and restores combat settings.
* **Parameters:**
  * `doer` (Entity) — the entity performing the leap (must have `combat` component).
  * `startingpos` (Vector3) — the origin position of the leap (unused in logic, but passed to callbacks).
  * `targetpos` (Vector3) — the impact position where AoE/toss checks are centered.
* **Returns:** `true` if the leap was executed successfully; `false` if preconditions failed.
* **Error states:** Returns `false` if `startingpos`, `targetpos`, or `doer` is missing, or if `doer` lacks a `combat` component.

## Events & listeners
- **Pushes:** No events are pushed by this component.  
- **Listens to:** None — no event listeners are registered.

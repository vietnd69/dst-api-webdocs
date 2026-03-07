---
id: staff_lunarplant
title: Staff Lunarplant
description: A ranged magical weapon component that channels planar energy and supports broken/repaired states with visual FX integration.
tags: [combat, ranged, broken_state, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 451ff4eb
system_scope: combat
---

# Staff Lunarplant

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`staff_lunarplant` is a weapon prefab implementing a planar-damage-based ranged weapon with breakable mechanics. It integrates multiple components to support equipping, projectile attacks, visual effects (FX) synchronization, broken-state handling, and set bonuses. The component manages a child FX entity (`staff_lunarplant_fx`) that follows the owner and receives dynamic colour updates via `colouradder`.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddNetwork()

MakeInventoryPhysics(inst)

inst:AddComponent("finiteuses")
inst.components.finiteuses:SetMaxUses(TUNING.STAFF_LUNARPLANT_USES)
inst.components.finiteuses:SetUses(TUNING.STAFF_LUNARPLANT_USES)

inst:AddComponent("planardamage")
inst.components.planardamage:SetBaseDamage(TUNING.STAFF_LUNARPLANT_PLANAR_DAMAGE)

inst:AddComponent("damagetypebonus")
inst.components.damagetypebonus:AddBonus("shadow_aligned", inst, TUNING.STAFF_LUNARPLANT_VS_SHADOW_BONUS)

-- Equip/unequip hooks must be manually wired via equippable component
```

## Dependencies & tags
**Components used:** `equippable`, `weapon`, `floater`, `finiteuses`, `planardamage`, `damagetypebonus`, `inspectable`, `inventoryitem`, `setbonus`, `highlightchild`, `colouradder`, `sleeper`, `combat`  
**Tags added:** `rangedweapon`, `magicweapon`, `show_broken_ui`, `weapon`, `FX`  
**Tags conditionally added/removed:** `broken`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isbroken` | `net_bool` | `false` | Networked boolean tracking broken state. Triggers `isbrokendirty` event on change. |
| `projectiledelay` | number | `FRAMES` | Delay (in frames) before projectile launch. |
| `_fxowner` | Entity or `nil` | `nil` | Internal reference to the entity currently holding/equipping the staff. |

## Main functions
### `SetFxOwner(inst, owner)`
*   **Description:** Reparents and reorients the FX entity (`inst.fx`) to follow either the owner or the staff itself, managing `highlightchild` and `colouradder` subscriptions.
*   **Parameters:** `owner` (Entity or `nil`) — the entity currently holding the staff; if `nil`, FX attaches to staff and floats independently.
*   **Returns:** Nothing.

### `OnAttack(inst, attacker, target, skipsanity)`
*   **Description:** Handler invoked on weapon attack. Wakes sleeping targets, suggests attacker as combat target, and fires the `"attacked"` event with zero base damage (planar damage is handled separately).
*   **Parameters:**
    *   `inst` (Entity) — the weapon entity.
    *   `attacker` (Entity) — entity performing the attack.
    *   `target` (Entity) — target entity (may be invalid).
    *   `skipsanity` (boolean) — unused in this implementation.
*   **Returns:** Nothing. Returns early if target is invalid.

### `SetupComponents(inst)`
*   **Description:** Adds and configures `equippable` and `weapon` components for pristine (functional) state.
*   **Parameters:** `inst` (Entity) — staff entity.
*   **Returns:** Nothing.

### `DisableComponents(inst)`
*   **Description:** Removes `equippable` and `weapon` components when staff is broken.
*   **Parameters:** `inst` (Entity) — staff entity.
*   **Returns:** Nothing.

### `SetIsBroken(inst, isbroken)`
*   **Description:** Configures floating behavior, FX visibility, and networked broken state based on `isbroken` flag.
*   **Parameters:** `isbroken` (boolean) — new broken state.
*   **Returns:** Nothing.

### `OnBroken(inst)`
*   **Description:** Handles transition to broken state: disables combat components, plays broken animation, adds `"broken"` tag, and sets inspectable name override.
*   **Parameters:** `inst` (Entity) — staff entity.
*   **Returns:** Nothing.

### `OnRepaired(inst)`
*   **Description:** Restores full functionality when repaired: re-adds combat components, resets animation, removes `"broken"` tag, and clears inspectable override.
*   **Parameters:** `inst` (Entity) — staff entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"floater_stopfloating"` — triggers `OnStopFloating` to restore idle animation.  
  - `"isbrokendirty"` (client only) — triggers `OnIsBrokenDirty` to update FX visual scaling.  
  - `"onremove"` — attached internally to child FX entities via `colouradder:AttachChild` to auto-detach when child is removed.
- **Pushes:**  
  - `"equipskinneditem"` / `"unequipskinneditem"` — fired during equip/unequip if the staff has a skin.  
  - `"attacked"` — fired on attack with `{ attacker, damage = 0, weapon }` payload.
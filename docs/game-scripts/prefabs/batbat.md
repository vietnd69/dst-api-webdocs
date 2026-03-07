---
id: batbat
title: Batbat
description: A consumable weapon item that deals damage on attack and drains health/sanity from valid targets on critical hits.
tags: [weapon, consumable, combat, sanity, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c703117b
system_scope: inventory
---

# Batbat

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `batbat` is a consumable weapon item used by players to deal combat damage. It is equipped via the `equippable` component and triggers special effects when attacking healthy targets: on successful hits against life-form targets, it optionally spawns skin-specific visual effects and drains health and sanity from the wielder when the wielder is already hurt. The item has a finite number of uses and automatically removes itself when depleted.

It depends on the `weapon`, `equippable`, `finiteuses`, `shadowlevel`, and `health`/`sanity` components, and integrates with animation states for skin overrides and sound FX for fluttering effects.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("weapon")
inst.components.weapon:SetDamage(TUNING.BATBAT_DAMAGE)
inst:AddComponent("equippable")
inst:AddComponent("finiteuses")
inst.components.finiteuses:SetMaxUses(TUNING.BATBAT_USES)
inst.components.finiteuses:SetUses(TUNING.BATBAT_USES)
inst.components.finiteuses:SetOnFinished(inst.Remove)
```

## Dependencies & tags
**Components used:**  
- `weapon` — sets damage and attack behavior  
- `equippable` — manages equip/unequip visual states and skin overrides  
- `finiteuses` — tracks and enforces use count  
- `shadowlevel` — sets default shadow level  
- `inspectable` and `inventoryitem` — basic item functionality  
- `transform`, `animstate`, `network` — core entity infrastructure  

**Tags added:**  
- `dull`, `weapon`, `shadowlevel` — added to pristine state  
- `FX`, `NOCLICK`, `nointerpolate` — added to FX prefabs (`batbat_bats`, `batbat_fantasy_fx`)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.weapon.damage` | number | `TUNING.BATBAT_DAMAGE` | Base damage dealt per attack |
| `inst.components.finiteuses.total` | number | `TUNING.BATBAT_USES` | Total allowed uses before depletion |
| `inst.components.finiteuses.current` | number | `TUNING.BATBAT_USES` | Remaining uses (set during init) |
| `inst.components.equippable.onequipfn` | function | `onequip` | Callback invoked on equip |
| `inst.components.equippable.onunequipfn` | function | `onunequip` | Callback invoked on unequip |
| `inst.components.shadowlevel.level` | number | `TUNING.BATBAT_SHADOW_LEVEL` | Default shadow level for visibility |

## Main functions
### `onequip(inst, owner)`
*   **Description:** Called when the batbat is equipped. Applies skin overrides to the owner’s `swap_object` symbol, plays the `ARM_carry` animation, and hides `ARM_normal`.
*   **Parameters:**  
    - `inst` (Entity) — the batbat instance  
    - `owner` (Entity) — the entity equipping the item  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Called when the batbat is unequipped. Restores the owner’s `ARM_normal` animation and hides `ARM_carry`. Clears skin overrides if a skin is active.
*   **Parameters:**  
    - `inst` (Entity)  
    - `owner` (Entity)  
*   **Returns:** Nothing.

### `onattack(inst, owner, target)`
*   **Description:** Called on weapon attack. If the target is valid and the batbat has an associated skin FX prefab, it spawns the FX and attaches it to the target’s hit effect symbol. Additionally, if the owner is hurt and the target is a life-form (or tagged `lifedrainable`), it drains health and sanity from the owner based on `TUNING.BATBAT_DRAIN`.
*   **Parameters:**  
    - `inst` (Entity) — the batbat weapon  
    - `owner` (Entity) — the entity performing the attack  
    - `target` (Entity or nil) — the entity being attacked  
*   **Returns:** Nothing.  
*   **Error states:** Does nothing if `target` is `nil`, invalid, or has no `combat` component; also skips drain if owner lacks health/sanity or is not hurt.

## Events & listeners
- **Listens to:**  
    - `animover` — on FX prefabs (`batbat_bats`, `batbat_fantasy_fx`) to remove the entity when the animation completes.  
- **Pushes:**  
    - `equipskinneditem`, `unequipskinneditem` — fired by owner during equip/unequip when a skin is applied.  
    - `healthdelta`, `sanitydelta` — triggered on owner via `DoDelta` calls.  

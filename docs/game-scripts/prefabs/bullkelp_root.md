---
id: bullkelp_root
title: Bullkelp Root
description: A deployable, perishable weapon that functions as a whip; when equipped, it overrides entity animations and can snap to deal damage while consuming spoilage.
tags: [combat, inventory, deployable, perishable, whip]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fe2c3ca2
system_scope: inventory
---

# Bullkelp Root

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bullkelp_root` is a prefab implementing a deployable, perishable whip weapon. It combines several core components: `weapon` (combat), `equippable` (animation overrides on equip), `deployable` (planting functionality), `fuel` (burning), `perishable` (spoilage decay), and `stackable`. It is used as a tool for combat and crop planting, and decays over time. When attacked, it may trigger a snap effect if spoilage is low enough.

## Usage example
```lua
local inst = SpawnPrefab("bullkelp_root")
inst:AddComponent("stackable")
inst.components.weapon:SetDamage(15)
inst.components.perishable:SetPerishTime(TUNING.PERISH_SUPERSLOW)
inst.components.perishable:StartPerishing()
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `weapon`, `equippable`, `fuel`, `perishable`, `deployable`.  
**Tags:** `whip`, `show_spoilage`, `deployedplant`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `"dropped"` | Animation played in the scrapbook view. |
| `inst.replica.perishable` | PerishableReplica | — | Networked perish state for clients. |

## Main functions
### `onattack(inst, attacker, target)`
*   **Description:** Called when the weapon attacks. Consumes spoilage percentage, then checks for snap chance based on current spoilage. If the roll succeeds, spawns an impact prefab at target position with sound and destroys the root instance.
*   **Parameters:**
    *   `inst` (Entity) — the bullkelp root entity.
    *   `attacker` (Entity) — entity performing the attack.
    *   `target` (Entity) — entity being attacked.
*   **Returns:** Nothing.
*   **Error states:** May fail silently if `target.SoundEmitter` is missing; snap effect depends on luck roll and current spoilage.

### `onequip(inst, owner)`
*   **Description:** Applies animation overrides for wielding the whip: shows `ARM_carry`, hides `ARM_normal`, and replaces `swap_object`/`whipline` symbols with `swap_bullkelproot`.
*   **Parameters:**
    *   `inst` (Entity) — the bullkelp root entity.
    *   `owner` (Entity) — entity equipping the item.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Reverts animation overrides: hides `ARM_carry`, shows `ARM_normal`.
*   **Parameters:**
    *   `inst` (Entity) — the bullkelp root entity.
    *   `owner` (Entity) — entity unequipping the item.
*   **Returns:** Nothing.

### `ondeploy(inst, pt, deployer)`
*   **Description:** Deploys the root into a `bullkelp_plant` at the target point. Consumes one stack item, marks the plant as empty, and optionally plays a planting sound.
*   **Parameters:**
    *   `inst` (Entity) — the bullkelp root entity.
    *   `pt` (Vector3 or Point) — deployment position.
    *   `deployer` (Entity?, optional) — entity performing deployment.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `SpawnPrefab("bullkelp_plant")` returns `nil`.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls in source).
- **Pushes:** None (no `inst:PushEvent` calls in source).
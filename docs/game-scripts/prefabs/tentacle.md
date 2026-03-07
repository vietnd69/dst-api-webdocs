---
id: tentacle
title: Tentacle
description: A large hostile enemy that auto-attacks nearby targets and switches aggression when attacked by other entities.
tags: [combat, ai, boss, hostile, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cef4ae3f
system_scope: entity
---

# Tentacle

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `tentacle` prefab represents a hostile in-game entity that behaves as a boss or semi-persistent predator. It uses a custom retargeting strategy and engagement logic to pursue and attack players or other entities, while dynamically switching targets when damaged by another source. It is built using the Entity Component System and relies heavily on the `combat`, `health`, and `sanityaura` components to manage combat, health, and player sanity effects.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("health")
inst.components.health:SetMaxHealth(200)
inst:AddComponent("combat")
inst.components.combat:SetRange(5)
inst.components.combat:SetDefaultDamage(20)
inst:AddTag("hostile")
inst:AddTag("monster")
inst:SetStateGraph("SGtentacle")
```

## Dependencies & tags
**Components used:** `health`, `combat`, `sanityaura`, `inspectable`, `lootdropper`, `acidinfusible`, `transform`, `physics`, `animstate`, `soundemitter`, `network`  
**Tags added:** `monster`, `hostile`, `wet`, `WORM_DANGER`, `tentacle`, `NPCcanaggro`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_last_attacker` | `entity` or `nil` | `nil` | Tracks the most recent entity that attacked this instance. |
| `_last_attacked_time` | number or `nil` | `nil` | Timestamp of the last attack received. |
| `sanityaura.aura` | number | `-TUNING.SANITYAURA_MED` | Negative sanity aura that affects nearby players. |
| `components.acidinfusible.fxlevel` | number | `1` | Controls visual FX intensity for acid infusion. |

## Main functions
### `retargetfn(inst)`
*   **Description:** Custom retargeting function used by the `combat` component to select a new target. It searches for valid entities within attack range that meet specific tag and state criteria.
*   **Parameters:** `inst` (`entity`) — the tentacle instance invoking the function.
*   **Returns:** `entity` or `nil` — the chosen target, or `nil` if none found.
*   **Error states:** Returns `nil` if no entity satisfies the visibility, tag, and health conditions.

### `shouldKeepTarget(inst, target)`
*   **Description:** Function passed to `combat:SetKeepTargetFunction`. Determines whether the tentacle should continue pursuing its current target.
*   **Parameters:**  
    * `inst` (`entity`) — the tentacle instance.  
    * `target` (`entity` or `nil`) — the current target.  
*   **Returns:** `boolean` — `true` if the target remains valid and within range; `false` otherwise.
*   **Error states:** Returns `false` if target is `nil`, invalid, invisible, dead, or too far away.

### `OnAttacked(inst, data)`
*   **Description:** Event handler that triggers when the tentacle is hit. It can force a target switch to the attacker if the current target was not attacked recently, enforcing aggressive threat-based targeting.
*   **Parameters:**  
    * `inst` (`entity`) — the tentacle instance.  
    * `data` (table) — contains `attacker` (entity), `damage`, and other attack metadata.  
*   **Returns:** Nothing.
*   **Error states:** Returns early without action if `data.attacker` is `nil`, or if no current target is set, or if the current target attacked recently (within `TUNING.TENTACLE_ATTACK_AGGRO_TIMEOUT` seconds).

## Events & listeners
- **Listens to:** `attacked` — fires `OnAttacked` handler to potentially switch targets when damaged.
- **Pushes:** None identified.
---
id: eyeofterror_mini
title: Eyeofterror Mini
description: Defines the mini variant of the Eye of Terror enemy, implementing combat, movement, and AI behavior for a flying hostile creature.
tags: [combat, flying, hostile, ai, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 735f2136
system_scope: entity
---

# Eyeofterror Mini

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `eyeofterror_mini` prefab defines the behavior and properties of the mini Eye of Terror creature, a flying, hostile enemy. It integrates multiple components to handle health, combat, locomotion, diet, and behavior. The prefab sets up an entity with a custom brain (`eyeofterror_minibrain`), state graph (`SGeyeofterror_mini`), and specialized AI logic for target acquisition, attack tracking, and aggression response. It is typically used as a minion or preliminary threat in larger Eye of Terror encounters.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst:AddTag("eyeofterror")
inst:AddTag("flying")
inst:AddTag("hostile")
inst:AddComponent("health")
inst.components.health:SetMaxHealth(TUNING.EYEOFTERROR_MINI_HEALTH)
inst:AddComponent("combat")
inst.components.combat:SetDefaultDamage(TUNING.EYEOFTERROR_MINI_DAMAGE)
inst.components.combat:SetRange(TUNING.EYEOFTERROR_MINI_ATTACK_RANGE, TUNING.EYEOFTERROR_MINI_HIT_RANGE)
inst:SetBrain(require("brains/eyeofterror_minibrain"))
```

## Dependencies & tags
**Components used:**  
`locomotor`, `health`, `combat`, `sleeper`, `knownlocations`, `inspectable`, `eater`, `hauntable`, `lootdropper`, `animstate`, `soundemitter`, `dynamicshadow`, `transform`, `network`

**Tags added:**  
`eyeofterror`, `flying`, `hostile`, `ignorewalkableplatformdrowning`, `monster`, `smallcreature`, `HORRIBLE_eater`, `strongstomach`, `notaunt`, `panicable`

**Tags checked:**  
`_combat`, `_health`, `DECOR`, `eyeofterror`, `FX`, `INLIMBO`, `NOCLICK`, `notarget`, `playerghost`, `wall`

**Tags removed:**  
`notaunt` (when focus target is invalid)

## Properties
No public properties.

## Main functions
### `FocusTarget(inst, target)`
*   **Description:** Assigns a specific target as the entity’s focus, adds the `notaunt` tag (indicating it should not be automatically retargeted), and instructs the combat component to engage the target.
*   **Parameters:**  
    `target` (entity or `nil`) – the entity to set as the current target.
*   **Returns:** Nothing.

### `CheckFocusTarget(inst)`
*   **Description:** Validates the currently assigned focus target (`inst._focustarget`). If the target is invalid (e.g., dead, ghost, non-existent), it resets `inst._focustarget` to `nil` and removes the `notaunt` tag.
*   **Parameters:** None.
*   **Returns:** `(entity or nil)` – the valid focus target, or `nil` if none.
*   **Error states:** Returns `nil` if the focus target has died, become a ghost, or been removed.

### `Retarget(inst)`
*   **Description:** Determines the next valid target. If a valid focus target exists, returns it; otherwise, searches for a new target within a 12-tile radius using `FindEntity`.
*   **Parameters:** None.
*   **Returns:** `(entity or nil, boolean)` – the chosen target and whether it differs from the current target.
*   **Error states:** May return `nil` if no suitable target is found.

### `KeepTarget(inst, target)`
*   **Description:** Determines whether the combat component should retain the current target. Maintains focus target priority; otherwise, checks if the target remains within a 30-tile radius and is valid.
*   **Parameters:**  
    `target` (entity) – the target to evaluate for retention.
*   **Returns:** `boolean` – `true` if the target should be kept, `false` otherwise.

### `OnAttacked(inst, data)`
*   **Description:** Reacts when the entity is attacked. If there is no current focus target and the attacker is not another Eye of Terror, sets the attacker as the new target.
*   **Parameters:**  
    `data` (table) – event data containing `attacker` (the entity that attacked).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` – triggers `OnAttacked` to respond to incoming damage and potentially switch targets.
- **Pushes:** None identified.
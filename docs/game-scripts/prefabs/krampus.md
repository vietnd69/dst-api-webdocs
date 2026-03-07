---
id: krampus
title: Krampus
description: A hostile boss entity with combat, inventory, and sleep cycle behaviors, featuring loot dropping and dynamic animation states based on its sack status.
tags: [combat, ai, boss, loot, sleep]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0350dbfc
system_scope: entity
---

# Krampus

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`krampus` is a boss-level hostile entity prefab with combat capabilities, sleep cycle support (`sleeper` component with `watchlight` enabled), loot dropping, and inventory handling. It features a dynamic animation system that toggles between "ARM" and "SACK" states, likely representing whether the sack is full or empty. The prefab integrates with its custom brain (`brains/krampusbrain.lua`) for AI behavior and supports targeting and aggro sharing (commented out in code). It is part of the game's world entity system and uses physics, network sync, and dynamic shadow rendering.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddDynamicShadow()
inst.entity:AddNetwork()

MakeCharacterPhysics(inst, 10, 0.5)
inst.Transform:SetFourFaced()

inst:AddTag("scarytoprey")
inst:AddTag("monster")
inst:AddTag("hostile")
inst:AddTag("deergemresistance")

inst:AddComponent("health")
inst.components.health:SetMaxHealth(TUNING.KRAMPUS_HEALTH)

inst:AddComponent("combat")
inst.components.combat:SetDefaultDamage(TUNING.KRAMPUS_DAMAGE)
inst.components.combat:SetAttackPeriod(TUNING.KRAMPUS_ATTACK_PERIOD)

inst:AddComponent("sleeper")
inst.components.sleeper.watchlight = true

inst:AddComponent("lootdropper")
inst.components.lootdropper:SetChanceLootTable('krampus')

inst:ListenForEvent("attacked", function(inst, data) inst.components.combat:SetTarget(data.attacker) end)
```

## Dependencies & tags
**Components used:** `inventory`, `locomotor`, `sleeper`, `health`, `combat`, `lootdropper`, `inspectable`  
**Tags added:** `scarytoprey`, `monster`, `hostile`, `deergemresistance`

## Properties
No public properties are defined in the constructor or exposed beyond component-specific properties (e.g., `inst.components.locomotor.runspeed`).

## Main functions
Not applicable. This is a prefab constructor (`fn`) that returns a fully configured entity instance; no standalone functions beyond internal helpers are defined.

## Events & listeners
- **Listens to:** `attacked` - triggers combat target assignment to the attacker via `OnAttacked`.
- **Pushes:** None directly (relies on components to push events).
---
id: spear_lance
title: Spear Lance
description: A combat weapon prefab that enables area-of-effect leap attacks with reticule-guided targeting and recharge functionality.
tags: [combat, weapon, leap, aoetargeting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: baa63d86
system_scope: combat
---

# Spear Lance

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
` spear_lance` is a weapon prefab that implements leap-based area-of-effect (AOE) attacks via the `aoetargeting` component. It features dynamic reticule placement for guiding the leap target location, with validation logic that checks for passable terrain and unblocked ground. The prefab integrates with DST’s ECS by adding core physics, animation, and network state components, and relies on pre-tagged systems (`sharp`, `pointy`, `superjump`, `weapon`, `aoeweapon_leap`, `rechargeable`) for gameplay integration.

## Usage example
The spear lance is typically instantiated as a weapon by the game engine and used via player inventory. Its AOE reticule targeting is automatically activated during leap attacks. Example setup (for custom prefabs):
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddNetwork()
MakeInventoryPhysics(inst)
inst:AddTag("weapon")
inst:AddTag("aoeweapon_leap")
inst:AddTag("rechargeable")
inst:AddTag("sharp")
inst:AddTag("pointy")
inst:AddTag("superjump")
inst:AddComponent("aoetargeting")
inst.components.aoetargeting:SetRange(16)
inst.components.aoetargeting:SetAllowRiding(false)
-- Assign custom reticule and targetfn as needed
```

## Dependencies & tags
**Components used:** `aoetargeting`
**Tags:** Adds `sharp`, `pointy`, `superjump`, `weapon`, `aoeweapon_leap`, `rechargeable`.

## Properties
No public properties are initialized directly in the constructor. Configuration is performed via the `aoetargeting` component’s methods and its `reticule` sub-object.

## Main functions
Not applicable.

## Events & listeners
Not applicable.
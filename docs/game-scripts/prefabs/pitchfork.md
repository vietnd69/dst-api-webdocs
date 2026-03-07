---
id: pitchfork
title: Pitchfork
description: A throwable tool prefab that enables terrain modification and combat, with limited durability and skin support.
tags: [combat, terrain, tool, inventory]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9fe191e1
system_scope: inventory
---

# Pitchfork

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `pitchfork` prefab is a multi-functional tool used for terraforming terrain and engaging in combat. It is implemented via two variant prefabs: `pitchfork` (standard) and `goldenpitchfork` (golden), with the latter offering enhanced durability and performance. The prefab integrates with several core components—including `weapon`, `finiteuses`, `equippable`, and `terraformer`—to manage wear, usage, and equipping behavior. It supports visual skin overrides and floatation via the `floater` component.

## Usage example
```lua
local inst = SpawnPrefab("pitchfork")
inst.components.finiteuses:SetUses(100)
inst.components.weapon:SetDamage(20)
inst.components.equippable:SetOnEquip(my_custom_equip_fn)
```

## Dependencies & tags
**Components used:** `finiteuses`, `weapon`, `equippable`, `floater`, `inspectable`, `inventoryitem`, `terraformer`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `"sharp"` and `"weapon"` to the instance; `"usesdepleted"` may be added via `finiteuses`.

## Properties
No public properties are initialized directly in the constructor.

## Main functions
No public methods beyond component APIs are exposed by this prefab script.

## Events & listeners
- **Listens to:** None directly.
- **Pushes:**
  - `equipskinneditem` (via `owner:PushEvent`) — fired during equip when a skin build is present, passing `inst:GetSkinName()` as payload.
- **Component event responses:**
  - When `finiteuses` reaches zero (`onfinished` callback): calls `inst.Remove` (destroys the instance).
---
id: foodbuffs
title: Foodbuffs
description: Factory for creating temporary food-based buff prefabs that apply one-time or extended status effects to target entities.
tags: [buff, food, entity, combat, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 82246b9d
system_scope: entity
---

# Foodbuffs

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`Foodbuffs` is a factory module that generates prefabs representing temporary status buffs applied via consumables (e.g., food). Each buff is implemented as a non-persistent, invisible entity with a `debuff` component and a `timer`. The module defines attach/detach/extend logic for common buff types—such as increased attack, work effectiveness, moisture immunity, and electric attack—and returns seven specific buff prefabs (`MakeBuff` calls). These buffs are designed to be attached to other entities and automatically removed after a timeout or upon the consumer’s death.

## Usage example
```lua
-- Create an attack buff instance with default tuning
local attackBuff = MakeBuff("attack", attack_attach, nil, attack_detach, TUNING.BUFF_ATTACK_DURATION, 1)

-- Attach the buff to a player entity (common pattern in food consumption logic)
local player = TheWorld.Map:GetSpawnPoint()
local buff = GetNetwork():SpawnPrefab("buff_attack")
if buff ~= nil and buff.components.debuff ~= nil then
    buff.components.debuff:Attach(player)
end
```

## Dependencies & tags
**Components used:** `debuff`, `timer`, `combat`, `health`, `workmultiplier`, `moistureimmunity`, `electricattacks`, `grogginess`, `weapon`, `projectile`, `complexprojectile`  
**Tags:** Adds `CLASSIFIED` to each buff entity. Buff prefabs do not use gameplay tags themselves.

## Properties
No public properties—`Foodbuffs` exports only factory functions (`MakeBuff`) and internal attach/detach hooks. Buff entities created by this module do not expose direct state mutators.

## Main functions
### `MakeBuff(name, onattachedfn, onextendedfn, ondetachedfn, duration, priority, prefabs, nospeech)`
*   **Description:** Factory function that returns a `Prefab` definition for a new buff type. It creates a non-persistent entity with `debuff` and `timer` components, configures lifecycle callbacks, and handles network safety (skipping client-side instantiation).  
*   **Parameters:**  
    - `name` (string) – Identifier used to name the prefab (`buff_<name>`).  
    - `onattachedfn` (function or `nil`) – Callback executed when the buff is attached to a target.  
    - `onextendedfn` (function or `nil`) – Callback executed when the buff duration is extended.  
    - `ondetachedfn` (function or `nil`) – Callback executed when the buff is detached.  
    - `duration` (number) – Duration in seconds before the buff expires.  
    - `priority` (number) – Used in buff stacking announcements (higher priority replaces lower priority buffs of same type).  
    - `prefabs` (table or `nil`) – Optional list of FX prefabs to load on the client for this buff (used for remote visuals).  
    - `nospeech` (boolean) – If `true`, suppresses in-game speech announcements on attach/detach.  
*   **Returns:** `Prefab` – A prefab definition for the buff entity.  
*   **Error states:** No direct errors; however, attach/detach callbacks may silently skip operations if target lacks required components (e.g., `target.components.health`).

## Events & listeners
- **Listens to:** `death` (on target) – stops the buff if the target dies. `timerdone` – stops the buff when the internal timer expires. `onattackother` (on buff entity) – triggers electric FX only for non-projectile or non-inherently electric attacks.  
- **Pushes:** `foodbuffattached` – fired on the target when a buff is attached or extended. `foodbuffdetached` – fired on the target when the buff ends.
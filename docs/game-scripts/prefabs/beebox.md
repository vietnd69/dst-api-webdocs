---
id: beebox
title: Beebox
description: Defines the Beebox structure entity which produces honey and spawns bees based on season and light conditions.
tags: [structure, resource, crafting, animals]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: a56bddd4
system_scope: entity
---

# Beebox

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`Beebox` defines the prefab for the Bee Box structure, a craftable entity that generates honey over time and spawns bees. It integrates the `harvestable` component to manage honey production and the `childspawner` component to manage bee population. The entity reacts to environmental states such as season, daylight, and cave light levels, pausing production during winter or darkness. It also supports fire mechanics via `burnable` and can be destroyed via `workable` (hammering).

## Usage example
```lua
-- Spawn a beebox entity at the player's position
local pos = ThePlayer:GetPosition()
local beebox = SpawnPrefab("beebox")
beebox.Transform:SetPosition(pos.x, pos.y, pos.z)

-- Access components to modify behavior (server only)
if TheWorld.ismastersim then
    beebox.components.childspawner:SetMaxChildren(10)
end
```

## Dependencies & tags
**Components used:** `harvestable`, `childspawner`, `burnable`, `workable`, `lootdropper`, `inspectable`, `soundemitter`, `minimapentity`, `lightwatcher`.
**Tags:** Adds `structure`, `playerowned`, `beebox`. Hermit variant adds `antlion_sinkhole_blocker`.

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
- **Listens to:** `childgoinghome` - Triggers honey growth when a bee returns with pollen.
- **Listens to:** `onbuilt` - Plays placement animation and sound.
- **Listens to:** `enterlight` - Resumes production if in cave daylight.
- **Listens to:** `enterdark` - Pauses production when light is lost.
- **Listens to:** `onignite` - Releases bees and stops spawning when ignited.
- **Watches:** `season` - Adjusts spawn rates and max children for Spring.
- **Watches:** `iswinter` - Halts honey growth during winter.
- **Watches:** `iscaveday` - Toggles production based on cave day cycle.
- **Pushes:** `ms_register_beebox_hermit` - Registers hermit variant with the world (Hermit only).
- **Pushes:** `ms_register_pearl_entity` - Registers entity for Pearl interactions (Hermit only).
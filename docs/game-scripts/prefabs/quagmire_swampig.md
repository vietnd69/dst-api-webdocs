---
id: quagmire_swampig
title: Quagmire Swampig
description: Defines the base prefab entity for the Quagmire Swamp pig character, including its visual, physical, and networked properties.
tags: [character, npc, quagmire, pig]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 381fa0ee
system_scope: entity
---

# Quagmire Swampig

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_swampig` prefab defines a non-player character (NPC) used in the Quagmire game mode. It is a specialized variant of the pigman that includes animation, sound, physics, and talker components for dialogue. It is instantiated as a character entity and marked with tags indicating its role (`character`, `pig`, `scarytoprey`). The prefab delegates master-server initialization to an external `master_postinit` function via an event hook.

## Usage example
```lua
local inst = Prefab("quagmire_swampig")
-- In a mod's modmain.lua, typically registered via:
-- AddPrefabPostInit("quagmire_swampig", function(inst) ... end)
```

## Dependencies & tags
**Components used:**  
- `transform` (via `inst.entity:AddTransform()`)  
- `animstate` (via `inst.entity:AddAnimState()`)  
- `soundemitter` (via `inst.entity:AddSoundEmitter()`)  
- `dynamicshadow` (via `inst.entity:AddDynamicShadow()`)  
- `network` (via `inst.entity:AddNetwork()`)  
- `talker` (via `inst:AddComponent("talker")`)  
- `characterphysics` (via `MakeCharacterPhysics(inst, 50, .4)`)  

**Tags:**  
- `character`, `pig`, `scarytoprey`, `_named`

## Properties
No public properties are defined directly in this file. Component configuration (e.g., `inst.components.talker.fontsize`) is done in the constructor.

## Main functions
None defined in this file — this is a `Prefab` definition returning a function `fn()` that builds the entity. No custom methods beyond prefab initialization are exposed.

## Events & listeners
- **Listens to:** None defined in this file.  
- **Pushes:**  
  - `master_postinit` (via `event_server_data("quagmire", ...).master_postinit(inst)`) on the master simulation, triggering external post-initialization logic.

`<`/br>
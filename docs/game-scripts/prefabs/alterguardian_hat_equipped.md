---
id: alterguardian_hat_equipped
title: Alterguardian Hat Equipped
description: Renders and manages the visual representation of the Alterguardian's equipped hat, including flame and snow effects, with animation state and skinning support.
tags: [fx, decoration, visual, visual-effects]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0cbc49e3
system_scope: fx
---

# Alterguardian Hat Equipped

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`alterguardian_hat_equipped` is a lightweight FX prefab component responsible for visually representing the Alterguardian's equipped hat on a character or entity. It manages animation states (activation, idle, deactivation), dynamic lighting and bloom, skin swapping via `AnimState`, and dynamic flame and snow-related visual variations. The hat is attached as a follower to the owner’s hair slot and does not persist across sessions. It functions exclusively on the client when not the master simulation (i.e., in multiplayer, it is client-side only), while properties like `SetSkin` and `SetFlameLevel` are defined for master simulation to drive changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("transform")
inst:AddComponent("animstate")
inst:AddComponent("network")
-- Assume AnimState is configured with proper bank/build...

-- Assign prefabricated hat visual (client-side FX instance)
local hat = REQUIRE_PREFAB("alterguardian_hat_equipped")()
hat.OnActivated(hat, owner, true)
hat.SetSkin(hat, "custom_skin", owner.GUID)
hat.SetFlameLevel(hat, 2, "custom_skin", owner.GUID)
```

## Dependencies & tags
**Components used:** None accessed via `inst.components.X`; entity uses built-in `transform`, `animstate`, and `network` via `entity:Add*()` calls.  
**Tags:** Adds `FX` and `DECOR`.

## Properties
No public properties are initialized in the constructor or exposed directly on `inst`.

## Main functions
### `OnActivated(inst, owner, is_front)`
*   **Description:** Attaches the hat to the owner entity as a follower and plays the activation animation sequence (pre-loop). Intended for client-side visual sync during hat equip.
*   **Parameters:**  
    `inst` (entity) – the hat instance itself.  
    `owner` (entity) – the character/entity the hat is being equipped to.  
    `is_front` (boolean) – determines which side mesh to hide and animation offset direction.
*   **Returns:** Nothing.

### `OnDeactivated(inst)`
*   **Description:** Plays the deactivation post-animation and schedules the entity for removal once the animation completes.
*   **Parameters:**  
    `inst` (entity) – the hat instance.
*   **Returns:** Nothing.

### `SetSkin(inst, skin_build, GUID)`
*   **Description:** Overrides skin symbols for the piece and glow, allowing dynamic visual customization via the supplied skin.
*   **Parameters:**  
    `inst` (entity) – the hat instance.  
    `skin_build` (string or nil) – the skin build name; if `nil`, defaults to the base build.  
    `GUID` (string) – the owner entity’s GUID used to resolve skin context.
*   **Returns:** Nothing.

### `SetFlameLevel(inst, level, skin_build, parent_GUID)`
*   **Description:** Updates the flame visual to match the specified intensity level (`0`, `1`, or `2+`). Clears flame visuals when `level` is `0` or `nil`.
*   **Parameters:**  
    `inst` (entity) – the hat instance.  
    `level` (number or nil) – flame intensity: `0` (off), `1` (small), `2+` (large).  
    `skin_build` (string or nil) – optional skin build for skin-specific flame variants.  
    `parent_GUID` (string) – owner entity’s GUID.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` (inside `OnDeactivated`) – triggers removal of the entity once deactivation animation completes.
- **Pushes:** None identified.

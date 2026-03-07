---
id: lightcrab
title: Lightcrab
description: A small, glowing amphibious creature that emits light and drops loot upon death.
tags: [animal, light, loot, prey]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5d078f20
system_scope: entity
---

# Lightcrab

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lightcrab` prefab defines an animated, glowing creature entity in the game world. It combines multiple components to implement biological behaviors (e.g., locomotion, eating), item-like properties (e.g., pickup, sinking), cooking mechanics, combat interactions, and dynamic lighting. It also integrates with DST's state graph system for AI behavior and includes compatibility with cat interactions, traps, and perishable food logic.

The entity is built using a functional `Prefab` constructor and includes client-side assets (animation, sound, light) and server-side logic (physics, components, AI brain). It is pristinely initialized and conditionally loaded on the master simulation instance only.

## Usage example
```lua
local lightcrab = SpawnPrefab("lightcrab")
if lightcrab then
    lightcrab.Transform:SetPosition(x, y, z)
    -- The entity will automatically animate, emit light, and behave according to its brain and components
end
```

## Dependencies & tags
**Components used:**  
- `locomotor`, `eater`, `inventoryitem`, `cookable`, `health`, `lootdropper`, `combat`, `inspectable`, `sleeper`  
- `transform`, `animstate`, `soundemitter`, `light`, `dynamicshadow`, `network` (core entity services)

**Tags added:**  
`animal`, `prey`, `smallcreature`, `canbetrapped`, `cattoy`, `catfood`, `stunnedbybomb`, `lightbattery`, `cookable`

## Properties
No public properties are directly exposed beyond component-level configuration.

## Main functions
### `fn()`
*   **Description:** Constructor function that instantiates and configures the `lightcrab` entity. It initializes visual/audio assets, transforms, physics, animations, lighting, tags, and all required components. It is called once during `Prefab` creation and returns the fully configured entity.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — The fully initialized entity instance.
*   **Error states:** Returns early without server-side component setup if `TheWorld.ismastersim` is `false` (i.e., client-only context).

### `OnDropped(inst)`
*   **Description:** Callback invoked when the entity is dropped by a player or other actor. Causes the entity to enter the `"stunned"` state.
*   **Parameters:** `inst` (entity) — The lightcrab instance being dropped.
*   **Returns:** Nothing.

### `OnCookedFn(inst)`
*   **Description:** Callback invoked when the entity is cooked. Plays a death sound effect using the entity's sound emitter.
*   **Parameters:** `inst` (entity) — The cooked lightcrab instance.
*   **Returns:** Nothing.

### `ShouldWake(inst)`
*   **Description:** Wake test function for the `sleeper` component. Returns `true`, indicating the lightcrab will always wake when conditions change (e.g., player proximity or damage).
*   **Parameters:** `inst` (entity) — The entity being tested for waking (unused in this implementation).
*   **Returns:** `true`.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls observed).
- **Pushes:** None (no `inst:PushEvent` calls observed).
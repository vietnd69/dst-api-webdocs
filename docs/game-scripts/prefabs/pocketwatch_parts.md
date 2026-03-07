---
id: pocketwatch_parts
title: Pocketwatch Parts
description: A small collectible item that emits ticking sounds and animations, used as bait and interactable loot.
tags: [audio, inventory, bait]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 76b75abe
system_scope: inventory
---

# Pocketwatch Parts

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pocketwatch_parts` is a prefabricated item entity that behaves like a small, tickable collectible. It displays idle animations and emits looping and one-shot sound effects when placed on the ground or held in inventory. The entity is not a standalone component but a full prefab definition, meaning it is a complete entity template—typically added to the world via crafting or world generation. It integrates with core systems like `inventoryitem`, `stackable`, `bait`, and `inspectable` when present in the world.

## Usage example
While this is a prefab (not a component), modders can reference it in their own prefabs like so:
```lua
local THEPREFAB = Prefab("myprefab", fn)

-- Example of spawning pocketwatch_parts programmatically
TheWorld:PushEvent("ms_giveitem", { item = "pocketwatch_parts" })
```
Alternatively, it can be referenced in prefabs that use it as loot or bait:
```lua
-- In a loot table or custom function
local part = SpawnPrefab("pocketwatch_parts")
part.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `inspectable`, `bait`, `hauntablelaunch`  
**Tags:** Adds `molebait`, `cattoy`

## Properties
No public properties are exposed or documented in this prefab. All internal state (e.g., `beattask`) is managed privately.

## Main functions
This file does not define a component class and thus has no public methods. The `fn()` function is the prefab constructor and is not intended for direct use by modders.

## Events & listeners
- **Listens to:** `ms_entitywake` — via `inst.OnEntityWake = OnEntityWake`, which triggers sound and animation resumption when the entity wakes.  
- **Pushes:** None directly. Event callbacks (`ondropped`, `onpickup`, `OnEntityWake`, `OnEntitySleep`) manage state internally.


---
id: boneshard
title: Boneshard
description: Represents a collectible bone shard item used as crafting material and snowman decoration in the game.
tags: [inventory, crafting, decoration]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bb52b74e
system_scope: inventory
---

# Boneshard

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `boneshard` prefab defines a small, stackable item that serves as both a crafting material and decorative element for Snowmen. It is a simple item entity with basic inventory, stackable, and snowman decoration functionality. The component is self-contained and does not require external function dependencies beyond standard engine components.

## Usage example
```lua
local inst = SpawnPrefab("boneshard")
inst.Transform:SetPosition(x, y, z)
inst.components.stackable:SetSize(5)
inst.components.snowmandecor:SetDecorationType("bone")
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `snowmandecor`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `fn()`
*   **Description:** Prefab constructor function that initializes the entity and adds necessary components for network, animation, physics, and gameplay behavior.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the fully constructed entity.
*   **Error states:** On non-master simulation clients (e.g., vanilla clients or server-only logic), returns the entity early before adding gameplay components.

## Events & listeners
None identified.
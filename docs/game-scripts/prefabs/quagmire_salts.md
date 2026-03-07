---
id: quagmire_salts
title: Quagmire Salts
description: Defines two prefabs — a placed rock variant and a ground variant — for Quagmire salts, providing static world objects with appropriate animations and network synchronization.
tags: [environment, world, static]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a460ca6b
system_scope: environment
---

# Quagmire Salts

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines two prefabs (`quagmire_saltrock` and `quagmire_salt`) representing decorative, non-interactive environmental assets found in the Quagmire biome. They are static, visually distinct ground objects with idle animations, optimized for placement in the world. The prefabs include network synchronization via `AddNetwork()` and use master-only post-initialization hooks for mod-specific customization.

## Usage example
```lua
-- Example of spawning a Quagmire salt rock at a specific location
local saltrock = SpawnPrefab("quagmire_saltrock")
if saltrock ~= nil then
    saltrock.Transform:SetPosition(x, y, z)
end

-- Example of spawning a Quagmire salt (ground version)
local salt = SpawnPrefab("quagmire_salt")
if salt ~= nil then
    salt.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `None identified.`  
**Tags:** Neither prefab adds tags during initialization.

## Properties
No public properties.

## Main functions
The prefabs themselves are factory functions and are not invoked directly as methods. The following internal functions are defined and called during prefab instantiation:

### `rock_fn()`
*   **Description:** Constructor for the `quagmire_saltrock` prefab. Initializes a basic entity with transform, animation state, and network components; sets up physics for inventory items (though it's static); and plays the idle animation. For non-master simulation contexts (e.g., clients), returns early; otherwise, invokes the server-side `master_postinit_rock` hook.
*   **Parameters:** None (called internally by the engine during prefab creation).
*   **Returns:** `inst` (Entity) — the fully constructed entity instance.

### `ground_fn()`
*   **Description:** Constructor for the `quagmire_salt` prefab. Behaves identically to `rock_fn()` but uses the `quagmire_salt` animation bank/build and invokes `master_postinit_ground` on the server.
*   **Parameters:** None (called internally by the engine during prefab creation).
*   **Returns:** `inst` (Entity) — the fully constructed entity instance.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** None identified.  

(Both prefabs are static and do not participate in event-driven behavior beyond standard network sync and post-init hooks.)
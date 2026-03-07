---
id: lavaarena_elemental
title: Lavaarena Elemental
description: Creates and configures the lava arena elemental entity, a flying companion with specific physics, collision, and network behavior for lava arena scenarios.
tags: [entity, flying, companion, combat]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 296a5f5a
system_scope: entity
---

# Lavaarena Elemental

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines the `lavaarena_elemental` prefab, a flying elemental entity used in lava arena scenarios. It sets up the core visual, physical, and network attributes of the entity, including transform, animation, physics, sound, shadow, and collision systems. The component is not a reusable ECS component but rather a prefab factory — it instantiates and initializes a complete entity instance with predefined properties. Server-side logic is delegated to `event_server_data("lavaarena", "prefabs/lavaarena_elemental").master_postinit(inst)` after the basic entity structure is established.

## Usage example
This prefab is instantiated by the game engine during level generation or event setup in lava arena scenarios. Modders typically do not instantiate it directly but can reference it as a dependency or override its post-init logic in server scripts:
```lua
-- In a server-side mod or scenario script
local elemental = SpawnPrefab("lavaarena_elemental")
if elemental ~= nil then
    elemental.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** None (uses only built-in entity subsystems: `Transform`, `AnimState`, `SoundEmitter`, `DynamicShadow`, `Physics`, `Network`).  
**Tags:** `character`, `scarytoprey`, `elemental`, `companion`, `flying`, `ignorewalkableplatformdrowning`, `notraptrigger`, `NOCLICK`.

## Properties
No public properties. This file defines only a prefab factory function; no persistent data or state variables are exposed.

## Main functions
No top-level functions are defined in this file beyond the `fn()` factory function. All initialization logic resides inside `fn()`, which is passed to `Prefab()`.

### `fn()`
* **Description:** Creates and initializes the lava arena elemental entity. Sets up visual, physical, and network components; configures collision and tag attributes; and delegates server-specific post-initialization to an external handler.
* **Parameters:** None.
* **Returns:** `inst` (Entity) — the fully initialized entity instance.
* **Error states:** On the client (non-master simulation), returns early after setting up the basic entity without calling `master_postinit`.

## Events & listeners
None. This file does not define any event listeners or event pushes. Event handling is deferred to the external `master_postinit` callback.

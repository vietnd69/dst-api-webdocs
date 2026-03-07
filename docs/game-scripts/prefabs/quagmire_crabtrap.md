---
id: quagmire_crabtrap
title: Quagmire Crabtrap
description: A reusable trap prefab used in the Quagmire that detects and interacts with passing entities.
tags: [trap, quagmire, interactive, entity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 91f7c879
system_scope: entity
---

# Quagmire Crabtrap

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_crabtrap` is a static, interactive trap prefab designed for use in the Quagmire region. It functions as a passive entity that spawns with a predefined animation and icon, and delegates its server-side initialization logic to an external script (`scripts/prefabs/wortox_soul_common.lua`) via the `event_server_data` API. It is tagged as `trap`, indicating it belongs to the broader trap mechanic family in DST. The entity is non-physical in terms of inventory movement (due to `MakeInventoryPhysics`), but is optimized for client-server synchronization and rendering.

## Usage example
```lua
local trap = SpawnPrefab("quagmire_crabtrap")
if trap ~= nil then
    trap.Transform:SetPosition(x, y, z)
    -- Additional setup would typically be handled by master_postinit in wortox_soul_common.lua
end
```

## Dependencies & tags
**Components used:** None identified — the prefab does not directly instantiate or interact with any components via `inst.components.X` in its own constructor.
**Tags:** Adds `trap` via `inst:AddTag("trap")`.

## Properties
No public properties.

## Main functions
No publicly exposed functions — this file only defines the prefab factory function and asset list.

## Events & listeners
**Listens to:** None identified in the constructor.
**Pushes:** None identified — event interaction is deferred to `master_postinit` in ` Wortox_soul_common.lua`, but no events are triggered directly within this file.

> **Note:** The `event_server_data("quagmire", ...)` call suggests that server-side behavior (e.g., trap activation logic, event handling, or network callbacks) is defined externally and executed during `master_postinit`. This file itself is focused solely on client-side setup and initial entity construction.
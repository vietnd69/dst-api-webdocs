---
id: vault_vault
title: Vault Vault
description: Defines the static map layout for the Vault structure, including background tiles and object markers for key locations.
tags: [map, layout, vault]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 75a41302
system_scope: environment
---

# Vault Vault

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines the static layout for the Vault map room using Tiled map format. It specifies a 13×13 grid with tile layer data for background visuals and an object group containing named marker points used during world generation to position Vault-related entities or features. It is not an ECS component but a data definition for level layout.

## Usage example
This file is loaded by the world generation system and does not require manual instantiation. During worldgen, the generator reads this layout and uses the object markers (e.g., `vaultmarker_vault_center`) to anchorVault-specific entities.

```lua
-- Internal usage by the world generation system:
-- The following pseudo-code illustrates how the layout might be consumed:
-- local layout = require("map/static_layouts/vault_vault")
-- for _, obj in ipairs(layout.layers[2].objects) do
--     if obj.type == "vaultmarker_vault_center" then
--         local world_x, world_y = PixelToWorld(obj.x, obj.y)
--         -- Spawn vault center entity at world_x, world_y
--     end
-- end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This file is a plain Lua table returning Tiled map data.

## Main functions
Not applicable.

## Events & listeners
Not applicable.
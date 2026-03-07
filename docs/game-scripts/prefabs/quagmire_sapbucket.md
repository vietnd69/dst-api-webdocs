---
id: quagmire_sapbucket
title: Quagmire Sapbucket
description: Aprefab entity representing an in-game sap bucket used in the Quagmire DLC, offering no standalone component logic.
tags: [world, props, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3ada5652
system_scope: world
---

# Quagmire Sapbucket

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_sapbucket` is a simple scene prop prefab defined in DST's Quagmire DLC. It has no custom component logic — its functionality is handled entirely through standard engine systems (`Transform`, `AnimState`, `Network`) and external server-side initialization via `event_server_data`. It appears as a static decorative object (a bucket) in the game world.

## Usage example
Typical usage occurs during world generation where this prefab is placed via room or task layouts. No direct component interaction is required:
```lua
-- Example placement in a room/task file (not part of this file's logic):
MakeNetPrefab("quagmire_sapbucket")
AddSimPostInit(function()
    TheWorld.Map:SetMapTile(100, 100, "quagmire_sapbucket")
end)
```

## Dependencies & tags
**Components used:** None identified. Relies on built-in entities: `Transform`, `AnimState`, `Network`, and inventory physics (`MakeInventoryPhysics`).
**Tags:** None added or checked by this file.

## Properties
No public properties defined in this file.

## Main functions
Not applicable — this is a prefab definition, not a component with executable functions.

## Events & listeners
Not applicable — no events are registered or pushed in this file. Server-side initialization uses `event_server_data("quagmire", ...).master_postinit`, but that is handled externally and not implemented here.
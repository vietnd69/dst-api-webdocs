---
id: charlie_heckler
title: Charlie Heckler
description: A non-interactive decorative prefab used to display a talking NPC with custom speech properties in the world.
tags: [decorative, npcs, dialogue]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ae0b59eb
system_scope: entity
---

# Charlie Heckler

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`charlie_heckler` is a non-interactive, decorative entity prefab used to display a talker NPC in the game world. It is typically used during special events (e.g., Year of the Clockwork Knight) to represent a background character who can receive and display dialogue. It relies on the `talker` component for speech appearance and `stageactor` (server-only) for state graph control. The entity does not persist in the world and is not interactable via mouse click.

## Usage example
```lua
local inst = SpawnPrefab("charlie_heckler")
if inst ~= nil then
    -- Move to world position
    inst.Transform:SetPos(0, 0, 0)
    -- Dialogue is controlled externally via the talker component's chatter properties
    inst.components.talker:SetSpeech("Hello there!", 1.0)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`, `follower`, `talker`, `stageactor`, `inspectable`, `named`  
**Tags:** `NOCLICK`, `NOBLOCK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persists` | boolean | `false` | Prevents the entity from being saved/loaded with the world. |

## Main functions
None.

## Events & listeners
- **Listens to:** `chatterdirty` (client-side only) – triggers UI update when talker chatter changes (via `MakeChatter`).
- **Pushes:** None directly.
---
id: slingshotmodscontainer
title: Slingshotmodscontainer
description: Manages the UI container for the slingshot mod interface, handling sound playback and container lifecycle.
tags: [ui, container, sound]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 081951d9
system_scope: ui
---

# Slingshotmodscontainer

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`slingshotmodscontainer` is a lightweight entity used exclusively for UI purposes to support the slingshot modding interface. It acts as a container for slingshot modifications and coordinates sound playback when items in the container change. It relies on the `container` component for inventory logic (on the master) and `updatelooper` to defer sound effects until after frame updates (on clients). It is not replicated to dedicated servers beyond basic network presence.

## Usage example
```lua
-- The prefab is instantiated automatically by the game when opening the slingshot UI.
-- It is not typically instantiated manually by mods.
-- Example of its core lifecycle:
local inst = GetPrefab("slingshotmodscontainer") -- internal use only
inst:AddComponent("container")
inst.components.container:WidgetSetup("slingshotmodscontainer")
inst.components.container.skipautoclose = true
```

## Dependencies & tags
**Components used:** `container`, `updatelooper`  
**Tags:** Adds `CLASSIFIED`  
**Networked:** Yes — uses `entity:AddNetwork()` and avoids client-side logic on dedicated servers.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `install_target` | entity or `nil` | `nil` | Reference to the slingshot entity currently being modified; set externally. |

## Main functions
This prefab does not define any public methods beyond those inherited from components (`container`, `updatelooper`). Its behavior is implemented via event callbacks.

## Events & listeners
- **Listens to:** `itemget`, `itemlose` — both trigger `OnItemChanged`, which queues a sound effect to play after the next frame update if the container is open and not busy.
- **Pushes:** None — does not fire custom events.
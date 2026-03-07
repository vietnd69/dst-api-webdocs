---
id: migration_portal
title: Migration Portal
description: Renders and animates the migration portal object, coordinating its visual state with the world migration system.
tags: [world, network, visual, animation]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bd83a78f
system_scope: world
---

# Migration Portal

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`migration_portal` is a prefabricated entity that visually represents the portal used for migrating between worlds in *Don't Starve Together*. It uses the `worldmigrator` component to determine its current state (e.g., open, closed, full) and updates its animation accordingly. The entity is only fully initialized on the master simulation, with clients receiving only basic network-synced transform, animstate, and sound data.

## Usage example
```lua
local inst = SpawnPrefab("migration_portal")
inst.Transform:SetPosition(x, y, z)
inst.components.worldmigrator:Enable()
inst:PushEvent("migration_available")  -- Opens the portal visually
```

## Dependencies & tags
**Components used:** `worldmigrator`, `inspectable`, `animstate`, `transform`, `soundemitter`, `minimapentity`, `network`  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `GetStatus(inst)`
* **Description:** Returns the current status string ("OPEN", "FULL", or `nil`) based on the `worldmigrator` component's state.
* **Parameters:** `inst` (entity) — the migration portal instance.
* **Returns:** `string` — either `"OPEN"` (if active), `"FULL"` (if full), or `nil` (if neither).
* **Error states:** Returns `nil` if `worldmigrator` is not enabled or in a neutral state.

## Events & listeners
- **Listens to:**
  - `migration_available` — triggers the "opening" animation and sets the portal to idle-open state.
  - `migration_unavailable` — triggers the "closing" animation and sets the portal to idle-closed state.
  - `migration_full` — triggers the "opening" animation with looping flag set, indicating the portal is at capacity.
  - `migration_activate` — plays the "activate" animation, followed by "opening" and idle animations.
- **Pushes:** None

## Asset references
| Asset type | Path | Purpose |
|------------|------|---------|
| `ANIM` | `anim/portal_friends.zip` | Animation bank and build for portal visuals |
| `SOUND` | `sound/common.fsb` | Sound effects for animation states |
| `MINIMAP_IMAGE` | `wormhole` | Icon used on the minimap for the portal entity |
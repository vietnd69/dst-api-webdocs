---
id: petrify_announce
title: Petrify Announce
description: Spawns a non-persistent FX entity that plays a petrification sound at the position of a target proxy, adjusted for distance from the focal point.
tags: [fx, sound, nonpersistent]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9cba6d4c
system_scope: fx
---

# Petrify Announce

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`petrify_announce` is a lightweight, non-persistent prefab used exclusively for playing a localized sound effect (`dontstarve/common/together/petrified/post_distant`) when a petrification event occurs. It positions the sound emitter relative to a proxy entity (e.g., a petrified player), adjusting playback position based on distance to `TheFocalPoint` to avoid extreme spatial attenuation. The prefab is client-side only on dedicated servers and self-cleans up after one second.

## Usage example
```lua
-- Typically invoked internally via CreatePrefabInstance or similar
-- Standard usage in modding is to replicate its behavior if custom petrification FX is needed:
local proxy = some_entity
local announce = CreateEntity()
announce.entity:AddTransform()
announce.entity:AddNetwork()
announce:AddTag("FX")
if not TheNet:IsDedicated() then
    announce:DoTaskInTime(0, function()
        -- replicate PlayPetrifySound logic here
    end)
end
announce.persists = false
announce:DoTaskInTime(1, announce.Remove)
```

## Dependencies & tags
**Components used:** `transform`, `soundemitter`, `network`
**Tags:** Adds `FX`

## Properties
No public properties

## Main functions
### `PlayPetrifySound(proxy)`
*   **Description:** Plays the petrification sound effect on a newly created local FX entity. Adjusts the entity's position relative to `TheFocalPoint` if within range, or projects it to the proxy’s position otherwise.
*   **Parameters:** `proxy` (entity GUID or proxy) — the original entity whose position is being referenced for sound origin.
*   **Returns:** Nothing.
*   **Error states:** Uses `TheFocalPoint` only if non-`nil`; falls back to proxy position if missing.

### `fn()`
*   **Description:** Constructor for the `petrify_announce` prefab. Sets up the entity as a non-persistent, non-dedicated FX with a one-second lifespan.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — the fully initialized, non-persistent FX entity.

## Events & listeners
None identified
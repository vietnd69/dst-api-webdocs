---
id: thurible_smoke
title: Thurible Smoke
description: Creates and manages a non-persistent particle effect (smoke and hand animation) for a Thurible item when active, including ambient looping sound playback.
tags: [fx, sound, nonpersistent]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 70f4b867
system_scope: fx
---

# Thurible Smoke

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`thurible_smoke` is a prefab definition for a non-persistent visual and audio effect entity used by the Thurible item in DST. It does not represent an active gameplay entity with logic or state persistence, but rather a temporary visual aid rendered in the world. The prefab sets up two particle emitters: one for swirling smoke and one for a hand-shaped flickering effect, both using custom colour and scale envelopes. It also manages a looping ambient sound that starts when the entity wakes and stops when it sleeps. The entity is deleted from the world when no longer needed and does not replicate to clients — it is only constructed and simulated on the server.

## Usage example
```lua
-- The thurible_smoke prefab is typically instantiated and attached to a Thurible item,
-- then destroyed after its effect ends. Example usage (in server-side logic):
local smoke = CreatePrefab("thurible_smoke")
smoke.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `transform`, `soundemitter`, `network`
**Tags:** Adds `FX`

## Properties
No public properties

## Main functions
This is a prefab function (not a component), so it has no method APIs. All behavior is defined in the `fn` constructor and helper functions called during initialization.

## Events & listeners
- **Listens to:** `entitywake` — triggers `OnEntityWake` to start the looping sound (`dontstarve/common/together/thurible_LP`)
- **Pushes:** None
---
id: wurt_tentacle_warning
title: Wurt Tentacle Warning
description: A non-persistent visual decoration entity used as a warning indicator for Wurt's tentacle attacks.
tags: [visual, decor, environment, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2bbb751f
system_scope: entity
---

# Wurt Tentacle Warning

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wurt_tentacle_warning` is a non-persistent visual effect prefab used to indicate the location of a pending tentacle attack by Wurt. It renders a static x-ray-style animation (`wurt_xray.zip`) playing an idle loop sequence in the background layer of the world. The entity has no gameplay logic, physics, or AI — it exists purely as a cosmetic warning marker.

## Usage example
```lua
local warning = SpawnPrefab("wurt_tentacle_warning")
if warning ~= nil then
    warning.Transform:SetPosition(x, y, z)
    -- Automatically cleaned up; no further setup required
end
```

## Dependencies & tags
**Components used:** None (uses only built-in engine components: `transform`, `animstate`)
**Tags:** Adds `DECOR`, `CLASSIFIED`, `NOCLICK`

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable
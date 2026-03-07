---
id: grassgekkoherd
title: Grassgekkoherd
description: Creates a non-networked herd entity that manages a group of grassgekko entities using the herd system.
tags: [herd, mob, spawn]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8d38660a
system_scope: entity
---

# Grassgekkoherd

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`grassgekkoherd` is a prefab factory function that creates a special non-networked entity serving as a herd container for `grassgekko` members. It sets up the `herd` component with configuration values (gather range, update range, and tag), and registers an `onempty` callback to remove the entity when no members remain. Periodic spawner functionality is present in the source code but currently commented out.

## Usage example
```lua
-- This prefab is not typically instantiated manually by mods; it's used internally.
-- It serves as a herd anchor for grassgekko mobs and is created via worldgen or event logic.
local herd = prefabs.grassgekkoherd()
```

## Dependencies & tags
**Components used:** `herd`
**Tags:** Adds `herd`, `NOBLOCK`, and `NOCLICK`.

## Properties
No public properties. The component is fully configured during construction.

## Main functions
No public functions are defined in this file. All logic resides in the constructor (`fn`) and configuration of the `herd` component via external calls.

## Events & listeners
- **Listens to:** None (directly).
- **Pushes:** None (directly).
Note: The `herd` component added to the entity handles internal events for member management and may fire events such as `herd_member_added` or `herd_empty`, but these are implemented in `herd.lua`, not here.
---
id: gestalt_head
title: Gestalt Head
description: Creates a non-networked, follower-based visual FX entity for the Gestalt and Gestalt Guard characters, playing different idle animations based on the provided anim bank.
tags: [fx, visual, follower]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6cb0a2f3
system_scope: fx
---

# Gestalt Head

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`gestalt_head` is a prefab factory that generates non-networked visual FX entities used by the Gestalt and Gestalt Guard characters. These entities serve as decorative head attachments, following their parent and playing an idle animation. They are not persisted, do not participate in network synchronization, and have no gameplay logic beyond visual presentation.

The factory supports two variants via the `bank` parameter:
- `"brightmare_gestalt_head"` — used for the standard Gestalt.
- `"brightmare_gestalt_head_evolved"` — used for the evolved Gestalt Guard.

## Usage example
```lua
-- Example: Spawn a standard Gestalt head entity
local head = Prefab("gestalt_head")()
head.components.follower:FollowEntity(some_parent_entity)

-- Example: Spawn an evolved Gestalt guard head entity
local guard_head = Prefab("gestalt_guard_head")()
guard_head.components.follower:FollowEntity(some_parent_entity)
```

## Dependencies & tags
**Components used:** None identified (uses only entity services: `Transform`, `AnimState`, `Follower`)
**Tags:** Adds `FX`

## Properties
No public properties.

## Main functions
This file defines only prefab factories, not component classes. It exports two Prefab constructors; no methods are exposed beyond engine-managed entity lifecycle.

## Events & listeners
None identified.
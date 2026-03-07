---
id: teamleader
title: Teamleader
description: Creates a non-networked entity that serves as a designated team leader in the game world.
tags: [team, ai, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e53f0fd2
system_scope: entity
---

# Teamleader

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `teamleader` prefab creates a simple, non-networked entity that is designated as a team leader. It is constructed by creating a base entity, attaching a transform for positioning, adding the `teamleader` component, and applying the `teamleader` tag. This prefab is likely used as a central anchor for AI grouping or group-based behaviors in the game world.

## Usage example
```lua
local teamleader = Prefab("teamleader", fn)
local inst = teamleader()
-- The entity now has the "teamleader" tag and component attached.
-- It can be referenced by other systems to coordinate group behavior.
```

## Dependencies & tags
**Components used:** `teamleader`, `transform`
**Tags:** Adds `teamleader`

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable
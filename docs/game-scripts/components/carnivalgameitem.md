---
id: carnivalgameitem
title: Carnivalgameitem
description: A placeholder component for items used in carnival minigames.
tags: [minigame, item]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1c79e696
system_scope: entity
---

# Carnivalgameitem

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CarnivalGameItem` is a minimal placeholder component intended for items participating in carnival-themed minigames. It currently does not implement any logic beyond storing the owning entity instance. This component likely serves as a marker or future extension point for minigame-specific behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("carnivalgameitem")
-- Placeholder component; no methods available yet.
-- Used in conjunction with minigame systems to identify eligible items.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
No documented public functions

## Events & listeners
Not applicable

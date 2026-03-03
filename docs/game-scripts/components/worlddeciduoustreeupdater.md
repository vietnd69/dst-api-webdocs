---
id: worlddeciduoustreeupdater
title: Worlddeciduoustreeupdater
description: A deprecated placeholder component with no functional behavior.
tags: [deprecated, placeholder]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: deprecated
category_type: components
source_hash: 752086f2
system_scope: world
---

# Worlddeciduoustreeupdater

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WorldDeciduousTreeUpdater` is a deprecated component with no active functionality. It exists only as a placeholder in case it is referenced by external mods. Its constructor initializes a no-op `update` function and stores the entity instance, but provides no further behavior, properties, or event handling.

## Usage example
```lua
-- This component should not be used in new code.
-- It is deprecated and has no functional effect.
local inst = CreateEntity()
inst:AddComponent("worlddeciduoustreeupdater")
-- The following line does nothing:
inst.components.worlddeciduoustreeupdater.update()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
Not applicable.

## Events & listeners
Not applicable.

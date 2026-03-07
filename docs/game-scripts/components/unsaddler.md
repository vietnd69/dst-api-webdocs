---
id: unsaddler
title: Unsaddler
description: A marker component with no functional logic, used solely to indicate that an entity has been processed by the unsaddler system.
tags: [marker]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 53edee08
system_scope: entity
---

# Unsaddler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Unsaddler` is a minimal marker component. It contains no logic, properties, or methods beyond its constructor and serves only to tag an entity as having been handled by the unsaddler workflow. It is typically added to entities (e.g., saddled creatures) to signal that a prior saddling operation should not be repeated or reversed.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("unsaddler")
-- No further interaction is required or possible with this component.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `unsaddled` (inferred from usage context; not present in this file).

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable

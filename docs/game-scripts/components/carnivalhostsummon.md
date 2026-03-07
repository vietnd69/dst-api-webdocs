---
id: carnivalhostsummon
title: Carnivalhostsummon
description: Manages the `carnivalhostsummon` tag on an entity, allowing the entity to be recognized as a carnival host summon.
tags: [tag, event, host]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: aa04b638
system_scope: entity
---

# Carnivalhostsummon

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CarnivalHostSummon` is a simple tag-management component that ensures the owning entity carries the `carnivalhostsummon` tag. It provides a public interface to add or remove this tag dynamically, which is used by the game to identify entities created by carnival host summons (e.g., in minigames or events).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("carnivalhostsummon")
-- Tag is added automatically in constructor
inst.components.carnivalhostsummon:SetCanSummon(false)
-- Tag is removed
inst.components.carnivalhostsummon:SetCanSummon(true)
-- Tag is added again
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes `carnivalhostsummon`

## Properties
No public properties

## Main functions
### `SetCanSummon(cansummon)`
*   **Description:** Sets whether the entity should be tagged as a carnival host summon by adding or removing the `carnivalhostsummon` tag.
*   **Parameters:** `cansummon` (boolean) – if `true`, adds the tag; if `false`, removes it.
*   **Returns:** Nothing.

## Events & listeners
None identified

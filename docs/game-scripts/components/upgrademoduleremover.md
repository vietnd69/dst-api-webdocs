---
id: upgrademoduleremover
title: Upgrademoduleremover
description: Marks entities that allow upgrade modules to be removed via specific actions.
tags: [inventory, crafting, upgrade]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: components
source_hash: 04e33b3e
system_scope: entity
---

# Upgrademoduleremover

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`Upgrademoduleremover` is a marker component indicating an entity supports the removal of upgrade modules. It relies on external action definitions rather than containing internal logic. This component is typically added to structures or items that can be modified or stripped of upgrades during gameplay.

## Usage example
```lua
local inst = CreateEntity()
-- Add the marker component to enable module removal interactions
inst:AddComponent("upgrademoduleremover")

-- Removal actions are handled via componentactions.lua
-- No direct methods are called on this component
```

## Dependencies & tags
**External dependencies:**
- `componentactions.lua` -- registers actions interacting with this component

**Components used:**
None identified.

**Tags:**
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions
None.

## Events & listeners
None.
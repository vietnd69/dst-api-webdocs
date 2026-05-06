---
id: prefabskins
title: Prefabskins
description: This file defines the PREFAB_SKINS configuration table mapping prefabs to skin IDs, along with exclusion lists and reverse lookup mappings.
tags: [config, data, skins, prefabs]
sidebar_position: 10

last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: root
source_hash: 76628d7c
system_scope: entity
---

# Prefabskins

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`prefabskins.lua` is a data configuration file that defines the global `PREFAB_SKINS` table mapping prefab names to arrays of available skin identifiers. It also defines the `PREFAB_SKINS_SHOULD_NOT_SELECT` exclusion table and generates the `PREFAB_SKINS_IDS` reverse lookup mapping from the main configuration. This file is required by systems that need to resolve skin identifiers to prefabs or validate skin availability without attaching to entities.

## Usage example
```lua
local PrefabSkins = require "prefabskins"
-- Access the main skin mapping table
local skins = PrefabSkins.PREFAB_SKINS
-- Check exclusion list for selection logic
local exclude = PrefabSkins.PREFAB_SKINS_SHOULD_NOT_SELECT
-- Lookup prefab name by skin ID
local prefab = PrefabSkins.PREFAB_SKINS_IDS["skin_id"]
```

## Dependencies & tags
**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions
None identified.

## Events & listeners
This file is not event-driven.

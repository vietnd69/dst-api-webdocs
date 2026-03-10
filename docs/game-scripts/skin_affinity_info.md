---
id: skin_affinity_info
title: Skin Affinity Info
description: Maps character prefabs to lists of associated skin asset names used for avatar rendering and item selection.
tags: [inventory, character, avatar, skin]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: adb92d5f
system_scope: inventory
---

# Skin Affinity Info

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`skin_affinity_info.lua` is a data-only module that defines character-to-skin mappings. Each character prefab (e.g., `wilson`, `wolfgang`) is associated with a list of skin identifiers (e.g., `"body_wilson_formal"`, `"feet_wilson_gladiator"`, `"wilson_formal"`) used by the game's UI, inventory, and rendering systems to group and validate compatible skins. This file is auto-generated and is not a runtime component—no components are instantiated or functional logic is executed. It serves as a reference for skin validation and account item tracking.

## Usage example
This file is not used directly by modders in typical modding workflows. It is consumed internally by account item export and skin-loading pipelines. As such, there is no direct API usage. The table is returned as a static map:

```lua
-- Internal use only; do not modify
local skin_map = require "skin_affinity_info"
-- Example: skin_map.wilson returns a list of skin strings for Wilson
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. This module is a pure data table.

## Main functions
Not applicable.

## Events & listeners
Not applicable.
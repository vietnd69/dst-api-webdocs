---
id: skin_assets
title: Skin Assets
description: Holds and manages asset paths and metadata for skin-related UI and entity rendering.
tags: [skin, asset, ui]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 9e0352bb
system_scope: ui
---

# Skin Assets

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `skin_assets` component is a static utility module responsible for managing skin asset paths and related metadata used by the UI and entity rendering systems in Don't Starve Together. It does not operate on an entity instance, nor does it implement ECS components — it is a pure data and accessor module that centralizes skin asset references.

## Usage example
```lua
local SkinAssets = require "skin_assets"

local icon_path = SkinAssets.GetIcon("winter_wx")
local texture_path = SkinAssets.GetTexture("wx_001")
local has_custom = SkinAssets.HasCustomSkin("wx_001")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | |

## Main functions
None identified

## Events & listeners
None identified
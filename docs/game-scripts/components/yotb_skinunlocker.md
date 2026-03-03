---
id: yotb_skinunlocker
title: Yotb Skinunlocker
description: Stores and provides access to a skin identifier for a YOTB (Year of the Beard) character entity.
tags: [skin, character, yotb]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 281c2e54
system_scope: entity
---

# Yotb Skinunlocker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Yotb_SkinUnlocker` is a lightweight component that manages the skin assignment for YOTB (Year of the Beard) character entities. It stores a skin identifier and provides simple getter/setter access to it. This component is typically attached to character prefabs to track unlocked or selected custom skins from the YOTB update.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("yotb_skinunlocker")
inst.components.yotb_skinunlocker:SetSkin("beefalo_beard")
local current_skin = inst.components.yotb_skinunlocker:GetSkin() -- returns "beefalo_beard"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `skin` | string or nil | `nil` | The skin identifier string assigned to the entity. |

## Main functions
### `SetSkin(skin)`
*   **Description:** Sets the skin identifier for the entity.
*   **Parameters:** `skin` (string or nil) — a string representing the skin name (e.g., `"beefalo_beard"`), or `nil` to clear the skin.
*   **Returns:** Nothing.

### `GetSkin()`
*   **Description:** Retrieves the currently assigned skin identifier.
*   **Parameters:** None.
*   **Returns:** string or nil — the stored skin identifier, or `nil` if none is set.

## Events & listeners
None identified

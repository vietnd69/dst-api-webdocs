---
id: brokentool
title: Brokentool
description: Spawns a one-time visual effect (anim-only entity) to indicate a broken tool interaction.
tags: [fx, visual, item]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 20b8257f
system_scope: fx
---

# Brokentool

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`brokentool` is a lightweight prefab used exclusively to display a short, non-persistent animation when a tool breaks. It creates a temporary FX entity that mirrors the position/orientation of a target entity (via proxy GUID) and plays a one-shot animation (`"used"`), then automatically removes itself upon animation completion. It plays no gameplay logic role beyond visual feedback.

## Usage example
This prefab is instantiated internally by the game engine (e.g., on tool break) and is not meant for direct manual instantiation by modders. The engine typically triggers it like:
```lua
TheWorld:PushEvent("ms_brokentool", { proxy = some_tool_entity })
```
The `PlayBrokenAnim` function in this file is called to create and manage the effect entity.

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX` tag to the spawned FX entity.

## Properties
No public properties. This prefab is a self-contained effect generator with no modifiable state.

## Main functions
### `PlayBrokenAnim(proxy)`
*   **Description:** Creates and configures a temporary FX entity that visually mimics the location of `proxy`, plays the broken-tool animation, and self-destructs after animation ends.
*   **Parameters:** `proxy` (entity) – the entity whose transform/orientation should be mirrored (typically the tool or wielder).
*   **Returns:** Nothing.
*   **Error states:** If `proxy` is `nil`, `Transform:SetFromProxy` may fail; however, the function does not validate this explicitly.

## Events & listeners
- **Listens to:** `animover` – fires when the animation completes; triggers `inst.Remove` to destroy the FX entity.
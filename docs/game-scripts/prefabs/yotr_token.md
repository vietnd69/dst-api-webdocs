---
id: yotr_token
title: Yotr Token
description: A small, stackable collectible item used as currency in the YotR event, featuring floatable physics and tradability.
tags: [event, currency, item, stackable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a80d461d
system_scope: inventory
---

# Yotr Token

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yotr_token` is a prefab representing a collectible currency item introduced during the YotR event. It functions as a standard inventory item with floatable physics when dropped, and supports stacking up to a small item stack size. It carries the tags `cattoy`, `renewable`, and `yotr_token` to enable event-specific logic and interactions (e.g., cat behavior or event currency redemption). The component composition includes `inventoryitem`, `stackable`, `inspectable`, and `tradable`, indicating full integration into the game’s inventory, stacking, trading, and inspection systems.

## Usage example
While `yotr_token` is typically spawned as a prefab rather than instantiated manually, here is a minimal example of how to spawn and configure a token programmatically:
```lua
local inst = Prefab("yotr_token", nil, {
    Asset("ANIM", "anim/yotr_token.zip"),
})()
inst:AddComponent("inventoryitem")
inst:AddComponent("stackable")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM
inst:AddTag("yotr_token")
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `inspectable`, `tradable`, `transform`, `animstate`, `network`
**Tags:** Adds `cattoy`, `renewable`, `yotr_token`. Checks none explicitly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum number of tokens allowed per stack. |

## Main functions
Not applicable (prefab factory function `fn()` is internal; no public methods beyond standard component APIs like `stackable:GetSize()` or `stackable:Push()`).

## Events & listeners
None identified.
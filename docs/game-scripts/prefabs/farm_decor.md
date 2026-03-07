---
id: farm_decor
title: Farm Decor
description: Defines prefabs for decorative landscape items used in farm-related environments, such as rocks, sticks, and fence posts.
tags: [environment, decor, static]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f52a6833
system_scope: environment
---

# Farm Decor

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`farm_decor` is a utility script that defines static decorative prefabs for use in the farm environment. It exports multiple prefab definitions (e.g., `farmrock`, `stick`, `fencepost`) using helper functions that configure transform, animation, and basic entity properties. All prefabs are non-persistent (i.e., not saved to world save data), intended for short-lived or environment-specific decorative placement. They are tagged `DECOR` and optionally `NOCLICK` to disable interaction.

## Usage example
```lua
-- Example: Spawn a farm rock decor entity
local rock = CreateEntity()
rock.entity:AddTransform()
rock.entity:AddAnimState()
rock:AddTag("DECOR")
rock.persists = false
rock.AnimState:SetBank("farm_decor")
rock.AnimState:SetBuild("farm_decor")
rock.AnimState:PlayAnimation("1")

-- Or more concisely, use the exported prefab:
inst = SpawnPrefab("farmrock")
```

## Dependencies & tags
**Components used:** `transform`, `animstate` (added via `AddTransform`, `AddAnimState`)
**Tags:** Adds `DECOR` to all prefabs; optionally adds `NOCLICK` for specific items.

## Properties
No public properties. This script only defines and returns prefabs via factory functions; it does not expose a component interface or persistent state.

## Main functions
### `item(name, bankname, buildname, animname, tag)`
* **Description:** Returns a prefabricated entity configured for decoration. Internally, it calls `makefn` to generate an entity constructor and `makeassetlist` to define required assets.
* **Parameters:**
  * `name` (string) — Unique prefab name (e.g., `"stick"`).
  * `bankname` (string) — Animation bank name (used for `SetBank`).
  * `buildname` (string) — Animation build name (used for `SetBuild`).
  * `animname` (string) — Initial animation to play (e.g., `"3"`).
  * `tag` (string or `nil`) — Optional additional tag (e.g., `"NOCLICK"`).
* **Returns:** A `Prefab` object (definition), not an entity instance.

## Events & listeners
None identified.
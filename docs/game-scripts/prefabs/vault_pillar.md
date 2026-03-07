---
id: vault_pillar
title: Vault Pillar
description: Provides a decorative, interactive vault pillar entity with broken/capped states, optional relic attachment, and save/load persistence.
tags: [environment, decoration, persistence]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 31f2ad39
system_scope: environment
---

# Vault Pillar

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`vault_pillar` defines a decorative environment entity used in underground vaults. It supports three visual states (`idle_upper`, `idle_upper_capped`, `idle_upper_capped_2`, `idle_upper_broken`) and optionally holds a vault relic (bowl, vase, or planter) on top. The entity persists state across saves via `OnSave`/`OnLoad` hooks and is only instantiated on the master simulation. A non-networked child entity (`CreateBottom`) provides visual continuity underground.

## Usage example
```lua
local pillar = SpawnPrefab("vault_pillar")
pillar:MakeCapped(2)  -- cap with variation 2
pillar:MakeBroken(true)  -- mark as broken
pillar:AttachRelic()  -- spawn and attach a random relic
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `network`
**Tags:** Adds `decor`, `nomagic`, `nohighlight`. Creates child with `decor`, `NOCLICK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `capped` | number or `nil` | `nil` | Variant indicator: `1` or `2` if capped, `nil` otherwise. |
| `broken` | number or `nil` | `nil` | Set to `1` when pillar is broken. |
| `_nextrelic` | table (module-local) | `nil` | Shuffled list of relic prefabs for deterministic random assignment during generation. |

## Main functions
### `MakeCapped(var)`
* **Description:** Sets pillar state to capped (visuals: `idle_upper_capped` or `idle_upper_capped_2` depending on `var`), clears `broken` flag.
* **Parameters:** `var` (number) — variant; `2` selects capped_2 animation, otherwise capped.
* **Returns:** The instance (`self`).
* **Error states:** None.

### `MakeBroken(broken)`
* **Description:** Sets pillar state to broken (animation `idle_upper_broken`) or restores default (`idle_upper`) if `broken` is falsy.
* **Parameters:** `broken` (boolean) — truthy to break, falsy to repair.
* **Returns:** The instance (`self`).
* **Error states:** None.

### `AttachRelic()`
* **Description:** Spawns a random vault relic prefab (bowl, vase, planter) on top with weighted probabilities and attaches it to the pillar. Uses a shuffled module-local list to ensure consistency during world generation.
* **Parameters:** None.
* **Returns:** The instance (`self`).
* **Error states:** Relic spawn chance is `40%`; no action taken if random check fails.

### `OnSave(inst, data)`
* **Description:** Serializes `capped` and `broken` state into save data table.
* **Parameters:** `data` (table) — save data table to populate.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores pillar state from saved data. Applies capped state first; if absent, checks for `broken`; otherwise, has a 50% chance to set broken if `data.random` exists (set by worldgen).
* **Parameters:** `data` (table or `nil`) — saved data; may contain `capped`, `broken`, or `random`.
* **Returns:** Nothing.

## Events & listeners
Not applicable.
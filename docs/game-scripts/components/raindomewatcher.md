---
id: raindomewatcher
title: Raindomewatcher
description: Tracks whether an entity is currently inside a rain dome and emits events upon entering or exiting one.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 75f16698
---

# Raindomewatcher

## Overview
This component monitors the entity's position relative to rain domes in the world. It maintains a boolean flag `underdome` indicating current enclosure within a rain dome and dispatches appropriate events when the entity enters or exits a dome.

## Dependencies & Tags
- Requires `Transform` component (for `GetWorldPosition`)
- Requires `GetRainDomesAtXZ` global function (not a component dependency, but an environment query)
- No components are added or tags modified directly by this script.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GloballyUniqueInstance` | (passed in) | Reference to the owning entity. |
| `underdome` | `boolean` | `false` | Whether the entity is currently inside a rain dome. |

## Main Functions

### `IsUnderRainDome()`
* **Description:** Returns the current `underdome` status.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Called periodically by the entity update loop. Determines if the entity is inside any rain dome by sampling its x/z world coordinates. Updates `underdome` state and pushes `"enterraindome"`, `"underraindomes"`, or `"exitraindome"` events as appropriate.
* **Parameters:**
  - `dt` (`number`): Delta time since last update (unused in logic but required by component contract).

## Events & Listeners
- Listens for internal updates via `inst:StartUpdatingComponent(self)` (not a network event).
- Pushes the following events:
  - `"enterraindome"` — when the entity transitions from outside to inside a rain dome.
  - `"underraindomes", domes` — sent every update while inside at least one rain dome, where `domes` is a table of dome entities at the current x/z position.
  - `"exitraindome"` — when the entity transitions from inside to outside all rain domes.
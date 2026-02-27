---
id: moonstormlightningmanager
title: Moonstormlightningmanager
description: Manages spawning of moonstorm ground lightning effects around the player based on proximity and moonstorm node positions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 4f9676b2
---

# Moonstormlightningmanager

## Overview
This component orchestrates the periodic spawning of ground lightning visual effects (`moonstorm_ground_lightning_fx`) during a moonstorm, constrained by player visibility radius, camera distance, and alignment with active moonstorm nodes on the map. It operates as a periodic updater on the entity to which it's attached—typically the world root—and ceases updates when no moonstorm nodes are active.

## Dependencies & Tags
- Relies on `TheWorld.Map` (map interface)
- Relies on `TheWorld.net.components.moonstorms._moonstorm_nodes` (a networked value list of active node indices)
- Listens for the `"moonstorm_nodes_dirty_relay"` event on `TheWorld`
- It does **not** add or remove tags or components from its owner instance (`inst`)

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spark` | table | `{ per_sec = 5, spawn_rate = 0, checkfn = checkground, spawnfn = SpawnLightning }` | Configuration table for lightning spawn logic: base rate, accumulated spawn timer, validation function, and spawn callback. |
| `sparks_per_sec` | number | `1` | Base lightning rate per second (currently unused, as `spark.per_sec` is used directly). |
| `sparks_idle_time` | number | `5` | Not used in current implementation. |
| `sparks_per_sec_mod` | number | `1.0` | Multiplier applied to effective spawn rate; controls storm intensity scaling (e.g., `when <= 0`, the updater stops). |

## Main Functions

### `MoonstormLightningManager:OnUpdate(dt)`
* **Description:** Called periodically (typically every frame while updating). Computes a dynamic lightning spawn rate based on time delta, camera distance, and visibility radius. Attempts to spawn lightning at random points within the visible radius, but only if the point aligns with an active moonstorm node and is on valid visual ground.
* **Parameters:**
  - `dt`: number — Delta time since last update, used to accumulate spawn probability.

## Events & Listeners
- **Listens to `"moonstorm_nodes_dirty_relay"` on `TheWorld`:**  
  When triggered, starts or stops component updates based on whether moonstorm nodes are active. Specifically:
  - If `_moonstorm_nodes:value()` returns a truthy list → starts updating component.
  - Otherwise → stops updating component.
- **No events are pushed/triggers** — this component is strictly reactive and visual-spawning only.
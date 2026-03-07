---
id: shard_seasons
title: Shard Seasons
description: Manages season state synchronization between master shard and clients for a specific shard entity in Don't Starve Together.
tags: [network, season, shard, sync]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 94b2d7b3
system_scope: network
---

# Shard Seasons

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shard_Seasons` is a low-level network synchronization component attached to shard entities (e.g., world shards). It ensures that seasonal state data—such as current season, season lengths, elapsed/remaining days—is accurately shared between the master shard (server) and client shards. It is strictly for internal use and only instantiated on the master simulation (`TheWorld.ismastersim`). Client-side replication is handled via network variables linked to `"seasonsdirty"` updates.

## Usage example
This component is not intended for direct modder usage. It is automatically added and managed by the engine for shard entities.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `inst` | Reference to the entity (shard) this component is attached to. |

## Main functions
None — this component only initializes network variables and event listeners. It does not expose any callable public methods.

## Events & listeners
- **Listens to:**  
  - `master_seasonsupdate` — (only on master shard) updates local season data from network data.  
  - `seasonsdirty` — (only on non-master shard) triggers sending current season state to master shard via `secondary_seasonsupdate`.
- **Pushes:**  
  - `secondary_seasonsupdate` — sent to master shard to propagate client-side seasonal state changes.

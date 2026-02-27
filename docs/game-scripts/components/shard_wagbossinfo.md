---
id: shard_wagbossinfo
title: Shard Wagbossinfo
description: Tracks and synchronizes the defeated state of the Wagboss across shards in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 07fce7b5
---

# Shard Wagbossinfo

## Overview
This component maintains and synchronizes the defeat status of the Wagboss (a boss entity in the game) across the master shard and client shards in multiplayer. It acts as a lightweight synchronization bridge by exposing a boolean flag (`_isdefeated`) that reflects whether the Wagboss has been defeated, ensuring consistency between server-authoritative state and client-side queries.

## Dependencies & Tags
- **Component Dependencies:** Relies on `TheWorld.components.wagboss_tracker` being present (used during initialization on the master shard).
- **Tags:** None identified.
- **Network Dependencies:** Uses `net_bool` to synchronize state via the `"shard_wagbossinfo._isdefeated"` network variable, requiring the `master_wagbossinfoupdate` event to be dispatched by `wagboss_tracker`.

## Properties
| Property | Type | Default Value | Description |
|---------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | Reference to the entity the component is attached to (typically `TheWorld` or a world shard instance). |
| `_isdefeated` | `net_bool` | `false` | Networked boolean tracking whether the Wagboss is defeated; synchronized from master shard to clients. |

## Main Functions
### `IsWagbossDefeated()`
* **Description:** Returns the current defeat status of the Wagboss as a boolean value.
* **Parameters:** None.

## Events & Listeners
- **Listens for:** `"master_wagbossinfoupdate"` event (on master shard only) — triggers `OnWagbossInfoUpdate` to update `_isdefeated` from incoming `data.isdefeated`.
- **Triggers:** None directly (the `net_bool` variable is implicitly synchronized; updating `_isdefeated` via `:set()` propagates changes to other shards).
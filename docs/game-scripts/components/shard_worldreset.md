---
id: shard_worldreset
title: Shard Worldreset
description: Handles world reset countdown synchronization between master shard and secondary shards in multiplayer.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 2d8692f2
---

# Shard Worldreset

## Overview
This component manages the synchronization of the world reset countdown timer between the master shard and secondary shards in a multiplayer DST world, using a networked variable to propagate countdown updates and trigger local event-driven sync actions.

## Dependencies & Tags
- **Requires:** `TheWorld.ismastersim` (asserted at instantiation; component only exists on the simulation master).
- **Uses Network Variable:** `net_byte` named `"shard_worldreset._countdown"` with sync trigger `"countdowndirty"`.
- **No explicit component additions or tag modifications** are performed by this script.

## Properties
No public properties are initialized in the constructor. The component exclusively uses local module-scope and networked variables.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | `Entity` | `inst` (constructor argument) | Reference to the entity the component is attached to (used as a sync anchor, not directly managed). |

## Main Functions
No public methods are defined. All logic resides in event handlers and closure-based callbacks initialized at construction.

## Events & Listeners
- **Listens for `"master_worldresetupdate"` event (on master shard only):** Triggers `OnCountdownUpdate`, which updates the networked `_countdown` variable with the provided countdown value.
- **Listens for `"countdowndirty"` event (on secondary shards only):** Triggers `OnCountdownDirty`, which pushes a `"secondary_worldresetupdate"` event to `TheWorld` with the current countdown value fetched from the networked variable.
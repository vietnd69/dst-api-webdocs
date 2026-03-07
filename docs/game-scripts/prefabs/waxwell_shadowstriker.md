---
id: waxwell_shadowstriker
title: Waxwell Shadowstriker
description: A visual and networked entity that represents Waxwell's shadow during the lava arena boss fight, used for shadow strike attacks.
tags: [combat, boss, visual, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f4baaf8d
system_scope: entity
---

# Waxwell Shadowstriker

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `waxwell_shadowstriker` prefab is a visual-only entity spawned during the Lava Arena boss fight. It represents the shadow manifestation used in Waxwell's "shadow strike" mechanic. It carries the appropriate animation states, sound emitter, and physics properties needed for collision and movement but does not host logic or behavior — its behavior is controlled externally (likely via the `event_server_data("lavaarena", ...).master_postinit` hook). On the client, it serves as a local visual representation; on the server, it is initialized and passed to a dedicated handler.

## Usage example
This prefab is not added manually in mod code. It is instantiated internally by the game during the Lava Arena boss encounter as part of the shadow strike sequence.

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `physics`, `network`
**Tags:** Adds `scarytoprey`, `NOBLOCK`

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable
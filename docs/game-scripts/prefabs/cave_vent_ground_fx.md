---
id: cave_vent_ground_fx
title: Cave Vent Ground Fx
description: Spawns and manages a single ground-level visual effect for cave vent systems, used to create layered particle effects around the main vent.
tags: [fx, environment, visual]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4b2eb09f
system_scope: fx
---

# Cave Vent Ground Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cave_vent_ground_fx` is a simple visual effect prefab used in conjunction with cave vent systems. It renders a background-layered animated texture at a fixed offset relative to a parent vent entity, contributing to the illusion of multiple vent layers. It is a non-interactive, non-persistent FX entity with no logic beyond initialization and positioning.

## Usage example
This prefab is not intended for manual use. It is spawned automatically by its parent vent via `SpawnPrefab("cave_vent_ground_fx")` during initialization. It does not provide public API methods.

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX`, `NOCLICK`

## Properties
No public properties.

## Main functions
This is a prefab definition (`return Prefab(...)`), not a component, so it does not define methods on `inst.components`.

## Events & listeners
This prefab defines no event listeners or pushed events. It includes `OnSave` and `OnLoad` callbacks for persistence of the `animnum` field, but these are hook functions attached to the entity instance, not standard DST event system listeners.


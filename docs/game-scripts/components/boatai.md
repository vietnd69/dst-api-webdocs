---
id: boatai
title: Boatai
description: Manages the artificial intelligence for a boat, causing it to automatically follow other nearby boats with raised sails.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: brain
---

# Boatai

## Overview
The Boatai component provides artificial intelligence for a boat entity. Its primary responsibility is to scan for other boats in the vicinity. If it detects a nearby boat with its sail raised, it will automatically raise its own sail and adjust its heading to follow the target boat. This creates a "follow the leader" behavior among AI-controlled boats.

## Dependencies & Tags
**Dependencies:**
- `hull`
- `mast`

**Tags:**
- None identified.

## Properties
No public properties were clearly identified from the source. The component primarily contains logic within its `OnUpdate` method.

## Main Functions
### `OnUpdate(dt)`
* **Description:** Called every update frame by the game engine. It scans a 200-unit radius for other entities. If it finds another boat with its sail raised, this component's boat will raise its own sail and calculate a new `wind_direction` to move towards and follow the target boat.
* **Parameters:**
    * `dt` (number): The time elapsed since the last update, in seconds.
---
id: firelevel
title: Firelevel
description: Defines static configuration parameters for a fire-like entity's visual, thermal, and burning behavior.
tags: [fire, lighting, thermal, behavior]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: df117252
system_scope: entity
---

# Firelevel

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Firelevel` is a simple configuration class that stores static data used to define how a fire-like entity behaves and appears. It encapsulates properties such as fuel thresholds (for size transitions), burn rate, light intensity and color, thermal heat radius, and spread interval. This class does not manage runtime logic or state; it is purely a data container for fire-related prefabs or systems to reference during instantiation or behavior updates.

## Usage example
```lua
local small_fire = Firelevel("small", "A small fire", 0, 50, 0.5, 1.0, {1, 0.7, 0}, 3, 2)
local large_fire = Firelevel("large", "A large roaring fire", 51, 100, 0.25, 2.0, {1, 0.3, 0}, 5, 1)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | string | *(parameter)* | Human-readable identifier for this fire level (e.g., `"small"`, `"large"`). |
| `desc` | string | *(parameter)* | Localized description of the fire level. |
| `minFuel` | number | *(parameter)* | Minimum fuel value required to be considered this fire level. |
| `maxFuel` | number | *(parameter)* | Maximum fuel value at which this fire level applies. |
| `burnRate` | number | *(parameter)* | Time interval in seconds over which fuel is consumed (shorter = burns faster). |
| `intensity` | number | *(parameter)* | Brightness multiplier for the fire’s light component. |
| `colour` | vector3 | *(parameter)* | RGB color table `{r, g, b}` for the fire’s light. |
| `heat` | number | *(parameter)* | Radius around the fire where thermal effects (e.g., warming or burning) occur. |
| `spreadrate` | number | *(parameter)* | Time interval in seconds between attempts to spread or ignite adjacent flammable entities. |

## Main functions
Not applicable.

## Events & listeners
Not applicable.
---
id: shadowtentacle
title: Shadowtentacle
description: A transient shadow-aligned tentacle projectile that deals damage, applies sanity drain, and auto-destructs after 9 seconds.
tags: [combat, boss, environment, projectiled]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3d8bd0df
system_scope: entity
---

# Shadowtentacle

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadowtentacle` is a transient projectile prefab used as a boss attack in DST, specifically fired by the Ruins Bat (and potentially other sources). It manifests as a semi-transparent, slow-moving tentacle with shadow traits that damages targets on contact, reduces nearby player sanity, and automatically removes itself after 9 seconds. It is non-solid (due to `SetPristine`) and lacks physical collision for the player.

## Usage example
This prefab is not manually instantiated by modders. It is created internally by entities like `ruins_bat` and `slingshotammo`. A typical internal instantiation looks like:
```lua
local tentacle = SpawnPrefab("shadowtentacle")
tentacle.Transform:SetPosition(x, y, z)
tentacle.owner = some_entity
tentacle.components.combat:SetDefaultDamage(new_damage)
```

## Dependencies & tags
**Components used:** `health`, `combat`, `sanityaura`, `lootdropper`, `physics`, `transform`, `animstate`, `soundemitter`, `network`
**Tags:** Adds `shadow`, `notarget`, `shadow_aligned`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `"atk_idle"` | Animation name used in the scrapbook. |
| `scrapbook_inspectonseen` | boolean | `true` | Whether inspecting the entity in scrapbook triggers on first visual appearance. |
| `scrapbook_hidehealth` | boolean | `true` (server-only) | Hides health information from scrapbook. |
| `owner` | entity reference | `nil` | Optional reference to the spawner, set externally (e.g., by `ruins_bat`). |
| `persists` | boolean | `false` | Prevents serialization to world save. |

## Main functions
The `shadowtentacle` prefab does not expose custom public methods beyond standard component APIs. Its behavior is configured via component setters during instantiation in the `fn()` constructor. All logic is handled by attached components and the state graph (`SGshadowtentacle`).

## Events & listeners
The `shadowtentacle` prefab does not register or emit any events directly. It relies on its components (`combat`, `health`) and the state graph for internal event flow.
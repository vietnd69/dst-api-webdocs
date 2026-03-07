---
id: archive_resonator
title: Archive Resonator
description: A deployable device that scans for moon relics or alien artifacts to retrieve and consumes uses upon successful scanning or idle operation.
tags: [deployable, artifact, grotto, structure]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6f599285
system_scope: world
---

# Archive Resonator

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`archive_resonator` is a deployable structure used in the Grotto levels to locate and retrieve hidden artifacts (e.g., `moon_altar_ward`, `moon_altar_icon`). It exists in three variants: the active beacon (`archive_resonator`), its deployable item form (`archive_resonator_item`), and a static base (`archive_resonator_base`). The resonator consumes charges over time or upon successful scanning, and supports light-based feedback, animation states, and hammerable interactions.

## Usage example
```lua
-- Deploy the resonator item at a point
local item = SpawnPrefab("archive_resonator_item")
item.Transform:SetPosition(10, 0, 10)
item:PushEvent("deploy", { pt = Vector3(10, 0, 10), deployer = player })

-- Access finite uses
local uses_remaining = item.components.finiteuses:GetPercent()

-- Manually trigger scanning logic (e.g., in custom event)
local resonator = SpawnPrefab("archive_resonator")
resonator.components.finiteuses:SetUses(5)
resonator:PushEvent("scanfordevice")
```

## Dependencies & tags
**Components used:** `deployable`, `finiteuses`, `inspectable`, `inventoryitem`, `lootdropper`, `portablestructure`, `submersible`, `timer`, `workable`.

**Tags:** Adds `FX`, `NOCLICK`, `usedeploystring` (item only); checks `INLIMBO`, `moon_altar_astral_marker`, `boulder`, `moon_relic`, `crabking`, `marker_found`, `moon_altar_icon`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `product` | string or `nil` | `nil` | The prefab name of the artifact to retrieve after successful scanning. |
| `target` | entity or `nil` | `nil` | Reference to the detected artifact entity. |
| `registered_devices` | table | `{}` | List of moon relics/devices registered via `RegisterDevice`. |
| `_endlight`, `_startlight`, `_currentlight` | table | `{}` | Light state descriptors used for interpolation. |
| `_lighttask` | task or `nil` | `nil` | Periodic task managing light animation updates. |

## Main functions
### `ChangeToItem(inst)`
*   **Description:** Converts the active resonator entity into a portable `archive_resonator_item` while preserving use percentage.
*   **Parameters:** `inst` (entity) — the resonator instance.
*   **Returns:** `item` (entity) — a new `archive_resonator_item` instance.
*   **Error states:** Returns `nil` if item spawning fails.

### `scanfordevice(inst)`
*   **Description:** Scans the world for moon relics or artifacts using tags and custom registration; triggers beam animation and sound if a target is found, or idle depletion if none is found.
*   **Parameters:** `inst` (entity) — the resonator instance.
*   **Returns:** Nothing.
*   **Error states:** May leave `inst.target` as `nil` if no eligible entity is found.

### `OnDismantle(inst)`
*   **Description:** Packs up the resonator into an item, stops idle sounds, dims the light, and removes the entity after animation.
*   **Parameters:** `inst` (entity) — the resonator instance.
*   **Returns:** Nothing.

### `onfinisheduses(inst)`
*   **Description:** Destroys the resonator with a small collapse FX when all uses are depleted.
*   **Parameters:** `inst` (entity) — the resonator instance.
*   **Returns:** Nothing.

### `onhammered(inst)`
*   **Description:** Destroys the resonator immediately on hammering, dropping loot and issuing collapse FX.
*   **Parameters:** `inst` (entity) — the resonator instance.
*   **Returns:** Nothing.

### `RegisterDevice(inst, device)`
*   **Description:** Adds a device entity to `registered_devices` for later scanning.
*   **Parameters:** `inst` (entity) — the resonator instance; `device` (entity) — the registered artifact.
*   **Returns:** Nothing.

### `OnUpdateLight(inst, dt)`
*   **Description:** Interpolates light parameters per frame during fade transitions.
*   **Parameters:** `inst` (entity) — the resonator instance; `dt` (number) — delta time.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers artifact retrieval on drill animation completion or packing/destruction on beam/pack completion.
- **Pushes:** `calling_moon_relics` — broadcast event to collect moon relic entities via `RegisterDevice`.

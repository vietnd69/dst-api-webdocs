---
id: lunarfissureburning
title: Lunarfissureburning
description: Applies periodic lunar burn damage to an entity and its mount when standing over a lunar fissure, while managing visual effects and grogginess.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 2b76df55
---

# Lunarfissureburning

## Overview
This component detects when an entity is positioned over a lunar fissure and applies periodic damage (both to the entity itself and its mount, if applicable). It manages the entity’s visibility via visual effects (FX), controls grogginess, and ensures proper registration/unregistration of the lunar burn source with the health component.

## Dependencies & Tags
- **Components used:** `health`, `rider`, `colouradder`, `grogginess`, `Transform`, `combat`
- **Tags checked:** `notarget`, `epic`, `largecreature`
- **Tags added/removed:** None directly added; relies on existing component behavior.
- **External dependencies:** `WagBossUtil` (for fissure detection, coordinate conversion, and damage calculation), `TUNING.ALTERGUARDIAN_LUNAR_FISSURE_LUNAR_BURN_DPS`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *injected* | Reference to the owning entity. |
| `cleartime` | `number` or `nil` | `0` | Tracks time elapsed while out of fissure; used for delayed component removal. |
| `fx` | `Prefabs/Entity` or `nil` | `nil` | Reference to the visual effect prefab (`alterguardian_lunar_fissure_burn_fx`). |

## Main Functions

### `:OnRemoveFromEntity()`
* **Description:** Cleans up the component when removed from the entity. Unregisters lunar burn damage source (if registered), and removes the visual effect (FX) if it exists.
* **Parameters:** None.

### `:SetFxEnabled(enable)`
* **Description:** Enables or disables the visual effect (FX) overlay based on the `enable` flag. When enabled, it spawns, shows, resizes, and colors the FX; when disabled, it hides and cleans up associated FX effects. Also manages the `colouradder` component for colour overlay.
* **Parameters:**
  * `enable` (`boolean`): If `true`, shows FX and applies colour; if `false`, hides FX and removes colour.

### `:OnUpdate(dt)`
* **Description:** Main update loop. Checks if the entity is over a lunar fissure using tile coordinates. If yes, applies periodic lunar burn damage (to entity and mount), maximizes grogginess (if component exists), and enables FX. If not over a fissure, starts or advances `cleartime`, unregisters burn source, and disables FX. After 1 second out of fissure, removes the component.
* **Parameters:**
  * `dt` (`number`): Delta time since last update.

## Events & Listeners
None. The component uses a polling-based update loop (`StartUpdatingComponent` + `OnUpdate`) rather than event-driven logic. No `ListenForEvent` or `PushEvent` calls are present.
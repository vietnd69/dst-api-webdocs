---
id: mosquitosack
title: Mosquitosack
description: A consumable inventory item that heals the user and repairs items while also acting as a combustible fuel source.
tags: [healing, repair, fuel, consumable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f2499941
system_scope: inventory
---

# Mosquitosack

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mosquitosack` prefab is an inventory item that serves dual functionality: it heals the player upon use and repairs damaged items in their inventory. Additionally, it functions as a small burnable fuel source. The component logic is embedded directly within its prefab definition via the `fn()` constructor, which attaches essential components (`repairer`, `fillable`, `healer`, `inspectable`, `inventoryitem`, `stackable`) and configures their behavior. It is only fully initialized on the master simulation, with client instances containing only visual and physical properties.

## Usage example
```lua
-- Example: Spawning and using a mosquitosack
local sack = SpawnPrefab("mosquitosack")
-- The item is immediately usable due to its components
-- When used, it triggers healing and repair effects defined in its components
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `repairer`, `fillable`, `healer`, `smallburnable`, `smallpropagator`, `hauntablelaunchandignite`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repairmaterial` | `MATERIALS.VITAE` | `MATERIALS.VITAE` | Material used for repair operations. |
| `perishrepairpercent` | number | `1` | Fraction of decay reversed per repair (1 = full decay reversal). |
| `filledprefab` | string | `"waterballoon"` | Prefab name used to represent a filled state (used by `fillable` component). |
| `health` | number | `TUNING.HEALING_MEDSMALL` | Health restored when used, configured via `SetHealthAmount`. |

## Main functions
Not applicable — this is a prefab definition, not a component script. Its behavior is implemented through attached components, not custom methods.

## Events & listeners
Not applicable — no event listeners are registered directly in this file. Event interaction occurs via standard component behavior (e.g., `healer` triggers healing on use, `fillable` responds to inventory interactions).
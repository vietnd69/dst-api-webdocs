---
id: batteryuser
title: Batteryuser
description: Enables an entity to consume power from a battery component, handling charge verification and callback execution.
tags: [power, inventory, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 299c15cf
system_scope: entity
---

# Batteryuser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BatteryUser` allows an entity to draw power from another entity that possesses the `battery` component. It enforces validation via `Battery:CanBeUsed`, executes an optional user-defined callback (`onbatteryused`), and notifies the battery via `Battery:OnUsed` upon successful consumption. The component automatically adds the `batteryuser` tag to its entity on initialization and removes it when detached.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("batteryuser")
-- Optional: define custom behavior on battery use
inst.components.batteryuser.onbatteryused = function(user, battery)
    -- Custom logic (e.g., sound,fx,or extra checks)
    return true, ""
end
-- Charge from a battery-powered item (e.g., lantern)
local success, reason = inst.components.batteryuser:ChargeFrom(lantern)
```

## Dependencies & tags
**Components used:** `battery`
**Tags:** Adds `batteryuser` on attach; removes `batteryuser` on detach.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onbatteryused` | function or `nil` | `nil` | Optional callback invoked *before* battery consumption. Receives `user` and `charge_target` as arguments; must return `result` (boolean) and `reason` (string). |

## Main functions
### `ChargeFrom(charge_target)`
* **Description:** Attempts to draw power from the given `charge_target` entity’s `battery` component. Validates via `CanBeUsed`, runs the `onbatteryused` callback (if defined), and on success triggers `OnUsed` on the target battery.
* **Parameters:** `charge_target` (entity) – the entity containing the `battery` component to charge from.
* **Returns:**  
  - `result` (boolean) – `true` if the charge succeeded; `false` otherwise.  
  - `reason` (string) – descriptive message explaining failure (often from `CanBeUsed` or the callback).
* **Error states:** Returns `false` if `CanBeUsed` fails or if the `onbatteryused` callback returns `false`.

## Events & listeners
None identified.

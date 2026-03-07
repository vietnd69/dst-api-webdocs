---
id: flotationdevice
title: Flotationdevice
description: Prevents drowning damage and optionally executes custom logic when drowning is prevented.
tags: [water, damage, drowning]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: bcc01db1
system_scope: entity
---

# Flotationdevice

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FlotationDevice` is a simple component that manages drowning damage prevention for an entity. It is designed to be attached to entities that should resist drowning—typically vehicles or devices used on water (e.g., boats). When drowning is prevented (triggered externally, e.g., by the `drown` system), it optionally invokes a custom callback function (`onpreventdrowningdamagefn`) if one has been assigned. The component itself does not directly interact with other components but provides a hook for integrating custom behavior upon drowning prevention.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("flotationdevice")
inst.components.flotationdevice.onpreventdrowningdamagefn = function(inst)
    print("Drowning prevented for", inst:GetDebugName())
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Controls whether the flotation device is active; if `false`, no drowning prevention occurs. |
| `onpreventdrowningdamagefn` | function or `nil` | `nil` | Optional callback function invoked when drowning damage is prevented. |

## Main functions
### `IsEnabled()`
* **Description:** Returns whether the flotation device is currently enabled.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if enabled, otherwise `false`.

### `OnPreventDrowningDamage()`
* **Description:** Executes the custom callback (`onpreventdrowningdamagefn`) if one is set. This function is intended to be called by external systems (e.g., a drowning handler) when drowning damage is successfully prevented.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Noop if `onpreventdrowningdamagefn` is `nil`.

## Events & listeners
None identified

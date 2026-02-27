---
id: flotationdevice
title: Flotationdevice
description: Provides a configurable mechanism to prevent drowning damage and trigger custom behavior when drowning damage would otherwise occur.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: bcc01db1
---

# FlotationDevice

## Overview
This component acts as a configurable guard against drowning damage for an entity. It exposes a toggleable flag (`enabled`) and supports a callback (`onpreventdrowningdamagefn`) that is invoked whenever the game would apply drowning damage—allowing mods to implement custom logic (e.g., visual effects, state changes) at that moment.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | `boolean` | `true` | Controls whether the component actively prevents drowning damage. When `false`, drowning damage proceeds normally. |
| `onpreventdrowningdamagefn` | `function?` | `nil` | Optional callback function that executes when drowning damage is prevented. Receives the entity instance (`self.inst`) as its only argument. |

## Main Functions

### `IsEnabled()`
* **Description:** Returns the current active state of the component.
* **Parameters:** None.

### `OnPreventDrowningDamage()`
* **Description:** Invoked by the game engine when drowning damage would be applied. If the component is enabled and a callback is assigned, it triggers the callback.
* **Parameters:** None.
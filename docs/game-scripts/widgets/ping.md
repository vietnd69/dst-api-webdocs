---
id: ping
title: Ping
description: Displays the player's network latency (ping) value in the UI, updating periodically and changing text color based on quality thresholds.
tags: [network, ui]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: dc4fbb5c
system_scope: network
---

# Ping

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Ping` is a UI widget that displays the current network latency (in milliseconds) for the local player. It inherits from `Widget` and renders a dynamic text value updated via `OnUpdate()`. The component fetches average ping data using `TheNet:GetAveragePing()`, updates the label text when the value changes, and adjusts the text color based on latency thresholds: green for ≤100 ms, yellow for ≤300 ms, and red for >300 ms.

## Usage example
```lua
local owner = CreateEntity()
local pingWidget = CreateWidget("Ping", owner)
owner:AddChild(pingWidget)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity that owns this widget. |
| `text` | `Text` | `nil` | The child `Text` widget used to render the ping value. |
| `lastPingVal` | `number` or `nil` | `nil` | Stores the last reported ping value to avoid redundant updates. |

## Main functions
### `OnUpdate()`
* **Description:** Called repeatedly while the widget is active; fetches the current ping value, updates the text string if the value has changed, and recolors the text based on latency thresholds.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified.
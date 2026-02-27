---
id: tradable
title: Tradable
description: Marks an entity as having a base gold value for trading purposes in the game's economy system.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: c3b7e338
---

# Tradable

## Overview
The `Tradable` component assigns a numeric gold value to an entity, enabling it to be traded in the game's economic system. It serves as a foundational marker and data container for items that can be bought or sold by players.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `goldvalue` | `number` | `0` | The base gold value of the entity; used to determine its worth in trades. |

## Main Functions
No external-facing functions are defined or exported beyond the constructor. The component only initializes internal state.

## Events & Listeners
None.
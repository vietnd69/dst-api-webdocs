---
id: globalvariableoverrides_pax_server
title: Globalvariableoverrides Pax Server
description: Sets global configuration variables for the Pax server environment, including disabling mod warnings and configuring server termination logic.
tags: [network, server, configuration]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 6b79761e
system_scope: network
---

# Globalvariableoverrides Pax Server

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file overrides global variables specifically for the Pax server environment in Don't Starve Together. It defines a timer threshold (`SERVER_TERMINATION_TIMER`) used to automatically terminate the server after prolonged inactivity, and disables the standard mod warning banner (`DISABLE_MOD_WARNING`) that would otherwise appear during modded gameplay.

## Usage example
This file does not define a reusable component; it is a configuration script applied during server startup. Modders typically do not invoke it directly, but its variables may be referenced elsewhere (e.g., in server logic or termination tasks).

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `DISABLE_MOD_WARNING` | boolean | `true` | Suppresses the mod warning UI popup in the Pax server environment. |
| `SERVER_TERMINATION_TIMER` | number | `7200` (2 hours) | Timeout in seconds before the server terminates due to inactivity. |

## Main functions
Not applicable.

## Events & listeners
Not applicable.
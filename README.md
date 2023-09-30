# Veyes: The extensible visualization tool

Veyes aim at providing an alternative visualization tool. Some of it feature are inspired from Grafana

*Note*: The project is in heavy development; No release are provided for now. See build instructions 

## Plugins

The aim of this project is to be plugin-centric.
It aims at providing a very durable and robust core that can be massively extended using plugins

Plugins will be split into two main category

- Server side plugins 
- Frontend side plugins

## Design choices, architecture and roadmap

* Typescript and javascript as the unique language for UI and Server
* Reusable types for Server and UI 
* Strong isolation between module / plugins
* Core application consist of basic APIs, interfaces, and a rudimentary UI
* Core application alone is useless: Veyes must provide core plugins for basic usage
* Inspired by Grafana and k8s
* Provide seamless k8s api integration
* ReactJs for frontend 
* Plugin dependency tree. Each plugin can require another plugin to work 

## Quick start 

* Build all: ```yarn run build```
* Run server: ```yarn run build```

## Packages Structure

* The npm `@veyes` organization contains core components required for minimal startup 
  * `@veyes/core`: 
  * `@veyes/models`: data-model and types to be shared between Server, UI and plugins
  * `@veyes/server`: Webserver and API for Veyes
  * `@veyes/ui`: Shared library of UI components
  * `@veyes/webapp`: Veyes main UI (without plugins)
  * `@veyes/tools`: script and tools used across the project
* The npm `@veyes-plugin` organization contains optional and built-in plugins
  * `@veyes-plugin/dashboards`: Plugin dedicated to dashboard management (provide basic API and UI)  
  * `@veyes-plugin/datasources`: Plugin dedicated to datasource management (provide basic API and UI)
  * `@veyes-plugin/datasource-random`: Random based datasource  
  * `@veyes-plugin/panel-text`: Text panel 
  * `@veyes-plugin/panel-timeseries`: time-series panel
  * And many more later ! 
 
## Documentation

(coming soon)

## License
    
    Copyright 2023 Willena (VILLENA Guillaume) and Contributors
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.










 



  


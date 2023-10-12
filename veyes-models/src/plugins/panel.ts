export interface PanelConfiguration {
    name: string
    description: string
}

export interface PanelPluginApi<Config extends PanelConfiguration = PanelConfiguration> {

}
import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlWebpackTemplate from "html-webpack-template";
import { Plugin, Configuration } from "@reactway/webpack-builder";

// tslint:disable-next-line:no-empty-interface
export interface HtmlPluginOptions extends HtmlWebpackPlugin.Options {}

export const HtmlPlugin: Plugin<HtmlPluginOptions> = (config: HtmlPluginOptions | undefined, projectDirectory: string) => (
    webpack: Configuration
) => {
    if (webpack.plugins == null) {
        webpack.plugins = [];
    }

    let htmlPluginOptions: HtmlWebpackPlugin.Options | undefined = {
        inject: false,
        template: HtmlWebpackTemplate,
        baseHref: "/",
        appMountIds: ["root"],
        meta: [
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            }
        ]
    };

    if (config != null) {
        htmlPluginOptions = config;
    }

    // ts-jest: Throws error when it cannot resolve project root, because we are using Rush/pnpm.
    // tslint:disable-next-line:no-any
    webpack.plugins.push(new HtmlWebpackPlugin(htmlPluginOptions) as any);
    return webpack;
};

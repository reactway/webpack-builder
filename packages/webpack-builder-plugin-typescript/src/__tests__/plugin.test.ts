jest.mock("fork-ts-checker-webpack-plugin");
import { Builder, Configuration } from "@reactway/webpack-builder";
import * as path from "path";
import * as fs from "fs-extra";
// Plugin
import { TypeScriptPlugin } from "../plugin";

let SAMPLE_CONFIGURATION: Configuration = {};
const TEST_PROJECT_LOCATION: string = path.resolve(__dirname, "./test-project");

beforeEach(() => {
    SAMPLE_CONFIGURATION = {
        entry: "./src/index.ts",
        mode: "development",
        output: {
            path: path.resolve(TEST_PROJECT_LOCATION, "dist"),
            filename: "[name].bundle.js",
            chunkFilename: "[name].bundle.js",
            publicPath: "./"
        }
    };
});

it("Adding typescript plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(TypeScriptPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Adding typescript plugin with fork-ts-checker-webpack-plugin options to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin, {
            forkTsCheckerOptions: {
                formatter: "codeframe",
                silent: true,
                colors: true,
                checkSyntacticErrors: false
            }
        })
        .toConfig();

    expect(configuration).toMatchSnapshot();
});

it("Adding typescript plugin with tsconfigPathsPluginOptions to configuration that tsconfig.json do not have baseURL", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION);

    expect(() =>
        configuration
            .use(TypeScriptPlugin, {
                tsconfigPathsPluginOptions: { configFile: path.resolve(TEST_PROJECT_LOCATION, "tsconfig.json") }
            })
            .toConfig()
    ).toThrowError("Cannot add tsconfigPathsPluginOptions because baseUrl do not exist at tsconfig.json");
});

it("Adding typescript plugin with tsconfigPathsPluginOptions to configuration", () => {
    const projectLocation = path.resolve(__dirname, "./tsconfig-baseURL-exist");
    const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin, {
            tsconfigPathsPluginOptions: {
                logLevel: "INFO"
            }
        })
        .toConfig();

    expect(configuration).toMatchSnapshot();
});

it("baseURL exists at tsconfig", () => {
    const projectLocation = path.resolve(__dirname, "./tsconfig-baseURL-exist");
    const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION).use(TypeScriptPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("baseURL exists at tsconfig and adding tsconfigPathsPluginOptions", () => {
    const projectLocation = path.resolve(__dirname, "./tsconfig-baseURL-exist");
    const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin, {
            tsconfigPathsPluginOptions: { configFile: path.resolve(projectLocation, "tsconfig.json") }
        })
        .toConfig();
    expect(configuration).toMatchSnapshot();
});

it("tsconfig with single space baseUrl", () => {
    const configuration = new Builder(path.resolve(__dirname, "./empty-space-baseURL"), SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin)
        .toConfig();
    expect(configuration).toMatchSnapshot();
});

it("tsconfig jsx property exist", () => {
    const configuration = new Builder(path.resolve(__dirname, "./tsconfig-jsx-exist"), SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin)
        .toConfig();
    expect(configuration).toMatchSnapshot();
});

it("tsconfig and tslint do not exist", () => {
    const projectLocation = path.resolve(__dirname, "./tsconfig-tslint-not-exist");
    fs.emptyDir(projectLocation);
    const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION).use(TypeScriptPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});
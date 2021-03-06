__dirname = "TEST_PATH";

jest.mock("upath", () => ({
    ...jest.requireActual("upath"),
    resolve: (...pathSegments: string[]) => pathSegments.join("//"),
    join: (...pathSegments: string[]) => pathSegments.join("//")
}));

import { Builder, Configuration } from "@reactway/webpack-builder";
import upath from "upath";
import { CleanPlugin } from "../plugin";

let SAMPLE_CONFIGURATION: Configuration = {};
const TEST_PROJECT_LOCATION: string = upath.resolve(__dirname, "./test-project");

beforeEach(() => {
    SAMPLE_CONFIGURATION = {
        entry: "./src/index.ts",
        mode: "development",
        output: {
            path: upath.resolve(TEST_PROJECT_LOCATION, "dist"),
            filename: "[name].bundle.js",
            chunkFilename: "[name].bundle.js",
            publicPath: "./"
        }
    };
});

it("Adding clean plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(CleanPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Adding clean plugin with options to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(CleanPlugin, { dry: true }).toConfig();
    expect(configuration).toMatchSnapshot();
});

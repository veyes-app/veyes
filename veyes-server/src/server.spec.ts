import {WebServer} from "./server";

describe('Test', () => {
    process.argv =["node","server", "--pluginDirectories=../test-directory"]
    new WebServer().start()
});
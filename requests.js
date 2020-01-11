import request from "request/index";
import Promise from "Promise/index";
import { encodeForURI } from "./utils";

const BASE_URL = "https://api.slothpixel.me/api";

function sendRequest(extension, parameters = {}) {
    let queryParameters = "";
    for (let property in parameters) {
        queryParameters += `${property}=${encodeForURI(parameters[property])}&`;
    }

    if (queryParameters !== "") {
        extension += `?${queryParameters}`;
    }

    print(`URL: ${BASE_URL + extension}`);

    const returnedPromise = request({
        url: BASE_URL + extension,
        headers: {
            ["User-Agent"]: "Mozilla/5.0 (ChatTriggers; slothpixel module)"
        }
    });

    return new Promise((resolve, reject) => {
        returnedPromise.then(value => resolve(JSON.parse(value)));
    });
}

export { sendRequest as default }
import { cleanUUID } from "./utils";
import sendRequest from "./requests";
import Promise from "Promise/index";

/**
 * @param usernameOrUUID The username/uuid of the player
 * @returns {Promise}
 */
function getPlayer(usernameOrUUID) {
    const name = cleanUUID(usernameOrUUID);

    return sendRequest(`/players/${name}`);
}

/**
 * @param usernameOrUUID The username/uuid of the player
 * @returns {Promise}
 */
function getPlayerAchievements(usernameOrUUID) {
    const name = cleanUUID(usernameOrUUID);

    return sendRequest(`/players/${name}/achievements`);
}

/**
 * @param usernameOrUUID The username/uuid of the player
 * @returns {Promise}
 */
function getPlayerQuests(usernameOrUUID) {
    const name = cleanUUID(usernameOrUUID);

    return sendRequest(`/players/${name}/quests`);
}

/**
 * @param usernameOrUUID The username/uuid of the player in a specific guild
 * @param queryParameters [populatePlayers]
 * @returns {Promise}
 */
function getGuild(usernameOrUUID, queryParameters = {}) {
    const name = cleanUUID(usernameOrUUID);

    return sendRequest(`/guilds/${name}`, queryParameters);
}

/**
 * @param type "players" or "guilds"
 * @param columns Comma separated data columns that will be returned (ex: stats.Arcade.coins)
 * @param sortBy Which stat to sort records by. Requires the full path when using with nested objects (ex: stats.Arcade.wins)
 * @param queryParameters [filter, limit = 10, page = 0, significant = true]
 * @returns {Promise} `nextPage` function to return the next page of data.
 */
function getDynamicLeaderboard(type, columns, sortBy, queryParameters = {}) {
    const actualParameters = { ...queryParameters, type, columns, sortBy };
    const returnedPromise = sendRequest("/leaderboards", actualParameters);

    return new Promise((resolve, reject) => {
        returnedPromise.then((data => {
            data.hasNextPage = () => data.length >= (queryParameters?.limit ?? 10);

            data.nextPage = () => getDynamicLeaderboard(
                type,
                columns,
                sortBy,
                { ...queryParameters, page: (queryParameters?.page ?? 0) + 1 }
            );

            resolve(data);
        })).catch(reject);
    });
}

/**
 * @param template Choose a predefined leaderboard, e.g. "general_level". Possible options can be retrieved from /metadata endpoint.
 * @returns {Promise}
 */
function getPredefinedLeaderboard(template) {
    return sendRequest(`/leaderboards/${template}`);
}

/**
 * @returns {Promise}
 */
function getNetworkBoosters() {
    return sendRequest("/boosters");
}

/**
 * @param game Standard minigame name
 * @returns {Promise}
 */
function getGameBoosters(game) {
    return sendRequest(`/boosters/${game}`);
}

/**
 * @returns {Promise}
 */
function getBans() {
    return sendRequest("/bans");
}

/**
 * @returns {Promise}
 */
function getSkyblockItems() {
    return sendRequest("/skyblock/items");
}

/**
 * @param queryParameters [filter, limit = 10, page = 0, active = true, auctionUUID, itemUUID, id]
 * @returns {Promise} with `nextPage` and `hasNextPage` function to return the next page of data.
 */
function getSkyblockAuctions(queryParameters = {}) {
    const returnedPromise = sendRequest("/skyblock/auctions", queryParameters);

    return new Promise((resolve, reject) => {
        returnedPromise.then((data => {
            data.hasNextPage = () => data.length >= (queryParameters?.limit ?? 10);

            data.nextPage = () => getSkyblockAuctions({
                ...queryParameters,
                page: (queryParameters?.page ?? 0) + 1
            });

            resolve(data);
        })).catch(reject);
    });
}

/**
 * @param itemId Item identifier, e.g. HOT_POTATO_BOOK
 * @param queryParameters [from = (24 hours ago), until = (now)]
 * @returns {Promise}
 */
function getSkyblockAuctionForItem(itemId, queryParameters = {}) {
    return sendRequest(`/skyblock/auctions/${itemId}`, queryParameters);
}

function getSiteMetadata() {
    return sendRequest("/metadata");
}

export {
    getPlayer,
    getPlayerAchievements,
    getPlayerQuests,
    getGuild,
    getDynamicLeaderboard,
    getPredefinedLeaderboard,
    getNetworkBoosters,
    getGameBoosters,
    getBans,
    getSkyblockItems,
    getSkyblockAuctions,
    getSkyblockAuctionForItem,
    getSiteMetadata
}
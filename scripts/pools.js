// Call populatePoolsRandomly(element) with an element to append all the pools to.
// This will allow adding the pools into any div.

var _poolCache = null;
var _poolURL = "https://raw.githubusercontent.com/SinglePoolAlliance/Registration/master/registry.json";

function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Exposes the pools as a cacheable object for use anywhere
function getCachedPools(success) {
    if (_poolCache == null) {
        // Promise-interface, so make sure to call success separately in else logic
        $.getJSON(_poolURL, function (data) {
            _poolCache = data;
            if (_poolCache == null) {
                // Something went wrong
                console.log("_poolCache is null, are you able to reach \'" + _poolURL + "\'?");
            }

            success(_poolCache);
        });
    } else {
        success(_poolCache);
    }
}

// Returns a link with a stylized ticker box colored depending on saturation
function poolTicker(poolExtData, hexId, ticker) {
    // Honestly, this should come from a .css
    var font = "sans-serif";
    var border = "border-radius: 8px; border-style: hidden;"
    var width = "70px";
    var height = "70px";
    var margin = "5px";

    if (poolExtData.data.saturation >= 0 && poolExtData.data.saturation <= 0.6) {
        return "<a style='color:  inherit;' target='_blank' href='https://cexplorer.io/pool/" + poolExtData.data.pool_id + "'>" +
            `<table style='margin: ${margin}; height: ${height}; width: ${width}; ${border} font-family: ${font}; background: rgba(1, 152, 117, 1)'>` +
            "<tr><th>" + ticker + "</tr></th>" +
            "<tr><td>" + (poolExtData.data.saturation * 100).toFixed(2) + "%</tr></td>" +
            "</table></a>";
    }
    if (poolExtData.data.saturation > 0.6 && poolExtData.data.saturation <= 0.8) {
        return "<a style='color:  inherit;' target='_blank' href='https://cexplorer.io/pool/" + poolExtData.data.pool_id + "'>" +
            `<table style='margin: ${margin}; height: ${height}; width: ${width}; ${border} font-family: ${font}; background: rgba(225, 165, 255, 1)'>` +
            "<tr><th>" + ticker + "</tr></th>" +
            "<tr><td>" + (poolExtData.data.saturation * 100).toFixed(2) + "%</tr></td>" +
            "</table></a>";
    }
    if (poolExtData.data.saturation > 0.8 && poolExtData.data.saturation <= 0.95) {
        return "<a style='color:  inherit;' target='_blank' href='https://cexplorer.io/pool/" + poolExtData.data.pool_id + "'>" +
            `<table style='margin: ${margin}; height: ${height}; width: ${width}; ${border} font-family: ${font}; background: rgba(225, 165, 0, 1)'>` +
            "<tr><th>" + ticker + "</tr></th>" +
            "<tr><td>" + (poolExtData.data.saturation * 100).toFixed(2) + "%</tr></td>" +
            "</table></a>";
    }
    if (poolExtData.data.saturation > 0.95 && poolExtData.data.saturation <= 100) {
        return "<a style='color:  inherit;' target='_blank' href='https://cexplorer.io/pool/" + poolExtData.data.pool_id + "'>" +
            `<table style='margin: ${margin}; height: ${height}; width: ${width}; ${border} font-family: ${font}; background: rgba(255, 0, 0, 1)'>` +
            "<tr><th>" + ticker + "</tr></th>" +
            "<tr><td>" + (poolExtData.data.saturation * 100).toFixed(2) + "%</tr></td>" +
            "</table></a>";
    }
    return "<div>\"" + ticker + "\"</div>"
}

function randPoolTicker(element) {
    getCachedPools(function (pools) {
        // Select random pool
        randPool = pools[Math.floor(Math.random() * pools.length)];
        $.getJSON('https://js.cexplorer.io/api-static/pool/hex2bech.json', function (hexToBech) {
            let bechID = hexToBech.data[randPool.poolId];
            // element.html(something);
            $.getJSON('https://js.cexplorer.io/api-static/pool/' + bechID + '.json', function (poolExtData) {
                element.html(poolTicker(poolExtData, randPool.poolId, randPool.ticker));
            });
        });
    });
}

function populatePoolTickersRandomly(element) {
    getCachedPools(function (pools) {
        // Shuffle pools randomly
        shuffledPools = shuffleArray(pools);
        $.getJSON('https://js.cexplorer.io/api-static/pool/hex2bech.json', function (hexToBech) {
            $.each(shuffledPools, function (key, pool) {
                let bechID = hexToBech.data[pool.poolId];
                $.getJSON('https://js.cexplorer.io/api-static/pool/' + bechID + '.json', function (poolExtData) {
                    element.append(poolTicker(poolExtData, pool.poolId, pool.ticker));
                });
            });
        });
    });
}
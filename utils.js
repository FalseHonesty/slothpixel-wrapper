function cleanUUID(uuid) {
    return uuid.replace("-", "");
}

function encodeForURI(str) {
    return encodeURIComponent(str).replace(":", "%3A").replace(",", "%2C").replace("$", "%24");
}

function makeFilter(strings, ...keys) {
    let keyIndex = 0;
    let stringsIndex = 0;
    let masterObject = {};

    strings = strings.filter(str => /\S/.test(str));

    while (stringsIndex < strings.length) {
        let lhs = keys[keyIndex++];
        let operation = strings[stringsIndex++];
        let rhs = keys[keyIndex++];

        let equality = makeFilterAtom(lhs, operation.trim(), rhs);

        if (stringsIndex >= strings.length) {
            masterObject = { ...masterObject, ...equality };
            break;
        }

        let next = strings[stringsIndex++].trim();

        if (next === ",") {
            masterObject = { ...masterObject, ...equality };
        } else if (next === "||") {
            let orArray = [equality];

            do {
                let lhs = keys[keyIndex++];
                let operation = strings[stringsIndex++];
                let rhs = keys[keyIndex++];

                let equality = makeFilterAtom(lhs, operation.trim(), rhs);
                orArray.push(equality);

                if (stringsIndex >= strings.length) {
                    break;
                }

                let next = strings[stringsIndex++].trim();

                if (next !== "||") {
                    throw new Error("Or list must contain only || operators.");
                }
            } while (true);

            masterObject["$or"] = orArray;
        }
    }

    return JSON.stringify(masterObject, null, 0);
}

function makeFilterAtom(lhs, operation, rhs) {
    switch (operation) {
        case "<=":
            return simpleComparisonAtom(lhs, rhs, "$lte");
        case "<":
            return simpleComparisonAtom(lhs, rhs, "$lt");
        case ">":
            return simpleComparisonAtom(lhs, rhs, "$gt");
        case ">=":
            return simpleComparisonAtom(lhs, rhs, "$gte");
        case "==":
            return simpleComparisonAtom(lhs, rhs, "$eq");
    }
}

function simpleComparisonAtom(lhs, rhs, opcode) {
    return {
        [lhs]: {
            [opcode]: rhs
        }
    }
}

export { cleanUUID, makeFilter, encodeForURI }
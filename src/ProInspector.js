const util = require("util");
const { inspectors, getInspectorByType, } = require("../inspectors");
const { getPropertiesDescriptors, magenta, mergeOptions, spaces, } = require("./Utilities");

const defaultOptions = {
    maxDepth: 3,
    hiddenProperties: [ "constructor", ],
    overrideDescriptors: {},
    arrayMaxLength: 100,
    showFunctionParameters: true,
};

const globalOptions = {
    spaces: 4,
};

const inspect = (entity, options = {}, depth = 1) => {
    const finalOptions = mergeOptions(defaultOptions, options);
    let representation = "";

    switch (typeof entity) {
        case "object": {
            if (Array.isArray(entity)) {
                representation += getInspectorByType("Array").inspect({ value: entity, }, finalOptions, depth);

                break;
            }

            representation += `${magenta("object")} ${entity.constructor.name} {`;

            const descriptors = getPropertiesDescriptors(entity);
            const functionsDescriptors = [];
            const otherDescriptors = [];

            for (const propertyName of Object.keys(finalOptions.overrideDescriptors ?? {})) {
                descriptors.set(propertyName, {
                    ...descriptors.get(propertyName) ?? {},
                    ...finalOptions.overrideDescriptors[propertyName]
                });
            }

            for (const propertyName of finalOptions.hiddenProperties ?? []) {
                descriptors.delete(propertyName);
            }

            for (const propertyName of [ ...descriptors.keys(), ]) {
                const descriptor = descriptors.get(propertyName);
                const { value, } = descriptor;

                if (typeof value === "function") {
                    functionsDescriptors.push({ propertyName, descriptor, });
                }
                else {
                    otherDescriptors.push({ propertyName, descriptor, });
                }
            }

            const allDescriptors = [ ...otherDescriptors, ...functionsDescriptors, ];

            if (allDescriptors.length === 0) {
                representation += ` ${magenta("empty")} }`;

                return representation;
            }

            representation += "\n";

            let hasAddedSeparator = false;

            for (const { propertyName, descriptor, } of allDescriptors) {
                const value = "value" in descriptor ? descriptor.value : entity[propertyName];
                const entityDescriptor = {
                    value,
                    propertyName,
                    propertyDescriptor: descriptor,
                };

                if (typeof value === "function" && !hasAddedSeparator && otherDescriptors.length > 0) {
                    representation += `${spaces(depth)}- - -\n`;
                    hasAddedSeparator = true;
                }

                for (const inspector of inspectors) {
                    if (inspector.isOwner(entityDescriptor)) {
                        representation += `${spaces(depth)}${inspector.inspect(entityDescriptor, finalOptions, depth + 1)},\n`;

                        break;
                    }
                }
            }

            representation += `${spaces(depth - 1)}}`;

            break;
        }
        case "function": {
            representation += getInspectorByType("Function").inspect({ value: entity, }, finalOptions, depth);

            break;
        }
        default: {
            representation += getInspectorByType("Primitive").inspect({ value: entity, }, finalOptions, depth);
        }
    }

    return representation;
};

const ProInspector = Object.freeze({
    globalOptions,
    inspector: util.inspect.custom,
    inspect,
    activateGlobally: () => {
        Object.prototype[ProInspector.inspector] = function () {
            return inspect(this);
        };
    },
});

module.exports = {
    ProInspector,
};

import { ProInspector, } from "./src/ProInspector.js";
import {magenta, yellow, spaces, getFunctionParameters,} from "./src/Utilities.js";

export const inspectors = [
    {
        type: "Primitive",
        isOwner ({ value, }) {
            switch (typeof value) {
                case "number":
                case "boolean":
                case "string":
                case "undefined": {
                    return true;
                }
                default: {
                    return value === null;
                }
            }
        },
        inspect ({ value, propertyName, propertyDescriptor, }) {
            let inspection = "";

            if (propertyDescriptor) {
                const { get, set, writable, } = propertyDescriptor;

                if ((get && !set) || !writable) {
                    inspection += `${magenta("readonly")} `;
                }
            }

            if (propertyName) {
                inspection += `${propertyName}: `;
            }

            inspection += yellow(JSON.stringify(value));

            return inspection;
        },
    },
    {
        type: "Function",
        isOwner ({ value, }) {
            return typeof value === "function";
        },
        inspect ({ value, propertyName, }, options) {
            let inspection = "";

            if (value.constructor.name === "AsyncFunction") {
                inspection += `${magenta("async")} `;
            }

            if (propertyName) {
                inspection += `${propertyName} `;
            }
            else if (value.name) {
                inspection += `${value.name} `;
            }

            inspection += `${magenta("(")}`;

            if (options.showFunctionParameters) {
                const parametersNames = getFunctionParameters(value);
                for (let i = 0; i < parametersNames.length; ++i) {
                    const parameterName = parametersNames[i];
                    const nextParameterName = parametersNames[i + 1];

                    inspection += "\x1b[2m";
                    inspection += parameterName;

                    if (nextParameterName) {
                        inspection += ", ";
                    }

                    inspection += "\x1b[0m";
                }
            }

            inspection += `${magenta(")")}`;

            return inspection;
        },
    },
    {
        type: "Array",
        isOwner ({ value, }) {
            return Array.isArray(value);
        },
        inspect ({ value, propertyName, propertyDescriptor, }, options, depth) {
            let inspection = "";
            let insertionsLength = 0;

            if (propertyDescriptor) {
                const { get, set, writable, } = propertyDescriptor;

                if ((get && !set) || (!get && !set && !writable)) {
                    inspection += `${magenta("readonly")} `;
                }
            }

            if (propertyName) {
                inspection += `${propertyName}: `;
            }

            inspection += magenta(`Array(${value.length})`);

            if (value.length === 0) {
                inspection += " []";

                return inspection;
            }

            if (options.arrayMaxLength === 0) {
                inspection += " [ . . . ]";

                return inspection;
            }

            inspection += " [\n";

            for (const entity of value) {
                if (insertionsLength === options.arrayMaxLength) {
                    inspection += `${spaces(depth)}. . .\n`;

                    break;
                }
                else {
                    inspection += `${spaces(depth)}${ProInspector.inspect(entity, options, depth + 1)},\n`;
                }

                ++insertionsLength;
            }

            inspection += `${spaces(depth - 1)}]`

            return inspection;
        },
    },
];

export const getInspectorByType = (type) => {
    return inspectors.find((inspector) => inspector.type === type);
};

import { ProInspector, } from "./src/ProInspector.js";
import { magenta, spaces, } from "./src/Utilities.js";

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

            inspection += magenta(JSON.stringify(value));

            return inspection;
        },
    },
    {
        type: "Function",
        isOwner ({ value, }) {
            return typeof value === "function";
        },
        inspect ({ value, propertyName, }) {
            let inspection = "";

            if (value.constructor.name === "AsyncFunction") {
                inspection += `${magenta("async")} `;
            }

            if (propertyName) {
                inspection += `${propertyName} `;
            }

            inspection += `${magenta("()")}`;

            return inspection;
        },
    },
    {
        type: "Array",
        isOwner ({ value, }) {
            return Array.isArray(value);
        },
        inspect ({ value, propertyName, }, options, depth) {
            let inspection = "";
            let insertionsLength = 0;

            if (propertyName) {
                inspection += `${propertyName}: `;
            }

            inspection += magenta(`Array(${value.length})`);

            if (options.arrayMaxLength === 0) {
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

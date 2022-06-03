import { ProInspector, } from "./ProInspector.js";

export const getPropertiesDescriptors = (object) => {
    const descriptors = new Map();

    do {
        for (const name of [ ...Object.getOwnPropertyNames(object), ]) {
            descriptors.set(name, Object.getOwnPropertyDescriptor(object, name));
        }

        object = Object.getPrototypeOf(object);
    }
    while (object !== Object.prototype);

    return descriptors;
};

export const mergeOptions = (initial, primary) => {
    const options = {
        ...initial,
        ...primary,
    };

    for (const key in initial) {
        if (!initial.hasOwnProperty(key) || !primary.hasOwnProperty(key)) {
            continue;
        }

        const initialValue = initial[key];
        const userValue = primary[key];

        if (!initialValue || !userValue) {
            continue;
        }

        if (initialValue.constructor === Object && userValue.constructor === Object) {
            options[key] = mergeOptions(initialValue, userValue);
        }
    }

    return options;
}

export const spaces = (depth) => {
    let spaces = "";

    for (let i = 0; i < depth; ++i) {
        spaces += " ".repeat(ProInspector.globalOptions.spaces);
    }

    return spaces;
};


export const magenta = (text) => {
    return `\x1b[35m${text}\x1b[0m`;
};

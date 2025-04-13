const prefix = {
    info: {
        text: import.meta.env.VITE_PROJECT_NAME + " Helper",
        style: "background: #009890; border-rounded: 6px; padding: 4px; text-weight: semibold;"
    }
}

const logger = {
    info(text: String, module = "Info") {
        return console.info(`%c${prefix.info.text} (${module})`, prefix.info.style, text);
    }
}

export { logger };
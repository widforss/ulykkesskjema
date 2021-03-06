export interface Form {
    [id: string]:
          TextContent
        | HelpText
        | MapInput
        | DateInput
        | KdvSelectInput
        | SelectInput
        | IntegerInput
        | KdvIntegerInput
        | TextInput
        | ImageInput
        | Button
        | SubmitMessage
}

export interface FormMember {
    type: string,
}

export interface TextContent extends FormMember {
    type: "TextContent",
    level: "h1" | "div",
    title: MultiLingualString,
}

export interface TextInput extends FormMember {
    type: "TextInput",
    length: "long" | "short" | "url",
    title: MultiLingualString,
    key: string[],
}

export interface HelpText extends FormMember {
    type: "Help",
    registration: number,
    geohazard: number,
}

export interface MapInput extends FormMember {
    type: "Map",
    accuracyTitle: MultiLingualString,
    accuracy: {[key: number]: MultiLingualString},
}

export interface DateInput extends FormMember {
    type: "Date",
    title: MultiLingualString,
    before: Date,
    after: Date,
    keys: string[][],
    mandatory: boolean,
}

export interface KdvSelectInput extends FormMember {
    type: "KdvSelect",
    titleKey: string[],
    selectKey: string[],
    key: string[],
}

export interface SelectInput extends FormMember {
    type: "Select",
    title: MultiLingualString,
    select: MultiLingualString[],
}

export interface IntegerInput extends FormMember {
    type: "Integer",
    title: MultiLingualString,
    min: number,
    max: number,
}

export interface KdvIntegerInput extends FormMember {
    type: "KdvInteger",
    titleKey: string[],
    preprocessing: (value: number) => number
    min: number,
    max: number,
    key: string[],
}

export interface ImageInput extends FormMember {
    type: "Image",
    title: MultiLingualString,
    geohazard: number,
    registration: number,
    comment: MultiLingualString,
    photographer: MultiLingualString,
    copyright: MultiLingualString,
    error: MultiLingualString,
}

export interface Button extends FormMember {
    type: "Button",
    title: MultiLingualString,
    error: MultiLingualString,
}

export interface SubmitMessage extends FormMember {
    type: "SubmitMessage",
    title: MultiLingualString,
}

export type Language = "en" | "nb"

interface MultiLingualString {
    en: string,
    nb: string,
}
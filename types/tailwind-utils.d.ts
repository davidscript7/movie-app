declare module 'tailwindcss/lib/util/flattenColorPalette' {
    import { type Config } from 'tailwindcss';
    export const flattenColorPalette: (colors: Config['theme']['colors']) => Record<string, string>;
}

declare module 'tailwindcss/lib/util/toColorValue' {
    const toColorValue: (color: unknown) => string;
    export default toColorValue;
}

declare module 'tailwindcss/lib/util/withAlphaVariable' {
    import { type CSSRuleObject } from 'tailwindcss/types/config';

    const withAlphaVariable: (options: {
        color: string;
        property?: string;
        variable?: string;
    }) => CSSRuleObject;

    export default withAlphaVariable;
}
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { ContentItem } from '../models/item/content-item.class';
import { Link } from '../models/item/link.class';
import { TypeResolver } from '../models/item/type-resolver.class';
import { IRichTextHtmlParser } from '../parser';
import { FieldInterfaces } from './field-interfaces';
import { FieldModels } from './field-models';
import { FieldType } from './field-type';
import { RichTextResolver } from './rich-text-resolver.class';

export namespace Fields {

    export class TextField implements FieldInterfaces.IField {

        /**
        * Text stored in the field
        */
        public text: string;

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.Text;

        /**
        * Represents text field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            this.text = this.value;
        }
    }

    export class MultipleChoiceField implements FieldInterfaces.IField {

        /**
        * Multiple choice options
        */
        public options: FieldModels.MultipleChoiceOption[] = [];

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.MultipleChoice;

        /**
        * Represents multiple choice field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            if (this.value && Array.isArray(this.value)) {
                this.value.forEach(option => {
                    const optionTemp = option as FieldInterfaces.IMultipleChoiceOption;
                    this.options.push(new FieldModels.MultipleChoiceOption(
                        optionTemp.name,
                        optionTemp.codename
                    ));
                });
            }
        }
    }

    export class DateTimeField implements FieldInterfaces.IField {

        /**
        * Date time value
        */
        public datetime: Date;

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.DateTime;

        /**
        * Represents date time field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            this.datetime = new Date(value);
        }
    }

    export class RichTextField implements FieldInterfaces.IField {

        /**
        * Resolved html in field - store here once the html was resolved to avoid resolving it multiple times
        */
        private resolvedHtml: string;

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.RichText;

        public richTextHtmlParser: IRichTextHtmlParser;
        public typeResolvers: TypeResolver[];
        public name: string;
        public value: any;
        public modularItems: ContentItem[];
        public links: Link[];
        public enableAdvancedLogging: boolean;
        public itemQueryConfig: IItemQueryConfig;

        /**
        * Represents rich text field of Kentico Cloud item
        * @constructor
        * @param {IRichTextHtmlParser} richTextHtmlParser - Parser used for working with HTML elements
        * @param {TypeResolver[]} typeResolvers - Type resolvers
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        * @param {ContentItem[]} modularItems - Modular items
        * @param {Link[]} links - Links in rich text field
        * @param {boolean} enableAdvancedLogging - Indicates if advanced issues are logged in console
        * @param {IItemQueryConfig} itemQueryConfig - Item query config
        */
        constructor(
            data: {
                richTextHtmlParser: IRichTextHtmlParser,
                typeResolvers: TypeResolver[],
                name: string,
                value: any,
                modularItems: ContentItem[],
                links: Link[],
                enableAdvancedLogging: boolean,
                itemQueryConfig: IItemQueryConfig
            }
        ) {
            Object.assign(this, data);
        }

        getHtml(): string {
            // check if html was already resolved
            if (this.resolvedHtml) {
                return this.resolvedHtml;
            }

            const richTextHelper = new RichTextResolver({
                typeResolvers: this.typeResolvers,
                queryConfig: this.itemQueryConfig,
                enableAdvancedLogging: this.enableAdvancedLogging,
                html: this.value,
                links: this.links,
                modularItems: this.modularItems,
                richTextHtmlParser: this.richTextHtmlParser
            });

            this.resolvedHtml = richTextHelper.resolveHtml();

            return this.resolvedHtml;
        }
    }

    export class NumberField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.Number;

        /**
        * Number value of this field
        */
        public number: number;

        /**
        * Represents number field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            this.number = value;
        }
    }

    export class AssetsField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.Asset;

        /**
        * List of assets used in this field
        */
        public assets: FieldModels.AssetModel[] = [];

        /**
        * Represents asset field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            if (!value) {
                throw Error(`Cannot bind assets field because no value was provided`);
            }

            if (!Array.isArray(value)) {
                throw Error(`Cannot bind assets because the provided value is not an array`);
            }

            this.value.forEach(asset => {
                const assetTemp = asset as FieldInterfaces.IAsset;
                this.assets.push(new FieldModels.AssetModel(
                    assetTemp.name,
                    assetTemp.type,
                    assetTemp.size,
                    assetTemp.description,
                    assetTemp.url
                ));
            });
        }
    }

    export class UrlSlugField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.UrlSlug;

        /**
        * Represents URL slug field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        * @param {ContentItem} item - Content item, required in order to get link object used by resolver
        * @param {((link: Link) => string) | undefined} linkResolver - Callback used to resolve links
        * @param {boolean} enableAdvancedLogging - Indicates if advanced issues are logged in console
        */
        constructor(
            public name: string,
            public value: string,
            public item: ContentItem,
            public linkResolver: ((link: Link) => string) | undefined,
            public enableAdvancedLogging: boolean
        ) {
        }

        getUrl(): string | undefined {
            if (!this.linkResolver) {
                if (this.enableAdvancedLogging) {
                    console.warn(`You have to implement 'linkResolver' in your Model class or your query in order to get url of this item`);
                }
                return undefined;
            }

            if (!this.item) {
                if (this.enableAdvancedLogging) {
                    console.warn(`Cannot resolve link for field '${this.name}' because no item was provided to URL slug field (item may be missing from response)`);
                }
                return undefined;
            }

            const url = this.linkResolver(new Link({
                urlSlug: this.value,
                type: this.type,
                codename: this.item.system.codename,
                itemId: this.item.system.id
            }));

            if (!url) {
                console.warn(`'linkResolver' is configured, but url resolved for '${this.item.system.codename}' item of '${this.item.system.type}' type inside '${this.name}' field resolved to an undefined url.`);
                return undefined;
            }

            return url;
        }
    }

    export class TaxonomyField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.Taxonomy;

        /**
        * List of assigned taxonomy terms
        */
        public taxonomyTerms: FieldModels.TaxonomyTerm[] = [];

        /**
        * Represents number field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        * @param {string | undefined} taxonomyGroup - Codename of the taxonomy group
        */
        constructor(
            public name: string,
            public value: any,
            public taxonomyGroup: string | undefined
        ) {
            if (!value) {
                throw Error(`Cannot map taxonomy field because no value was provided`);
            }

            if (!Array.isArray(value)) {
                throw Error(`Cannot get taxonomy field because the provided value is not an array`);
            }

            const taxonomyList = value as FieldInterfaces.ITaxonomyTerm[];

            taxonomyList.forEach(term => {
                this.taxonomyTerms.push(new FieldModels.TaxonomyTerm(term.name, term.codename));
            });
        }
    }
}

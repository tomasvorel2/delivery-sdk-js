// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// models
import { ElementResponses } from '../../models/element/responses';

// query params
import { Parameters } from '../../models/common/parameters';

// base query
import { BaseElementQuery } from './base-element-query.class';

// rxjs
import { Observable } from 'rxjs/Rx';

export class ElementQuery extends BaseElementQuery {

    constructor(
        protected config: DeliveryClientConfig,
        private typeCodename: string,
        private elementCodename: string
    ) {
        super(config)

        if (!typeCodename) {
            throw Error(`Codename of the type has to be provided`);
        }

        if (!elementCodename) {
            throw Error(`Codename of the element has to be provided`);
        }
    }

    /**
    * Gets the runnable Observable
    */
    get(): Observable<ElementResponses.ElementResponse> {
        return super.runElementQuery(this.typeCodename, this.elementCodename);
    }

    /**
    * Gets 'Url' representation of query
    */
    toString(): string {
        return super.getElementQueryUrl(this.typeCodename, this.elementCodename);
    }
}
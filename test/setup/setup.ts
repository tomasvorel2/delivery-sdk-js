import { DeliveryClient, DeliveryClientConfig, TypeResolver } from '../../lib';
import { Actor, Movie } from '../setup';
import { Context } from './context';

// ---------- default setup ------------- //
const defaultTypeResolvers: TypeResolver[] = [
    new TypeResolver('movie', () => new Movie()),
    new TypeResolver('actor', () => new Actor())
];

const defaultProjectId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';

// tslint:disable-next-line:max-line-length
const defaultPreviewApiKey = 'ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAidWlkIjogInVzcl8wdlFZQkNxQXZybm81cmlmSG5pWUVHIiwNCiAgImVtYWlsIjogInJpY2hhcmRzQGtlbnRpY28uY29tIiwNCiAgInByb2plY3RfaWQiOiAiZGE1YWJlOWYtZmRhZC00MTY4LTk3Y2QtYjM0NjRiZTJjY2I5IiwNCiAgImp0aSI6ICJpLXNFVWJlNmZPeUtBQmJOIiwNCiAgInZlciI6ICIxLjAuMCIsDQogICJnaXZlbl9uYW1lIjogIlJpY2hhcmQiLA0KICAiZmFtaWx5X25hbWUiOiAiU3VzdGVrIiwNCiAgImF1ZCI6ICJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSINCn0.jSq0owesXGAGf8l7e0Ue7wPkP28MT_--ZK5T02sO7yw';

const defaultSecuredApiKey = 'securedApiKey';

// ----------- setup function o------------ //
export function setup(context: Context) {

    // get delivery client with given context
    let projectId: string = defaultProjectId;
    let previewApiKey: string = defaultPreviewApiKey;
    let securedApiKey: string = defaultSecuredApiKey;
    let typeResolvers: TypeResolver[] = defaultTypeResolvers;

    // context settings override default setup
    if (context.projectId) {
        projectId = context.projectId;
    }

    if (context.previewApiKey) {
        previewApiKey = context.previewApiKey;
    }

    if (context.securedApiKey) {
        securedApiKey = context.securedApiKey;
    }

    if (context.typeResolvers) {
        typeResolvers = context.typeResolvers;
    }

    const deliveryClientConfig: DeliveryClientConfig = new DeliveryClientConfig(projectId, typeResolvers, {
        previewApiKey: previewApiKey,
        enablePreviewMode: context.usePreviewMode,
        defaultLanguage: context.defaultLanguage,
        baseUrl: context.baseUrl,
        basePreviewUrl: context.basePreviewUrl,
        securedApiKey: securedApiKey,
        enableSecuredMode: context.useSecuredMode
    })

    // set context
    context.projectId = projectId;
    context.previewApiKey = previewApiKey;
    context.typeResolvers = typeResolvers;
    context.defaultLanguage = context.defaultLanguage;
    context.baseUrl = context.baseUrl;
    context.basePreviewUrl = context.basePreviewUrl;
    context.securedApiKey = securedApiKey;

    // set delivery client
    context.deliveryClient = new DeliveryClient(deliveryClientConfig);
}

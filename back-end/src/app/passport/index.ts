import configureCookieStrategy from './strategies/cookie';
import configureHttpBearerStrategy from './strategies/http-bearer';

export default function configurePassport() {
    configureHttpBearerStrategy();
    configureCookieStrategy();
}

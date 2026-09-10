package com.montadora.gestao.config;

import org.springframework.boot.http.client.InetAddressFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SSRF hardening. As a @Bean this filter is applied to every auto-configured
 * HTTP client builder, so any outgoing call is restricted to public addresses.
 */
@Configuration(proxyBeanMethods = false)
public class HttpClientConfig {

    @Bean
    InetAddressFilter httpClientInetAddressFilter() {
        return InetAddressFilter.externalAddresses();
    }
}

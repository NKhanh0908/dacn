package com.hrm.dacn.configruations;

import com.hrm.dacn.enums.AccountRole;
import com.hrm.dacn.services.impl.OurUserDetailsService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfiguration {
    private final OurUserDetailsService ourUserDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${server.servlet.context-path}")
    private String contextPath;

    private static final String USER_ADMIN = AccountRole.ADMIN.name();
    private static final String USER_MANAGER = AccountRole.MANAGER.name();
    private static final String USER_HR = AccountRole.HR.name();
    private static final String USER_SUPERVISOR = AccountRole.SUPERVISOR.name();

    public WebSecurityConfiguration(OurUserDetailsService ourUserDetailsService,
                                    JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.ourUserDetailsService = ourUserDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity,
            CorsConfigurationSource corsConfigurationSource) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",

                                "/accounts",
                                "/accounts/sign-in",

                                "/department/{id}",
                                "/department/filter",

                                "/employee/filter",
                                "/employee/{id}",

                                "/recruitment/{id}",
                                "/recruitment/filter"
                        ).permitAll()

                        // Account management
                        .requestMatchers(HttpMethod.POST, contextPath + "/accounts")
                        .hasAnyRole(USER_ADMIN, USER_MANAGER, USER_SUPERVISOR)

                        // Department management
                        .requestMatchers(contextPath + "/department")
                        .hasAnyRole(USER_ADMIN)

                        // Role management
                        .requestMatchers(contextPath + "/role")
                        .hasAnyRole(USER_ADMIN, USER_MANAGER, USER_SUPERVISOR)

                        // Document management
                        .requestMatchers(contextPath + "/document-approvals")
                        .hasAnyRole(USER_ADMIN, USER_MANAGER, USER_SUPERVISOR)

                        // Contract management
                        .requestMatchers(contextPath + "/contract")
                        .hasAnyRole(USER_ADMIN, USER_MANAGER, USER_SUPERVISOR)
                        .requestMatchers(HttpMethod.DELETE, contextPath + "/contract/{id}")
                        .hasAnyRole(USER_ADMIN, USER_MANAGER)
                        .requestMatchers(HttpMethod.PUT, contextPath + "/contract/{id}/status")
                        .hasAnyRole(USER_ADMIN, USER_MANAGER, USER_SUPERVISOR)

                        // Employee management
                        .requestMatchers(HttpMethod.POST, contextPath + "/employee")
                        .hasAnyRole(USER_ADMIN, USER_MANAGER, USER_HR, USER_SUPERVISOR)
                        .requestMatchers(HttpMethod.DELETE, contextPath + "/employee")
                        .hasAnyRole(USER_ADMIN, USER_MANAGER, USER_SUPERVISOR)

                        // Notification management
                        .requestMatchers(HttpMethod.POST, contextPath + "/notifications/global")
                        .hasAnyRole(USER_ADMIN)
                        .requestMatchers(HttpMethod.POST, contextPath + "/notifications/department")
                        .hasAnyRole(USER_ADMIN, USER_MANAGER, USER_SUPERVISOR)

                        // Approvals management
                        .requestMatchers(contextPath + "/approvals")
                        .hasAnyRole(USER_ADMIN, USER_MANAGER, USER_SUPERVISOR)

                        // Apply management
                        .requestMatchers(HttpMethod.PATCH, contextPath + "/apply/{id}/status")
                        .hasAnyRole(USER_HR, USER_MANAGER, USER_SUPERVISOR)
                        .requestMatchers(HttpMethod.PATCH, contextPath + "/apply/reject")
                        .hasAnyRole(USER_HR, USER_MANAGER, USER_SUPERVISOR)
                        .requestMatchers(HttpMethod.PATCH, contextPath + "/apply/hire")
                        .hasAnyRole(USER_HR, USER_MANAGER, USER_SUPERVISOR)

                        // Evaluation management
                        .requestMatchers(contextPath + "/evaluate")
                        .hasAnyRole(USER_HR, USER_MANAGER, USER_SUPERVISOR)
                        .requestMatchers(HttpMethod.DELETE, contextPath + "/evaluate/{id}")
                        .hasAnyRole(USER_HR, USER_MANAGER, USER_SUPERVISOR)

                        // Recruitment Requirements management
                        .requestMatchers(HttpMethod.PATCH, contextPath + "/recruitment-requirements/{id}/status")
                        .hasAnyRole(USER_HR, USER_MANAGER)

                        // Recruitment management
                        .requestMatchers(HttpMethod.PATCH, contextPath + "/recruitment/approve")
                        .hasAnyRole(USER_HR, USER_MANAGER)
                        .requestMatchers(HttpMethod.PATCH, contextPath + "/recruitment/update-status")
                        .hasAnyRole(USER_HR, USER_MANAGER, USER_SUPERVISOR)

                        // Training management
                        .requestMatchers(HttpMethod.PATCH, contextPath + "/training-request/update-status")
                        .hasAnyRole(USER_MANAGER, USER_SUPERVISOR)

                        .anyRequest()
                        .authenticated())
                .httpBasic(withDefaults())
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider()).addFilterBefore(
                        jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    @Qualifier("daoAuthenticationProvider")
    public AuthenticationProvider authenticationProvider() {
        return new DaoAuthenticationProvider(
                ourUserDetailsService
        );
    }


}
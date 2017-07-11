package com.zongmu.gts.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.AuthenticationEntryPoint;

@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private AuthenticationEntryPoint authenticationEntryPoint;

	@Autowired
	private AppProperties appProperties;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable().httpBasic().authenticationEntryPoint(authenticationEntryPoint);
		http.authorizeRequests().antMatchers(this.appProperties.getAnonymousRequests())
				.permitAll();
		http.authorizeRequests().antMatchers("/**").hasAnyRole("USER")
				.anyRequest().authenticated();
	}
}

package com.zongmu.gts.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@ConfigurationProperties(prefix = "app")
@PropertySource(value = "classpath:/META-INF/app.properties")
public class AppProperties {

	private String[] anonymousRequests;
	private String loginUrl;


	public String getLoginUrl() {
		return loginUrl;
	}

	public void setLoginUrl(String loginUrl) {
		this.loginUrl = loginUrl;
	}

	public String[] getAnonymousRequests() {
		return anonymousRequests;
	}

	public void setAnonymousRequests(String[] anonymousRequests) {
		this.anonymousRequests = anonymousRequests;
	}
}

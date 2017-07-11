package com.zongmu.gts.config.impl;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.zongmu.gts.config.AppProperties;

@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {

	@Autowired
	private AppProperties appProperties;

	@Override
	public void commence(HttpServletRequest request,
			HttpServletResponse response, AuthenticationException authException)
			throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;

		if (httpRequest.getHeader("Accept") != null
				&& httpRequest.getHeader("Accept").contains("json")) {
			httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		RequestDispatcher dispatcher = request
				.getRequestDispatcher(this.appProperties.getLoginUrl());
		dispatcher.forward(request, response);
	}
}

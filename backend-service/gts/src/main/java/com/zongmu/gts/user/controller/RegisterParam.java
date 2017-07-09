package com.zongmu.gts.user.controller;

import javax.mail.internet.InternetAddress;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zongmu.gts.core.BusinessException;
import com.zongmu.gts.core.ErrorCode;

public class RegisterParam {
	private final static Logger LOGGER = LoggerFactory.getLogger(RegisterParam.class);

	private String email;
	private String password;
	private String repeatPassword;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRepeatPassword() {
		return repeatPassword;
	}

	public void setRepeatPassword(String repeatPassword) {
		this.repeatPassword = repeatPassword;
	}

	public void onValid() throws BusinessException {
		this.validatorEmail();

		if (!StringUtils.equals(this.getPassword(), this.getRepeatPassword())) {
			throw new BusinessException(ErrorCode.Password_NOT_MATCH);
		}
	}

	private void validatorEmail() throws BusinessException {
		try {
			new InternetAddress(this.email, true);
		} catch (Exception ex) {
			LOGGER.error("Email {} format invalid", this.getEmail());
			throw new BusinessException(ErrorCode.EMAIL_FORMAT_INVALID);
		}
	}
}

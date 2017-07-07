package com.zongmu.gts.core;

import java.io.Serializable;

public class BusinessException extends Exception implements Serializable {
	private static final long serialVersionUID = 1592715429646272228L;

	public BusinessException(String code) {
		this.code = code;
	}

	public BusinessException(String code, String message) {
		this.code = code;
		this.message = message;
	}

	private String code;
	private String message;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}

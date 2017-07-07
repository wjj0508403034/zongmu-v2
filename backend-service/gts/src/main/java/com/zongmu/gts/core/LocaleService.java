package com.zongmu.gts.core;

public interface LocaleService {

	String getMessage(String key);

	String getSubject(String key);

	String getErrorMessage(String errorCode);

}

package com.zongmu.gts.email;

import org.thymeleaf.TemplateEngine;

import com.zongmu.gts.core.BusinessException;
import com.zongmu.gts.core.LocaleService;


public interface EmailTemplate {

	String getHtml(TemplateEngine templateEngine) throws BusinessException;

	void setVariable(String name, Object value);

	String getSubject(LocaleService localeService);
}

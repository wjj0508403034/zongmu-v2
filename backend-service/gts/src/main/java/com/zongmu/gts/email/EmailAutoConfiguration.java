package com.zongmu.gts.email;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import com.zongmu.gts.core.LocaleService;
import com.zongmu.gts.email.impl.EmailServiceImpl;


@Configuration
public class EmailAutoConfiguration {

	@Bean
	public EmailService emailService(SmtpProperties smtp, LocaleService localeService) {
		return new EmailServiceImpl(emailTemplateEngine(localeService), smtp, localeService);
	}

	private SpringTemplateEngine emailTemplateEngine(LocaleService localeService) {
		SpringTemplateEngine templateEngine = new SpringTemplateEngine();
		templateEngine.addTemplateResolver(emailTemplateResolver());
		templateEngine.setTemplateEngineMessageSource(localeService.getMessageSource());;
		return templateEngine;
	}

	private ClassLoaderTemplateResolver emailTemplateResolver() {
		ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
		templateResolver.setPrefix("EMAIL-TEMPLATES/");
		templateResolver.setTemplateMode("LEGACYHTML5");
		templateResolver.setSuffix(".html");
		templateResolver.setOrder(1);
		templateResolver.setCacheable(false);
		return templateResolver;
	}
}

package com.zongmu.gts.core;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.joda.time.DateTime;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class EntityModelAspect {

	@Before("execution(* org.springframework.data.repository.CrudRepository.save(..)) && args(entity)")
	public void beforeCreate(Object entity) {
		if (entity instanceof EntityModel) {
			EntityModel model = (EntityModel) entity;
			DateTime now = DateTime.now();
			if (model.getId() == null) {
				model.setCreateTime(now);
			}

			model.setUpdateTime(now);
		}
	}
}
